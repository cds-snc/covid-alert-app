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

@interface MetricsService ()

@property (strong, nonatomic) MetricsJsonSerializer *jsonSerializer;
@property (strong, nonatomic) MetricsPusher *pusher;

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
  }
  return self;
}

- (void)publishScheduledCheckMetricWithType:(ScheduledCheckMetricType)type
{
  NSString *identifier = type == Start ? @"scheduled-check-started-today" : @"scheduled-check-successful-today";
  NSNumber *timestamp = @((long long)([[NSDate date] timeIntervalSince1970] * 1000.0));
  
  Metric *metric = [[Metric alloc] initWithTimestamp:timestamp identifier:identifier region:@"None"];
  
  NSData *jsonPayload = [self.jsonSerializer serializeToJsonWithTimestamp:timestamp metric:metric];
  
  [self.pusher pushJsonData:jsonPayload completion:^(MetricsPusherResult result) {
    //
  }];
}

@end
