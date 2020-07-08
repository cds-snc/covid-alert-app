import React, {useRef, useLayoutEffect, ReactNode} from 'react';
import {StyleSheet, Image, ImageSourcePropType, AccessibilityInfo, findNodeHandle} from 'react-native';
import {Text} from 'components';

import {OnboardingKey} from '../OnboardingContent';

export interface ItemViewProps {
  item: OnboardingKey;
  image?: ImageSourcePropType;
  altText?: string;
  header: string;
  isActive: boolean;
  children?: ReactNode;
  showImage?: boolean;
}

export const ItemView = ({item, image, isActive, altText, header, children, showImage}: ItemViewProps) => {
  const imageRef = useRef<any>();

  useLayoutEffect(() => {
    const tag = findNodeHandle(imageRef.current);
    if (isActive && tag) {
      AccessibilityInfo.setAccessibilityFocus(tag);
    }
  }, [isActive, item]);

  return (
    <>
      {showImage ? (
        <Image ref={imageRef} style={styles.image} source={image} accessible accessibilityLabel={altText} />
      ) : null}
      <Text variant="bodyTitle" color="overlayBodyText" marginBottom="l" accessibilityRole="header">
        {header}
      </Text>
      {children}
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 189,
    marginBottom: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});

ItemView.defaultProps = {
  showImage: true,
};
