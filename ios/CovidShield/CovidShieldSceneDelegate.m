#import "AppDelegate.h"
#import "CovidShieldSceneDelegate.h"

@implementation CovidShieldSceneDelegate {
  __weak UIView *_maskingView;
}

- (void)sceneDidEnterBackground:(UIScene *)scene {
  UIView *rootView = ((AppDelegate*)UIApplication.sharedApplication.delegate)
    .window.rootViewController.view;
  UIView *maskingView = [[UIView alloc] initWithFrame: rootView.bounds];
  maskingView.backgroundColor = UIColor.systemBackgroundColor;
  [rootView insertSubview: maskingView
                  atIndex: rootView.subviews.count];
  _maskingView = maskingView;
}

- (void)sceneWillEnterForeground:(UIScene *)scene {
  [_maskingView removeFromSuperview];
}
@end
