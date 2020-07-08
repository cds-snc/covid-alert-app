import React from 'react';
import {useI18n} from '@shopify/react-i18n';
import {Box, Text} from 'components';
import {useStorage} from 'services/StorageService';

import {regionData, RegionItem, regionStyles} from '../../regionPicker/RegionPickerShared';

import {ItemView, ItemViewProps} from './ItemView';

export const Region = (props: Pick<ItemViewProps, 'isActive'>) => {
  const [i18n] = useI18n();
  const {region, setRegion, setOnboarded, setOnboardedDatetime} = useStorage();
  const isRegionSet = Boolean(region && region !== 'None');

  return (
    <ItemView
      {...props}
      image={require('assets/onboarding-nogps.png')}
      altText={i18n.translate('Onboarding.Anonymous.ImageAltText')}
      header={i18n.translate('RegionPicker.Title')}
      item="step-6"
    >
      <>
        <Text marginVertical="m" variant="bodyText" color="overlayBodyText">
          {i18n.translate('RegionPicker.Body')}
        </Text>
        <Box
          marginTop="s"
          paddingHorizontal="m"
          borderRadius={10}
          backgroundColor="infoBlockNeutralBackground"
          accessibilityRole="radiogroup"
        >
          {regionData.map(item => {
            return (
              <RegionItem
                key={item.code}
                selected={region === item.code}
                onPress={async selectedRegion => {
                  setRegion(selectedRegion);
                }}
                name={i18n.translate(`RegionPicker.${item.code}`)}
                {...item}
              />
            );
          })}
        </Box>
      </>
    </ItemView>
  );
};
