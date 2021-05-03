//
//  MetricsPusher.h
//  CovidShield
//
//  Created by Clement Janin on 2021-04-28.
//

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSUInteger, MetricsPusherResult) {
  Success,
  Error
};

NS_ASSUME_NONNULL_BEGIN

@interface MetricsPusher : NSObject

- (instancetype)initWithApiEndpointUrl:(NSString *)apiUrl apiEndpointKey:(NSString *)apiKey;

- (void)pushJsonData:(NSData *)jsonData completion:(void (^)(MetricsPusherResult))completion;

@end

NS_ASSUME_NONNULL_END
