import React from 'react';

import {OnOffButton} from '../components/OnOffButton';

import {ShareDiagnosisCode} from './ShareDiagnosisCode';

export const PrimaryMenuButtons = () => {
  return (
    <>
      <ShareDiagnosisCode />
      <OnOffButton />
    </>
  );
};
