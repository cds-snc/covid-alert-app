import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {ThemeProvider} from 'shared/theme';
import {StorageServiceProvider} from 'services/StorageService';

import {CodeInput} from './CodeInput';

jest.setTimeout(10000);

jest.mock('react-native-localize', () => ({
  getLocales: () => [{countryCode: 'US', languageTag: 'en-US', languageCode: 'en', isRTL: false}],
}));

describe('CodeInput', () => {
  const changeMock = jest.fn();
  let componentQuery: any;

  beforeEach(async () => {
    componentQuery = await waitFor(() =>
      render(
        <StorageServiceProvider>
          <ThemeProvider>
            <CodeInput value="" onChange={changeMock} accessibilityLabel="codeInput" />
          </ThemeProvider>
        </StorageServiceProvider>,
      ),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('returns trimmed text', async () => {
    const textInput = componentQuery.getByHintText('codeInput');
    fireEvent.changeText(textInput, ' MYSECRETCODE ');
    expect(changeMock).toHaveBeenCalledWith('MYSECRETCODE');
  });

  // eslint-disable-next-line jest/no-commented-out-tests
  /* TODO: uncomment after https://github.com/cds-snc/covid-alert-app/pull/844 is merged
  it('disallows special characters on input', () => {
    const changeMock = jest.fn();
    const textInput = componentQuery.getByHintText('codeInput');
    fireEvent.changeText(textInput, ' MY💘SECRETCODE ');
    expect(changeMock).toBeCalledWith('MYSECRETCODE');
  });
  */
});
