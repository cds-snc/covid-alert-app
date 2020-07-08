import React from 'react';
import {useI18n} from '@shopify/react-i18n';
import {Box, Text} from 'components';
import {useStorage} from 'services/StorageService';

import {regionData, RegionItem} from '../../regionPicker/RegionPickerShared';

import {ItemView, ItemViewProps} from './ItemView';

export const Region = (props: Pick<ItemViewProps, 'isActive'>) => {
  const [i18n] = useI18n();
  const {region, setRegion} = useStorage();

  return (
    <ItemView {...props} header={i18n.translate('RegionPicker.Title')} item="step-6">
      <>
        <Text marginBottom="m">{i18n.translate('RegionPicker.Body')}</Text>
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
