#import "CovidShieldURLSessionDelegate.h"
#import <React/RCTLog.h>

@implementation CovidShieldURLSessionDelegate {
  uint64_t _sizeLimit;
  void (^_handler)(NSURL *, NSURLResponse * , NSError *);
  NSURL *_location;
  NSError *_fsError;
}

- (instancetype)initWithMaxDownloadSize: (NSUInteger)sizeLimit
                      completionHandler: (void (^)(NSURL *, NSURLResponse * , NSError *)) handler{
  if(self = [super init]) {
    _sizeLimit = sizeLimit;
    _handler = handler;
  }

  return self;
}

- (void)URLSession: (NSURLSession *)sess
      downloadTask: (NSURLSessionDownloadTask *)task
      didWriteData: (int64_t)written
 totalBytesWritten: (int64_t)totalWritten
totalBytesExpectedToWrite: (int64_t)totalExpected {
  if((totalExpected != NSURLSessionTransferSizeUnknown &&
      totalExpected > _sizeLimit) || (totalWritten > _sizeLimit)) {
    RCTLogWarn(@"cancelling download task due to exceeding download size limit");
    [task cancel];
  }
}

- (void)URLSession:(NSURLSession *)session downloadTask:(NSURLSessionDownloadTask *)downloadTask didFinishDownloadingToURL:(NSURL *)location {
  NSFileManager *fm = [NSFileManager defaultManager];
  NSError *err = nil;
  _location = [[fm temporaryDirectory] URLByAppendingPathComponent: [[NSUUID UUID] UUIDString]];
  if(![fm moveItemAtURL:location toURL:_location error:&err]) {
    _fsError = err;
  }
}

- (void)URLSession: (NSURLSession *)session task: (NSURLSessionTask*)task
didCompleteWithError: (NSError *)error {
  _handler(_location, task.response, error?error:_fsError);
}


@end
