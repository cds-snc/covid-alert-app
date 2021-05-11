//
//  DateUtils.h
//  CovidShield
//
//  Created by Clement Janin on 2021-05-07.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface DateUtils : NSObject

+ (BOOL)isSameDay:(NSDate *)date1 date2:(NSDate *)date2;
+ (NSDate *)getCurrentUTCDate;

@end

NS_ASSUME_NONNULL_END
