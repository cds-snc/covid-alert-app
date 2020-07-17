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
  NSURLSessionConfiguration *sconf = [NSURLSessionConfiguration defaultSessionConfiguration];

  NSDictionary *env = [ReactNativeConfig env];
  long long max_t = [env[@"DOWNLOAD_TIMEOUT_SECONDS"] longLongValue];
  if(max_t > 0) sconf.timeoutIntervalForResource = max_t;

  id<NSURLSessionDelegate> del;
  long long max_l = [env[@"MAXIMUM_DOWNLOAD_SIZE_KB"] longLongValue];
  del = [[CovidShieldURLSessionDelegate alloc] initWithMaxDownloadSize: max_l * 1024
                                                     completionHandler: ^(NSURL *location, NSURLResponse *response, NSError *error) {
    if (error) {
      reject([NSString stringWithFormat:@"%ld", (long)error.code], error.localizedDescription ,error);
      return;
    }
    if ([(NSHTTPURLResponse *)response statusCode] != 200) {
      reject([NSString stringWithFormat:@"%ld", (long)[(NSHTTPURLResponse *)response statusCode]],
             [NSString stringWithContentsOfURL:location encoding:NSUTF8StringEncoding error:nil], nil);
      return;
    }
    NSURL *temporaryDirectoryURL = [NSURL fileURLWithPath: NSTemporaryDirectory() isDirectory: YES];

    NSURL* destination = [temporaryDirectoryURL URLByAppendingPathComponent: [NSString stringWithFormat:@"%@.zip", [[NSUUID UUID] UUIDString]]];

    [[NSFileManager defaultManager] copyItemAtURL:location toURL:destination error:nil];
    resolve(destination.path);

  }];
  
  NSURLSession *session = [NSURLSession sessionWithConfiguration: sconf
                                                        delegate: del
                                                   delegateQueue: nil];

  
  
  NSURL *taskURL = [RCTConvert NSURL:url];
  [[session downloadTaskWithURL:taskURL] resume];
}

@end
