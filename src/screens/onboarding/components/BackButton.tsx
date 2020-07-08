import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from '@shopify/react-i18n';
import {Button, Box} from 'components';

export const BackButton = ({onBack}: {onBack?: any}) => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const prevItem = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  return (
    <Box flexDirection="row">
      <Box align-self="flex-start">
        <Button
          backButton
          text={i18n.translate('Onboarding.ActionBack')}
          color="linkText"
          variant="text"
          onPress={onBack ? onBack : prevItem}
        />
      </Box>
    </Box>
  );
};
