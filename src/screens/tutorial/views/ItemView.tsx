import React from 'react';
import {StyleSheet, Image, ImageSourcePropType} from 'react-native';
import {Text, Box} from 'components';
import {useI18n} from '@shopify/react-i18n';

import {TutorialKey} from '../TutorialContent';

interface ItemViewProps {
  item: TutorialKey;
  image?: ImageSourcePropType;
}

export const ItemView = ({item, image}: ItemViewProps) => {
  const [i18n] = useI18n();
  return (
    <Box>
      {image && (
        <Image
          style={styles.image}
          source={image}
          accessible
          accessibilityLabel={i18n.translate(`Tutorial.${item}AltText`)}
        />
      )}
      <Text variant="bodyTitle" color="overlayBodyText" marginBottom="l" accessibilityRole="header">
        {i18n.translate(`Tutorial.${item}Title`)}
      </Text>
      <Text variant="bodyText" color="overlayBodyText">
        {i18n.translate(`Tutorial.${item}`)}
      </Text>
    </Box>
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
