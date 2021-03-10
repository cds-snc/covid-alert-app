import React, {useCallback} from 'react';
import {Button} from 'components/Button';
import {useCachedStorage} from 'services/StorageService';
import {useI18n} from 'locale';

export const LanguageToggle = () => {
  const i18n = useI18n();
  const {setLocale} = useCachedStorage();
  const toggle = useCallback(() => {
    setLocale(i18n.locale === 'en' ? 'fr' : 'en');
  }, [i18n.locale, setLocale]);
  const label = i18n.locale === 'en' ? 'LanguageSelect.FrShort' : 'LanguageSelect.EnShort';

  return <Button text={i18n.translate(label)} variant="bigFlat" onPress={toggle} />;
};
