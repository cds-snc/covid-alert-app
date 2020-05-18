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

RCT_REMAP_METHOD(downloadDiagnosisKeysFiles, downloadDiagnosisKeysFilesWithURL:(NSString *)url WithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
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
    NSArray *fileUrls = [self breakUpFile:location];
    resolve(fileUrls);
  }] resume];
}


- (NSArray *)breakUpFile:(NSURL *)fileUrl {
  NSURL *temporaryDirectoryURL = [NSURL fileURLWithPath: NSTemporaryDirectory() isDirectory: YES];

  NSData *data = [[NSData alloc] initWithContentsOfURL:fileUrl];
  NSUInteger offset = 0;
  NSMutableArray *newFileUrls = [NSMutableArray new];
  while (offset < data.length) {
    uint32_t size;
    [data getBytes:&size range:NSMakeRange(offset, sizeof(size))];
    offset += sizeof(size);
    
    // reverse endianness
    uint8_t *sizeBuff = (uint8_t *)&size;
    size = (sizeBuff[0] << 24) + (sizeBuff[1] << 16) + (sizeBuff[2] << 8) + sizeBuff[3];
    
    if (size == 0) break;
    
    NSData *fileBytes = [data subdataWithRange:NSMakeRange(offset, size)];
    offset += size;
    
    NSString *filename = [[NSUUID UUID] UUIDString];
    NSURL *newFileUrl = [temporaryDirectoryURL URLByAppendingPathComponent:filename];
    [fileBytes writeToURL:newFileUrl atomically:YES];
    [newFileUrls addObject:newFileUrl.absoluteString];
  }
  return newFileUrls.copy;
}
@end
