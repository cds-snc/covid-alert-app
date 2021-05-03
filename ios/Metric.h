//
//  Metric.h
//  CovidShield
//
//  Created by Clement Janin on 2021-04-28.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface Metric : NSObject

@property (strong, nonatomic, readonly) NSNumber *timestamp;
@property (strong, nonatomic, readonly) NSString *identifier;
@property (strong, nonatomic, readonly) NSString *region;

- (instancetype)initWithTimestamp:(NSNumber *)timestamp identifier:(NSString *)identifier region:(NSString *)region;

@end

NS_ASSUME_NONNULL_END
