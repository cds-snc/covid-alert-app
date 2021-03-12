import React, {useCallback} from 'react';
import {useI18n} from 'locale';
import {ButtonWrapper, Box, Icon} from 'components';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet} from 'react-native';

export const CloseButton = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const close = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);
  return (
    <ButtonWrapper
      onPress={close}
      color="infoBlockNeutralBackground"
      accessibilityLabel={i18n.translate('BottomSheet.Collapse')}
    >
      <Box style={styles.innerBox}>
        <Icon name="close" size={20} />
      </Box>
    </ButtonWrapper>
  );
};

const styles = StyleSheet.create({
  innerBox: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
