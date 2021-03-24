import React, {useCallback} from 'react';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {Box, ButtonWrapper, Icon, Text} from 'components';
import {StyleSheet} from 'react-native';

export const MenuButton = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const openMenu = useCallback(() => {
    navigation.navigate('Menu');
  }, [navigation]);

  return (
    <ButtonWrapper color="gray5" borderRadius={8} onPress={openMenu}>
      <Box style={styles.box}>
        <Box flex={1} marginRight="s">
          <Icon name="hamburger-menu" size={25} />
        </Box>
        <Box flex={3}>
          <Text>{i18n.translate('MenuButton')}</Text>
        </Box>
      </Box>
    </ButtonWrapper>
  );
};

const styles = StyleSheet.create({
  box: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
