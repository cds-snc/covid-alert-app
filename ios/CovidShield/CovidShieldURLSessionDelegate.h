#import <Foundation/Foundation.h>

@interface CovidShieldURLSessionDelegate : NSObject<NSURLSessionDelegate,
                                                    NSURLSessionTaskDelegate,
                                                    NSURLSessionDownloadDelegate>
- (instancetype)initWithMaxDownloadSize: (NSUInteger)sizeLimit
                      completionHandler: (void (^)(NSURL *, NSURLResponse * , NSError *)) handler;
@end
