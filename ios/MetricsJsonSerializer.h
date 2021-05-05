//
//  MetricsJsonSerializer.h
//  CovidShield
//
//  Created by Clement Janin on 2021-04-28.
//

#import <Foundation/Foundation.h>
#import "Metric.h"

NS_ASSUME_NONNULL_BEGIN

@interface MetricsJsonSerializer : NSObject

- (instancetype)initWithAppVersion:(NSString *)appVersion osVersion:(NSString *)osVersion;

- (NSData *)serializeToJsonWithTimestamp:(NSNumber *)timestamp metric:(Metric *)metric;

@end

NS_ASSUME_NONNULL_END
