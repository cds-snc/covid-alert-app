import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {Box, Button} from 'components';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from 'locale';

import {BackButton} from '../views/BackButton';

export interface ToolbarProps {
  navText?: string;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  useWhiteText?: boolean;
}

export const Toolbar = ({navText, showBackButton, showCloseButton, useWhiteText}: ToolbarProps) => {
  const navigation = useNavigation();
  const close = useCallback(() => navigation.navigate('Home'), [navigation]);
  return (
    <Box flexDirection="row" alignItems="center" minHeight={56}>
      {showBackButton ? <QRBackButton useWhiteText={useWhiteText} /> : null}
      {showCloseButton ? (
        <Box style={styles.right}>
          <Button testID="toolbarCloseButton" text={navText} variant="text" onPress={close} />
        </Box>
      ) : null}
    </Box>
  );
};

const QRBackButton = ({useWhiteText}: {useWhiteText?: boolean}) => {
  const navigation = useNavigation();
  const i18n = useI18n();
  const back = useCallback(() => navigation.goBack(), [navigation]);
  return useWhiteText ? (
    <BackButton textStyles={styles.backText} iconName="icon-chevron-back-white" onPress={back} />
  ) : (
    <Button backButton text={i18n.translate(`QRCode.Reader.Back`)} variant="text" onPress={back} />
  );
};
const styles = StyleSheet.create({
  right: {
    marginLeft: 'auto',
  },
  backText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 18,
  },
});
