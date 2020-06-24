import React, {useCallback} from 'react';
import {ScrollView, StyleSheet, SafeAreaView} from 'react-native';
import {Box, Text, Toolbar, Button, ButtonSingleLine} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useNavigation} from '@react-navigation/native';
import {useStorage} from 'services/StorageService';
import {getRegionCase} from 'shared/RegionLogic';

interface BulletPointProps {
  text: string;
}

const BulletPoint = ({text}: BulletPointProps) => {
  return (
    <Box flexDirection="row">
      <Box marginRight="xs">
        <Text variant="bodyText" color="bodyText">
          {'\u25CF'}
        </Text>
      </Box>
      <Text variant="bodyText" color="bodyText">
        {text}
      </Text>
    </Box>
  );
};

interface ContentProps {
  title: string;
  body: string;
  list?: string[];
}

const Content = ({title, body, list}: ContentProps) => {
  return (
    <Box paddingHorizontal="m">
      <Text variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
        {title}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="l">
        {body}
      </Text>
      {list && list.map(item => <BulletPoint key={item} text={item} />)}
    </Box>
  );
};

export const NoCodeScreen = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const close = useCallback(() => navigation.goBack(), [navigation]);
  const onChooseRegion = useCallback(() => navigation.navigate('RegionSelect'), [navigation]);

  const {region} = useStorage();
  const regionCase = getRegionCase(region);
  let content = (
    <Content
      title={i18n.translate('DataUpload.NoCode.RegionCovered.Title')}
      body={i18n.translate('DataUpload.NoCode.RegionCovered.Body')}
    />
  );
  switch (regionCase) {
    case 'noRegionSet':
      content = (
        <Box paddingHorizontal="s">
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
        </Box>
      );
      break;
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
  }
  return (
    <>
      <SafeAreaView style={styles.flex}>
        <Toolbar
          title=""
          navIcon="icon-back-arrow"
          navText={i18n.translate('DataUpload.Cancel')}
          navLabel={i18n.translate('DataUpload.Cancel')}
          onIconClicked={close}
        />
        <ScrollView style={styles.flex}>{content}</ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
