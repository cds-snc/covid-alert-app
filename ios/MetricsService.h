//
//  MetricsService.h
//  CovidShield
//
//  Created by Clement Janin on 2021-05-03.
//

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSUInteger, ScheduledCheckMetricType) {
  Start,
  End
};

NS_ASSUME_NONNULL_BEGIN

@interface MetricsService : NSObject

+ (instancetype)sharedInstance;

- (void)publishScheduledCheckMetricWithType:(ScheduledCheckMetricType)type;

@end

NS_ASSUME_NONNULL_END
