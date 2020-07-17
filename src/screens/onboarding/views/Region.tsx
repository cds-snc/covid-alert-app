import React from 'react';
import {useI18n} from 'locale';
import {Box, Text} from 'components';
import {useStorage} from 'services/StorageService';

import {regionData, RegionItem} from '../../regionPicker/RegionPickerShared';

import {ItemView, ItemViewProps} from './ItemView';

export const Region = (props: Pick<ItemViewProps, 'isActive'>) => {
  const i18n = useI18n();
  const {region, setRegion} = useStorage();

  return (
    <ItemView {...props} header={i18n.translate('RegionPicker.Title')} item="step-6">
      <>
        <Box marginRight="s">
          <Text marginBottom="m">{i18n.translate('RegionPicker.Body')}</Text>
        </Box>
        <Box
          marginTop="s"
          marginBottom="m"
          paddingHorizontal="m"
          borderRadius={10}
          overflow="hidden"
          accessibilityRole="radiogroup"
        >
          {regionData.map(item => {
            return (
              <RegionItem
                key={item.code}
                selected={region === item.code}
                onPress={async selectedRegion => {
                  if (region === item.code) {
                    setRegion('None');
                  } else {
                    setRegion(selectedRegion);
                  }
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
