//
//  MetricsService.h
//  CovidShield
//
//  Created by Clement Janin on 2021-05-03.
//

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSUInteger, MetricType) {
  ScheduledCheckStartedToday,
  ScheduledCheckSuccessfulToday,
  ActiveUser
};

NS_ASSUME_NONNULL_BEGIN

@interface MetricsService : NSObject

+ (instancetype)sharedInstance;

- (void)publishMetric:(MetricType)type;

@end

NS_ASSUME_NONNULL_END
