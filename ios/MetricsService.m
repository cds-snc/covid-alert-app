//
//  MetricsService.m
//  CovidShield
//
//  Created by Clement Janin on 2021-05-03.
//

#import "MetricsService.h"
#import "MetricsJsonSerializer.h"
#import "MetricsPusher.h"
#import <UIKit/UIDevice.h>
#import "UniqueDailyMetricsHelper.h"
#import <RNCAsyncStorage/RNCAsyncStorage.h>

@interface MetricsService ()

@property (strong, nonatomic) MetricsJsonSerializer *jsonSerializer;
@property (strong, nonatomic) MetricsPusher *pusher;
@property (strong, nonatomic) UniqueDailyMetricsHelper *uniqueDailyMetricsHelper;
@property (strong, nonatomic) NSOperationQueue *operationQueue;

@end

@implementation MetricsService

+ (instancetype)sharedInstance
{
    static MetricsService *sharedInstance = nil;
    static dispatch_once_t onceToken;

    dispatch_once(&onceToken, ^{
        sharedInstance = [[MetricsService alloc] init];
    });
    return sharedInstance;
}

- (instancetype)init
{
  self = [super init];
  if (self) {
    self.jsonSerializer = [[MetricsJsonSerializer alloc] initWithAppVersion:[[NSBundle mainBundle] objectForInfoDictionaryKey: @"CFBundleShortVersionString"]
                                                                  osVersion:[[UIDevice currentDevice] systemVersion]];
    self.pusher = [[MetricsPusher alloc] initWithApiEndpointUrl:PM_METRICS_URL
                                                 apiEndpointKey:PM_METRICS_API_KEY];
    self.uniqueDailyMetricsHelper = [[UniqueDailyMetricsHelper alloc] init];
    self.operationQueue = [NSOperationQueue new];
    self.operationQueue.maxConcurrentOperationCount = 1;
  }
  return self;
}

- (void)publishMetric:(MetricType)type bridge:(RCTBridge *)bridge
{
  [self.operationQueue addOperationWithBlock:^{
    [self.operationQueue setSuspended:YES];
    
    NSString *identifier = [self identifierFromMetricType:type];
    
    if ([self.uniqueDailyMetricsHelper canPublishMetricWithIdentifier:identifier]) {
      
      NSString *region = [self getRegionWithBridge:bridge];
      
      NSNumber *timestamp = @((long long)([[NSDate date] timeIntervalSince1970] * 1000.0));
      
      Metric *metric = [[Metric alloc] initWithTimestamp:timestamp identifier:identifier region:region];
      
      NSData *jsonPayload = [self.jsonSerializer serializeToJsonWithTimestamp:timestamp metric:metric];
      
      [self.pusher pushJsonData:jsonPayload completion:^(MetricsPusherResult result) {
        if (result == Success) {
          [self.uniqueDailyMetricsHelper markMetricAsPublishedWithIdentifier:identifier];
        }
        [self.operationQueue setSuspended:NO];
      }];
      
    } else {
      [self.operationQueue setSuspended:NO];
    }
  }];
}

- (void)waitUntilAllMetricsAreSent
{
  [self.operationQueue waitUntilAllOperationsAreFinished];
}

- (NSString *)identifierFromMetricType:(MetricType)type
{
  switch (type) {
    case ScheduledCheckStartedToday:
      return @"scheduled-check-started-today";
    case ScheduledCheckSuccessfulToday:
      return @"scheduled-check-successful-today";
    case ActiveUser:
      return @"active-user";
  }
}

- (NSString *)getRegionWithBridge:(RCTBridge *)bridge
{
  __block NSString *region = @"None";
  
  RNCAsyncStorage *asyncStorage = [bridge moduleForClass:[RNCAsyncStorage class]];
  
  dispatch_sync(asyncStorage.methodQueue, ^{
    [asyncStorage multiGet:@[@"Region"] callback:^(NSArray *response) {
        if (![response[0] isKindOfClass:[NSError class]] && ![response[1][0][1] isKindOfClass:[NSNull class]]) {
          region = response[1][0][1];
        }
    }];
  });
  
  return region;
}

@end
