import React from 'react';
import {useI18n} from '@shopify/react-i18n';

export const SharedTranslations = ({children}: {children: React.ReactElement}) => {
  const [, ShareTranslations] = useI18n();

  return <ShareTranslations>{children}</ShareTranslations>;
};
