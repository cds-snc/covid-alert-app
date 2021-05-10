//
//  UniqueDailyMetricsHelper.h
//  CovidShield
//
//  Created by Clement Janin on 2021-05-07.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface UniqueDailyMetricsHelper : NSObject

- (BOOL)canPublishMetricWithIdentifier:(NSString *)identifier;
- (void)markMetricAsPublishedWithIdentifier:(NSString *)identifier;

@end

NS_ASSUME_NONNULL_END
