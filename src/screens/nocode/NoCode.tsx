import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Toolbar, ButtonSingleLine} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useNavigation} from '@react-navigation/native';
import {useStorage} from 'services/StorageService';
import {getRegionCase} from 'shared/RegionLogic';
import {BulletPoint} from 'components/BulletPoint';
import {SafeAreaView} from 'react-native-safe-area-context';

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
        <>
          <Content
            title={i18n.translate('DataUpload.NoCode.NoRegion.Title')}
            body={i18n.translate('DataUpload.NoCode.NoRegion.Body')}
          />
          <ButtonSingleLine
            text={i18n.translate('DataUpload.NoCode.NoRegion.ChooseRegionCTA')}
            variant="bigFlatNeutralGrey"
            internalLink
            onPress={onChooseRegion}
          />
        </>
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
    <Box flex={1}>
      <SafeAreaView style={styles.flex}>
        <Toolbar
          title=""
          navIcon="icon-back-arrow"
          navText={i18n.translate('DataUpload.Cancel')}
          navLabel={i18n.translate('DataUpload.Cancel')}
          onIconClicked={close}
        />
        <ScrollView style={styles.flex}>
          <Box paddingHorizontal="s">{content}</Box>
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
