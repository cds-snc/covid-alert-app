import React, {useCallback} from 'react';
import {ScrollView, StyleSheet, Linking} from 'react-native';
import {Box, Text, TextMultiline, Toolbar, ButtonSingleLine} from 'components';
import {useI18n} from 'locale';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useStorage} from 'services/StorageService';
import {getRegionCase} from 'shared/RegionLogic';
import {BulletPoint} from 'components/BulletPoint';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAccessibilityAutoFocus, focusOnElement} from 'shared/useAccessibilityAutoFocus';

interface ContentProps {
  title: string;
  body: string;
  list?: string[];
  externalLinkText?: string;
  externalLinkCTA?: string;
}

const Content = ({title, body, list, externalLinkText, externalLinkCTA}: ContentProps) => {
  const [focusRef, autoFocusRef] = useAccessibilityAutoFocus(true);
  useFocusEffect(() => {
    focusOnElement(focusRef);
  });
  const externalLinkButton =
    externalLinkCTA && externalLinkText ? (
      <ButtonSingleLine
        variant="bigFlat"
        text={externalLinkText}
        onPress={() => Linking.openURL(externalLinkCTA).catch(err => console.error('An error occurred', err))}
        externalLink
      />
    ) : null;
  return (
    <Box>
      <Text focusRef={autoFocusRef} variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
        {title}
      </Text>
      <TextMultiline variant="bodyText" color="bodyText" marginBottom="l" text={body} />
      {list && list.map(item => <BulletPoint key={item} text={item} />)}
      {externalLinkButton}
    </Box>
  );
};

export const NoCodeScreen = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const close = useCallback(() => navigation.goBack(), [navigation]);
  const onChooseRegion = useCallback(() => navigation.navigate('RegionSelect'), [navigation]);

  const {region} = useStorage();
  const regionCase = getRegionCase(region);
  let content = null;
  switch (regionCase) {
    case 'regionNotCovered':
      content = (
        <Content
          title={i18n.translate('DataUpload.NoCode.RegionNotCovered.Title')}
          body={i18n.translate('DataUpload.NoCode.RegionNotCovered.Body')}
          list={[
            i18n.translate('DataUpload.NoCode.RegionNotCovered.Body2'),
            i18n.translate('DataUpload.NoCode.RegionNotCovered.Body3'),
            i18n.translate('DataUpload.NoCode.RegionNotCovered.Body4'),
          ]}
        />
      );
      break;
    case 'regionCovered':
      content = (
        <Content
          title={i18n.translate(`DataUpload.NoCode.RegionCovered.${region}.Title`)}
          body={i18n.translate(`DataUpload.NoCode.RegionCovered.${region}.Body`)}
          externalLinkText={i18n.translate(`DataUpload.NoCode.RegionCovered.${region}.CTA`)}
          externalLinkCTA={i18n.translate(`DataUpload.NoCode.RegionCovered.${region}.Link`)}
        />
      );
      break;
    default:
      content = (
        <>
          <Content
            title={i18n.translate('DataUpload.NoCode.NoRegion.Title')}
            body={i18n.translate('DataUpload.NoCode.NoRegion.Body')}
          />
          <ButtonSingleLine
            text={i18n.translate('DataUpload.NoCode.NoRegion.ChooseRegionCTA')}
            variant="bigFlatDarkGrey"
            internalLink
            onPress={onChooseRegion}
          />
        </>
      );
      break;
  }
  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={styles.flex}>
        <Toolbar
          title=""
          navIcon="icon-back-arrow"
          navText={i18n.translate('DataUpload.Cancel')}
          navLabel={i18n.translate('DataUpload.Cancel')}
          onIconClicked={close}
        />
        <ScrollView style={styles.flex}>
          <Box paddingHorizontal="m">{content}</Box>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
