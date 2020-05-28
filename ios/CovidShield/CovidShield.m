//
//  CovidShield.m
//  CovidShield
//
//  Created by Sergey Gavrilyuk on 2020-05-15.
//

#import "CovidShield.h"
#import <React/RCTConvert.h>

@implementation CovidShield
RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(getRandomBytes, randomBytesWithSize:(NSUInteger)size withResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  void *buff = malloc(size);
  int status = SecRandomCopyBytes(kSecRandomDefault, size, buff);
  if (status == 0) {
    NSString *base64encoded = [[[NSData alloc] initWithBytes:buff length:size] base64EncodedStringWithOptions:0];
    resolve(base64encoded);
  }

}

RCT_REMAP_METHOD(downloadDiagnosisKeysFile, downloadDiagnosisKeysFileWithURL:(NSString *)url WithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  NSURLSession *session = [NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]];
  NSURL *taskURL = [RCTConvert NSURL:url];
  [[session downloadTaskWithURL:taskURL
              completionHandler:^(NSURL * _Nullable location, NSURLResponse * _Nullable response, NSError * _Nullable error) {
    if (error) {
      reject([NSString stringWithFormat:@"%ld", (long)error.code], error.localizedDescription ,error);
      return;
    }
    if ([(NSHTTPURLResponse *)response statusCode] != 200) {
      reject([NSString stringWithFormat:@"%ld", (long)[(NSHTTPURLResponse *)response statusCode]],
             [NSString stringWithContentsOfURL:location encoding:NSUTF8StringEncoding error:nil], nil);
      return;
    }
    resolve(location);
  }] resume];
}

@end
