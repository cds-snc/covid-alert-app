// https://github.com/react-native-community/react-native-localize/issues/24#issuecomment-478235079
jest.mock('react-native-localize', () => ({
  getLocales: () => [
    {countryCode: 'CA', languageTag: 'en-CA', languageCode: 'en', isRTL: false},
    {countryCode: 'CA', languageTag: 'fr-CA', languageCode: 'fr', isRTL: false},
  ],

  getNumberFormatSettings: () => ({
    decimalSeparator: '.',
    groupingSeparator: ',',
  }),

  getCalendar: () => 'gregorian', // or "japanese", "buddhist"
  getCountry: () => 'CA', // the country code you want
  getCurrencies: () => ['USD', 'EUR'], // can be empty array
  getTemperatureUnit: () => 'celsius', // or "fahrenheit"
  getTimeZone: () => 'Europe/Paris', // the timezone you want
  uses24HourClock: () => true,
  usesMetricSystem: () => true,

  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));
