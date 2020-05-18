//
//  ExposureNotification.h
//  CovidShield
//
//  Created by Sergey Gavrilyuk on 2020-05-03.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <ExposureNotification/ExposureNotification.h>

NS_ASSUME_NONNULL_BEGIN


@interface ExposureNotification : NSObject<RCTBridgeModule>
@property (nonatomic, nullable, strong) ENManager *enManager;
@end

NS_ASSUME_NONNULL_END
