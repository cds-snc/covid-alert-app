//
//  DateUtils.m
//  CovidShield
//
//  Created by Clement Janin on 2021-05-07.
//

#import "DateUtils.h"

@implementation DateUtils

+ (BOOL)isSameDay:(NSDate *)date1 date2:(NSDate *)date2
{
  return [[NSCalendar currentCalendar] isDate:date1 inSameDayAsDate:date2];
}

+ (NSDate *)getCurrentUTCDate;
{
  return [NSDate date];
}

@end
