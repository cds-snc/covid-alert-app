import React from 'react';
import {ThemeProvider} from 'shared/theme';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { create } from 'react-test-renderer';
import { CodeInput } from './CodeInput';
import defaultTeme, {Theme} from 'shared/theme/default';
import { StorageServiceProvider } from 'services/StorageService';


jest.mock('react-native-localize', () => ({
  getLocales: () => [{countryCode: 'US', languageTag: 'en-US', languageCode: 'en', isRTL: false}],
}));

describe('CodeInput', () => {

  const changeMock = jest.fn();
  let componentQuery;
  
  beforeEach(async () => {
    componentQuery = await waitFor(() => render(
      <StorageServiceProvider>
        <ThemeProvider>
        <CodeInput onChange={changeMock} accessibilityLabel='codeInput' />
        </ThemeProvider>
      </StorageServiceProvider>
    ));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  
  it('returns trimmed text', async () => {
    const textInput = componentQuery.getByHintText('codeInput');
    fireEvent.changeText(textInput, ' MYSECRETCODE ');
    expect(changeMock).toBeCalledWith('MYSECRETCODE');
  });

  /* TODO: uncomment after https://github.com/cds-snc/covid-alert-app/pull/844 is merged
  it('disallows special characters on input', () => {
    const changeMock = jest.fn();
    const textInput = componentQuery.getByHintText('codeInput');
    fireEvent.changeText(textInput, ' MY💘SECRETCODE ');
    expect(changeMock).toBeCalledWith('MYSECRETCODE');
  });
  */
});
