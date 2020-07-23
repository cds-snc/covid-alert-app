//
//  CovidShield.m
//  CovidShield
//
//  Created by Sergey Gavrilyuk on 2020-05-15.
//

#import "CovidShield.h"
#import <React/RCTConvert.h>
#import "ReactNativeConfig.h"
#import "CovidShieldURLSessionDelegate.h"

@implementation CovidShield
RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(getRandomBytes, randomBytesWithSize:(NSUInteger)size withResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  void *buff = malloc(size);
  int status = SecRandomCopyBytes(kSecRandomDefault, size, buff);
  if (status == errSecSuccess) {
    NSString *base64encoded = [[[NSData alloc] initWithBytes:buff length:size] base64EncodedStringWithOptions:0];
    resolve(base64encoded);
  } else {
    NSError *error = [NSError errorWithDomain:NSOSStatusErrorDomain code:status userInfo:nil];
    reject([NSString stringWithFormat:@"%ld", (long)error.code], error.localizedDescription ,error);
  }
  free(buff);
}


RCT_REMAP_METHOD(downloadDiagnosisKeysFile, downloadDiagnosisKeysFileWithURL:(NSString *)url WithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  [[self downloadTaskWithURL: [RCTConvert NSURL:url] failureHandler: reject
              successHandler: ^(NSURL *fileLocation) {
        NSURL *temporaryDirectoryURL = [NSURL fileURLWithPath: NSTemporaryDirectory() isDirectory: YES];

        NSURL* destination = [temporaryDirectoryURL URLByAppendingPathComponent: [NSString stringWithFormat:@"%@.zip", [[NSUUID UUID] UUIDString]]];

        [[NSFileManager defaultManager] copyItemAtURL:fileLocation toURL:destination error:nil];
        resolve(destination.path);
      }] resume];
}

RCT_REMAP_METHOD(fetchExposureConfiguration, fetchExposureConfigurationWithURL: (NSString *)url withResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  [[self downloadTaskWithURL: [RCTConvert NSURL:url] failureHandler: reject
              successHandler: ^(NSURL *fileLocation) {
        resolve([NSString stringWithContentsOfURL: fileLocation encoding: NSUTF8StringEncoding
                                            error: nil]);
      }] resume];
}

#pragma mark Private methods

- (NSURLSessionTask *)downloadTaskWithURL: (NSURL *)url failureHandler: (RCTPromiseRejectBlock)reject successHandler: (void (^)(NSURL*))successHandler {
  return [[self configuredSessionWithCompletionHandler: ^(NSURL *location, NSURLResponse *resp, NSError *error) {
        if (error) {
          reject([NSString stringWithFormat:@"%ld", (long)error.code], error.localizedDescription,
                 error);
        } else if ([(NSHTTPURLResponse *)resp statusCode] != 200) {
          reject([NSString stringWithFormat:@"%ld", (long)[(NSHTTPURLResponse *)resp statusCode]],
                 [NSString stringWithContentsOfURL: location encoding: NSUTF8StringEncoding
                                             error: nil], nil);
        } else {
          successHandler(location);
          [[NSFileManager defaultManager] removeItemAtURL:location error:nil];
        }
      }] downloadTaskWithURL: url];
}

- (NSURLSession *)configuredSessionWithCompletionHandler: (void (^)(NSURL *, NSURLResponse *, NSError *)) completion {
  NSURLSessionConfiguration *sconf = [NSURLSessionConfiguration defaultSessionConfiguration];

  NSDictionary *env = [ReactNativeConfig env];
  long long max_t = [env[@"DOWNLOAD_TIMEOUT_SECONDS"] longLongValue];
  if(max_t > 0) sconf.timeoutIntervalForResource = max_t;

  id<NSURLSessionDelegate> del;
  long long max_l = [env[@"MAXIMUM_DOWNLOAD_SIZE_KB"] longLongValue];
  del = [[CovidShieldURLSessionDelegate alloc] initWithMaxDownloadSize: max_l * 1024
                                                     completionHandler: completion];
  return [NSURLSession sessionWithConfiguration: sconf delegate: del delegateQueue: nil];
}

@end
