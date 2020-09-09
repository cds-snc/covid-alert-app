import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {Box, Button} from 'components';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from 'locale';

export interface ToolbarProps {
  onIconClicked(): void;
  navText?: string;
  showBackButton?: boolean;
}

export const Toolbar = ({navText, onIconClicked, showBackButton}: ToolbarProps) => {
  const navigation = useNavigation();
  const i18n = useI18n();
  const onBack = useCallback(() => navigation.goBack(), [navigation]);
  return (
    <Box flexDirection="row" alignItems="center" minHeight={56}>
      {showBackButton ? (
        <Box>
          <Button backButton text={i18n.translate('DataUpload.Back')} variant="text" onPress={onBack} />
        </Box>
      ) : null}
      <Box style={styles.right}>
        <Button testID="toolbarCloseButton" text={navText} variant="text" onPress={onIconClicked} />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  right: {
    marginLeft: 'auto',
  },
});
