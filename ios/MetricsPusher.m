//
//  MetricsPusher.m
//  CovidShield
//
//  Created by Clement Janin on 2021-04-28.
//

#import "MetricsPusher.h"

@interface MetricsPusher ()

@property (strong, nonatomic) NSString *apiEndpointUrl;
@property (strong, nonatomic) NSString *apiEndpointKey;

@end

@implementation MetricsPusher

- (instancetype)initWithApiEndpointUrl:(NSString *)apiUrl apiEndpointKey:(NSString *)apiKey
{
  self = [super init];
  if (self) {
    self.apiEndpointUrl = apiUrl;
    self.apiEndpointKey = apiKey;
  }
  return self;
}

- (void)pushJsonData:(NSData *)jsonData completion:(void (^)(MetricsPusherResult))completion
{
  NSMutableURLRequest *request = [NSMutableURLRequest new];
  [request setHTTPMethod:@"POST"];
  [request setURL:[NSURL URLWithString:self.apiEndpointUrl]];
  [request setValue:@"application/json" forHTTPHeaderField:@"Accept"];
  [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
  [request setValue:self.apiEndpointKey forHTTPHeaderField:@"x-api-key"];
  [request setHTTPBody:jsonData];
  
  NSURLSession *session = [NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration ephemeralSessionConfiguration]];
  
  NSURLSessionDataTask *task = [session dataTaskWithRequest:request
                                          completionHandler:^(NSData * _Nullable data,
                                                              NSURLResponse * _Nullable response,
                                                              NSError * _Nullable error) {
    NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)response;
    if (error == nil && httpResponse.statusCode == 200) {
      completion(Success);
    } else {
      completion(Error);
    }
  }];
  
  [task resume];
}

@end
