import React from 'react';
import {Box, BulletPointX} from 'components';
import {useI18n} from 'locale';
import Markdown from 'react-native-markdown-display';
import {StyleSheet} from 'react-native';

import {ItemView, ItemViewProps} from './ItemView';

export const Anonymous = (props: Pick<ItemViewProps, 'isActive'>) => {
  const i18n = useI18n();

  return (
    <ItemView
      {...props}
      image={require('assets/onboarding-nogps.png')}
      altText={i18n.translate('Onboarding.Anonymous.ImageAltText')}
      header={i18n.translate('Onboarding.Anonymous.Title')}
      item="step-2"
    >
      <>
        <Box marginRight="s">
          <Box flexDirection="row" marginBottom="m">
            <Markdown
              style={{
                body: styles.bodyContent,
              }}
            >
              {i18n.translate('Onboarding.Anonymous.Body1')}
            </Markdown>
          </Box>
          <Box flexDirection="row" marginBottom="s">
            <Markdown
              style={{
                body: styles.bodyContent,
              }}
            >
              {i18n.translate('Onboarding.Anonymous.Body2')}
            </Markdown>
          </Box>

          <BulletPointX text={i18n.translate('Onboarding.Anonymous.Bullet1')} />
          <BulletPointX text={i18n.translate('Onboarding.Anonymous.Bullet2')} />
          <BulletPointX text={i18n.translate('Onboarding.Anonymous.Bullet3')} />
          <BulletPointX text={i18n.translate('Onboarding.Anonymous.Bullet4')} />
          <BulletPointX text={i18n.translate('Onboarding.Anonymous.Bullet5')} />
        </Box>
      </>
    </ItemView>
  );
};
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  bodyContent: {
    fontFamily: 'Noto Sans',
    fontSize: 18,
  },
});
