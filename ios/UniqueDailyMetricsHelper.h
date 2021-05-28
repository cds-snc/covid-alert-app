//
//  UniqueDailyMetricsHelper.h
//  CovidShield
//
//  Created by Clement Janin on 2021-05-07.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface UniqueDailyMetricsHelper : NSObject

- (BOOL)canPublishMetricWithIdentifier:(NSString *)identifier currentDate:(NSDate *)currentDate;
- (void)markMetricAsPublishedWithIdentifier:(NSString *)identifier currentDate:(NSDate *)currentDate;

@end

NS_ASSUME_NONNULL_END
