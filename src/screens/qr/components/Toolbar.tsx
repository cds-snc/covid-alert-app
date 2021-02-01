import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {Box, Button} from 'components';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from 'locale';
import {BackButton} from '../views/BackButton';

export interface ToolbarProps {
  onIconClicked(): void;
  navText?: string;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  isWhite?: boolean;
}

export const Toolbar = ({navText, onIconClicked, showBackButton, showCloseButton, isWhite}: ToolbarProps) => {
  return (
    <Box flexDirection="row" alignItems="center" minHeight={56}>
      {showBackButton ? <ToolbarWhite isWhite={isWhite} /> : null}
      {showCloseButton ? (
        <Box style={styles.right}>
          <Button testID="toolbarCloseButton" text={navText} variant="text" onPress={onIconClicked} />
        </Box>
      ) : null}
    </Box>
  );
};

export const ToolbarWhite = ({isWhite}: {isWhite?: boolean}) => {
  const navigation = useNavigation();
  const i18n = useI18n();
  return isWhite ? (
    <BackButton
      textStyles={styles.backText}
      iconName="icon-chevron-back-white"
      text={i18n.translate(`QRCode.Reader.Back`)}
      onPress={() => {
        navigation.navigate('Home');
      }}
    />
  ) : (
    <Button
      backButton
      text={i18n.translate(`QRCode.Reader.Back`)}
      variant="text"
      onPress={() => {
        navigation.navigate('Home');
      }}
    />
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
