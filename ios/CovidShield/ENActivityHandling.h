//
//  ENActivityHandling.h
//  CovidShield
//
//  Created by  Clement Janin on 2020-12-16.
//

#import <Foundation/Foundation.h>
#import <ExposureNotification/ExposureNotification.h>

NS_ASSUME_NONNULL_BEGIN

@interface ENManager (ENActivityHandling)

- (void)setLaunchActivityHandler:(ENActivityHandler)activityHandler;

@end

NS_ASSUME_NONNULL_END
