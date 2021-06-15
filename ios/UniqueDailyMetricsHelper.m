//
//  UniqueDailyMetricsHelper.m
//  CovidShield
//
//  Created by Clement Janin on 2021-05-07.
//

#import "UniqueDailyMetricsHelper.h"
#import "DateUtils.h"

@interface UniqueDailyMetricsHelper ()

@property (nonatomic, strong) NSFileManager *fileManager;
@property (nonatomic, strong) NSString *filePath;

@end

@implementation UniqueDailyMetricsHelper

- (instancetype)init
{
  self = [super init];
  if (self) {
    self.fileManager = [NSFileManager defaultManager];
    self.filePath = [[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0] stringByAppendingPathComponent:@"unique-daily-metrics-savestate.json"];
  }
  return self;
}

- (BOOL)canPublishMetricWithIdentifier:(NSString *)identifier currentDate:(NSDate *)currentDate
{
  NSDictionary *savestate = [self readSavestate];
  NSNumber *retrievedTimestamp = [savestate objectForKey:identifier];
  if (retrievedTimestamp != nil) {
    NSDate *retrieveUTCDate = [NSDate dateWithTimeIntervalSince1970:retrievedTimestamp.doubleValue];
    return ![DateUtils isSameDay:retrieveUTCDate date2:currentDate];
  } else {
    return YES;
  }
}

- (void)markMetricAsPublishedWithIdentifier:(NSString *)identifier currentDate:(NSDate *)currentDate
{
  NSMutableDictionary *savestate = [[self readSavestate] mutableCopy];
  [savestate setObject:@(currentDate.timeIntervalSince1970) forKey:identifier];
  [self writeSavestate:savestate];
}

- (NSDictionary *)readSavestate
{
  if ([self.fileManager fileExistsAtPath:self.filePath]) {
    NSData *data = [self.fileManager contentsAtPath:self.filePath];
    return [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:nil];
  } else {
    return @{};
  }
}

- (void)writeSavestate:(NSDictionary *)dictionary
{
  if ([self.fileManager fileExistsAtPath:self.filePath] == NO) {
    [self.fileManager createFileAtPath:self.filePath contents:nil attributes:nil];
  }
  
  NSData *data = [NSJSONSerialization dataWithJSONObject:dictionary options:kNilOptions error:nil];
  [data writeToFile:self.filePath atomically:YES];
}

@end
