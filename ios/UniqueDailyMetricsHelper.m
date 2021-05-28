//
//  UniqueDailyMetricsHelper.m
//  CovidShield
//
//  Created by Clement Janin on 2021-05-07.
//

#import "UniqueDailyMetricsHelper.h"
#import "DateUtils.h"

@interface UniqueDailyMetricsHelper ()

@property (nonatomic, strong) NSUserDefaults *userDefaults;

@end

@implementation UniqueDailyMetricsHelper

- (instancetype)init
{
  self = [super init];
  if (self) {
    self.userDefaults = [NSUserDefaults standardUserDefaults];
  }
  return self;
}

- (BOOL)canPublishMetricWithIdentifier:(NSString *)identifier currentDate:(NSDate *)currentDate
{
  NSDate *retrieveUTCDate = [self.userDefaults objectForKey:identifier];
  if (retrieveUTCDate != nil) {
    return ![DateUtils isSameDay:retrieveUTCDate date2:currentDate];
  } else {
    return YES;
  }
}

- (void)markMetricAsPublishedWithIdentifier:(NSString *)identifier currentDate:(NSDate *)currentDate
{
  [self.userDefaults setObject:currentDate forKey:identifier];
}

@end
