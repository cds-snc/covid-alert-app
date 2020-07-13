import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Box, Toolbar, Text} from 'components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useI18n} from '@shopify/react-i18n';
import {BulletPoint} from 'components/BulletPoint';

export const PrivacyScreen = () => {
  const navigation = useNavigation();
  const [i18n] = useI18n();
  const close = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <Box backgroundColor="overlayBackground" flex={1}>
      <SafeAreaView style={styles.flex}>
        <Toolbar
          title=""
          navIcon="icon-back-arrow"
          navText={i18n.translate('Privacy.Close')}
          navLabel={i18n.translate('Privacy.Close')}
          onIconClicked={close}
          accessibilityTitleAutoFocus
        />
        <ScrollView style={styles.flex}>
          <Text
            paddingHorizontal="m"
            variant="bodyTitle"
            color="bodyText"
            accessibilityRole="header"
            accessibilityAutoFocus
          >
            {i18n.translate('Privacy.Title')}
          </Text>
          <Box padding="m">
            <Text marginTop="m" variant="settingTitle">
              {i18n.translate('Privacy.Intro')}
            </Text>
            <Text marginTop="s" variant="xtraSmallText">
              {i18n.translate('Privacy.Body1')}
            </Text>
            <Text marginTop="s" variant="xtraSmallText">
              {i18n.translate('Privacy.Body2')}
            </Text>
            <Text marginTop="m" variant="settingTitle">
              {i18n.translate('Privacy.List1.Title')}
            </Text>
            <Box marginTop="s" marginRight="m" marginLeft="s">
              <BulletPoint
                key="privList-1-1"
                listAccessibile="listStart"
                sectionContent="priv"
                text={i18n.translate('Privacy.List1.ListItem1')}
              />
              <BulletPoint
                key="privList-1-2"
                listAccessibile="listEnd"
                sectionContent="priv"
                text={i18n.translate('Privacy.List1.ListItem2')}
              />
            </Box>
            <Text marginTop="s" variant="xtraSmallText">
              {i18n.translate('Privacy.Body3')}
            </Text>
            <Text marginTop="m" variant="menuItemTitle">
              {i18n.translate('Privacy.List2.Title')}
            </Text>
            <Box marginTop="s" marginRight="m" marginLeft="s">
              <BulletPoint
                key="privList-2-1"
                listAccessibile="listStart"
                sectionContent="priv"
                text={i18n.translate('Privacy.List2.ListItem1')}
              />
              <BulletPoint
                key="privList-2-2"
                listAccessibile="listEnd"
                sectionContent="priv"
                text={i18n.translate('Privacy.List2.ListItem2')}
              />
            </Box>
            <Text marginTop="m" variant="menuItemTitle">
              {i18n.translate('Privacy.List3.Title')}
            </Text>
            <Box marginTop="s" marginRight="m" marginLeft="s">
              <BulletPoint
                key="privList-3-1"
                listAccessibile="listStart"
                sectionContent="priv"
                text={i18n.translate('Privacy.List3.ListItem1')}
              />
              <BulletPoint
                key="privList-3-2"
                listAccessibile="item"
                sectionContent="priv"
                text={i18n.translate('Privacy.List3.ListItem2')}
              />
              <BulletPoint
                key="privList-3-3"
                listAccessibile="item"
                sectionContent="priv"
                text={i18n.translate('Privacy.List3.ListItem3')}
              />
              <BulletPoint
                key="privList-3-4"
                listAccessibile="listEnd"
                sectionContent="priv"
                text={i18n.translate('Privacy.List3.ListItem4')}
              />
            </Box>
            <Text marginTop="m" variant="settingTitle">
              {i18n.translate('Privacy.List4.Title')}
            </Text>
            <Text marginTop="xs" variant="menuItemTitle">
              {i18n.translate('Privacy.List4.SubTitle')}
            </Text>
            <Box marginTop="s" marginRight="m" marginLeft="s">
              <BulletPoint
                key="privList-4-1"
                listAccessibile="listStart"
                sectionContent="priv"
                text={i18n.translate('Privacy.List4.ListItem1')}
              />
              <BulletPoint
                key="privList-4-2"
                listAccessibile="item"
                sectionContent="priv"
                text={i18n.translate('Privacy.List4.ListItem2')}
              />
              <BulletPoint
                key="privList-4-3"
                listAccessibile="listEnd"
                sectionContent="priv"
                text={i18n.translate('Privacy.List4.ListItem3')}
              />
            </Box>
            <Text marginTop="m" variant="menuItemTitle">
              {i18n.translate('Privacy.List5.Title')}
            </Text>
            <Box marginTop="s" marginRight="m" marginLeft="s">
              <BulletPoint
                key="privList-5-1"
                listAccessibile="listStart"
                sectionContent="priv"
                text={i18n.translate('Privacy.List5.ListItem1')}
              />
              <BulletPoint
                key="privList-5-2"
                listAccessibile="item"
                sectionContent="priv"
                text={i18n.translate('Privacy.List5.ListItem2')}
              />
              <BulletPoint
                key="privList-5-3"
                listAccessibile="listEnd"
                sectionContent="priv"
                text={i18n.translate('Privacy.List5.ListItem3')}
              />
            </Box>
            <Text marginTop="m" variant="menuItemTitle">
              {i18n.translate('Privacy.List6.Title')}
            </Text>
            <Box marginTop="s" marginRight="m" marginLeft="s">
              <BulletPoint
                key="privList-6-1"
                listAccessibile="listStart"
                sectionContent="priv"
                text={i18n.translate('Privacy.List6.ListItem1')}
              />
              <BulletPoint
                key="privList-6-2"
                listAccessibile="listEnd"
                sectionContent="priv"
                text={i18n.translate('Privacy.List6.ListItem2')}
              />
            </Box>
            <Text marginTop="m" variant="settingTitle">
              {i18n.translate('Privacy.List7.Title')}
            </Text>
            <Box marginTop="s" marginRight="m" marginLeft="s">
              <BulletPoint
                key="privList-7-1"
                listAccessibile="listStart"
                sectionContent="priv"
                text={i18n.translate('Privacy.List7.ListItem1')}
              />
              <BulletPoint
                key="privList-7-2"
                listAccessibile="item"
                sectionContent="priv"
                text={i18n.translate('Privacy.List7.ListItem2')}
              />
              <BulletPoint
                key="privList-7-3"
                listAccessibile="listEnd"
                sectionContent="priv"
                text={i18n.translate('Privacy.List7.ListItem3')}
              />
            </Box>
            <Text marginTop="m" variant="settingTitle">
              {i18n.translate('Privacy.SubTitle1')}
            </Text>
            <Text marginTop="s" variant="xtraSmallText">
              {i18n.translate('Privacy.Body4')}
            </Text>
            <Box marginTop="s" marginRight="m" marginLeft="s">
              <BulletPoint
                key="privList-8-1"
                listAccessibile="listStart"
                sectionContent="priv"
                text={i18n.translate('Privacy.List8.ListItem1')}
              />
              <BulletPoint
                key="privList-8-2"
                listAccessibile="item"
                sectionContent="priv"
                text={i18n.translate('Privacy.List8.ListItem2')}
              />
              <BulletPoint
                key="privList-8-3"
                listAccessibile="item"
                sectionContent="priv"
                text={i18n.translate('Privacy.List8.ListItem3')}
              />
              <BulletPoint
                key="privList-8-4"
                listAccessibile="listEnd"
                sectionContent="priv"
                text={i18n.translate('Privacy.List8.ListItem4')}
              />
            </Box>
            <Text marginTop="m" variant="settingTitle">
              {i18n.translate('Privacy.SubTitle2')}
            </Text>
            <Box marginTop="s" marginRight="m" marginLeft="s">
              <BulletPoint
                key="privList-9-1"
                listAccessibile="listStart"
                sectionContent="priv"
                text={i18n.translate('Privacy.List9.ListItem1')}
              />
              <BulletPoint
                key="privList-9-2"
                listAccessibile="item"
                sectionContent="priv"
                text={i18n.translate('Privacy.List9.ListItem2')}
              />
              <BulletPoint
                key="privList-9-3"
                listAccessibile="listEnd"
                sectionContent="priv"
                text={i18n.translate('Privacy.List9.ListItem3')}
              />
            </Box>
          </Box>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  bodyContent: {
    fontFamily: 'Noto Sans',
  },
});
