export const palette = {
  brandBlue: '#26374A',
  linkBlue: '#2B4380',
  bodyBlack: '#000000',
  bodySubdued: '#5B5B5B',
  greenBright: '#A4DE82',
  white: '#FFFFFF',
  faded: 'rgba(255, 255, 255, 0.3)',
  fadedTextWhite: 'rgba(255, 255, 255, 0.65)',
  fadedWhite: 'rgba(0, 0, 0, 0.2)',
  fadedWhiteDark: 'rgba(0, 0, 0, 0.4)',
  successLight: '#D8EECA',
  success: '#006536',
  successDark: '#003620',
  errorLight: '#F3E9EB',
  danger: '#B1081E',
  error: '#D3080C',
  errorDark: '#923534',
  brandRed: '#AF3C43',
  brandGreen: '#333000',
  lightBlue: '#CCEFFF',
  neutralGrey: '#EEEEEE',
  darkGrey: '#cecece',
  fadedYellow: '#FFF5D9',
  warn: '#FFCDB3',
  nutmeg: '#5F3500',
  mint: '#B3DFC0',
  black: '#000000',
  lighterBlue: '#B3CAE5',
  buttonGrey: '#EEEEEE',
  danger10: '#FEE9E6',
  danger25: '#FFC1B3',
  danger50: '#F7635D',
  pink: '#FFC1B3',
  purple: '#573EC5',
  gray1Text: '#333333',
  gray2: '#585858',
  gray3: '#8A8A8A',
  gray4: '#BCBCBC',
  link: '#2B4380',
  green2: '#C9E7DE',
  greenCheck: '#33D1A1',
  info100: '#005B99',
  focus: '#44BBEE',
  exposure25: '#DED8FB',
};

const theme = {
  colors: {
    focus: palette.focus,
    linkText: palette.link,
    mainBackground: palette.neutralGrey,
    purpleBackground: palette.purple,
    regionCoveredBackground: palette.mint,
    exposureBackground: palette.warn,
    offlineBackground: palette.pink,
    greenBackground: palette.greenBright,
    overlayBackground: palette.white,
    danger10: palette.danger10,
    danger25Background: palette.danger25,
    overlayBodyText: palette.bodyBlack,
    fadedBackground: palette.fadedWhite,
    bodyText: palette.bodyBlack,
    dangerText: palette.danger,
    successText: palette.successDark,
    bodyTitleWhite: palette.white,
    bodyTextWhite: palette.white,
    bodyTextNutmeg: palette.nutmeg,
    bodyTextFaded: palette.fadedTextWhite,
    bodyTextSubdued: palette.bodySubdued,
    statusSuccess: palette.success,
    successBackground: palette.successLight,
    statusError: palette.error,
    errorBackground: palette.errorLight,
    errorText: palette.error,
    infoBlockBrightBackground: palette.lightBlue,
    infoBlockBrightText: palette.greenCheck,
    infoBlockNeutralBackground: palette.neutralGrey,
    infoBlockNeutralText: palette.bodyBlack,
    infoBlockBlackBackground: palette.bodyBlack,
    infoBlockBlackText: palette.white,
    infoBlockYellowBackground: palette.fadedYellow,
    divider: palette.fadedWhite,
    lighterBlueBackground: palette.lighterBlue,
    buttonGrey: palette.buttonGrey,
    gray1Text: palette.gray1Text,
    gray2: palette.gray2,
    gray3: palette.gray3,
    gray4: palette.gray4,
    gray5: palette.neutralGrey,
    green2: palette.green2,
  },
  spacing: {
    /* eslint-disable id-length */
    xxxs: 2,
    xxs: 4,
    xs: 6,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 43,
    '-s': -8,
    '-m': -16,
    '-l': -24,
    '-xl': -32,
    '-xxl': -43,
    none: 0,
    /* eslint-enable id-length */
  },
  breakpoints: {
    phone: 0,
  },
  textVariants: {
    smallText: {
      fontFamily: 'notosans',
      fontSize: 16,
      lineHeight: 23,
    },
    bodyText: {
      fontFamily: 'notosans',
      fontSize: 18,
      lineHeight: 25,
    },
    bodySubTitle: {
      fontFamily: 'notosans',
      fontWeight: 'bold',
      fontSize: 18,
      lineHeight: 25,
    },
    settingTitle: {
      fontFamily: 'notosans',
      fontSize: 23,
      lineHeight: 30,
    },
    bodyTitle: {
      fontFamily: 'notosans',
      fontWeight: 'bold',
      fontSize: 23,
      lineHeight: 30,
    },
    bodyTitle2: {
      fontFamily: 'notosans',
      fontWeight: 'bold',
      fontSize: 20,
      lineHeight: 30,
    },
    overlayTitle: {
      fontFamily: 'notosans',
      fontSize: 23,
      lineHeight: 30,
    },
    codeInput: {
      fontFamily: 'notosans',
      fontSize: 26,
      lineHeight: 34,
    },
    menuItemTitle: {
      fontFamily: 'notosans',
      fontSize: 18,
      lineHeight: 25,
    },
    menuItemSubtitle: {
      fontFamily: 'notosans',
      fontSize: 18,
      lineHeight: 25,
    },
  },
  buttonVariants: {
    danger50Flat: {
      color: palette.danger50,
      height: 52,
      textColor: palette.black,
      fontFamily: 'notosans',
      fontSize: 16,
      borderBottomWidth: 4,
      borderBottomColor: palette.brandRed,
      disabled: {
        color: palette.gray4,
        textColor: palette.bodyBlack,
        borderBottomColor: palette.gray3,
      },
    },
    dangerWhiteText: {
      color: palette.danger,
      height: 52,
      textColor: palette.white,
      fontFamily: 'notosans',
      fontSize: 18,
      borderWidth: undefined,
      disabled: {
        color: palette.gray4,
        textColor: palette.bodyBlack,
        borderBottomColor: palette.gray3,
      },
    },
    opaqueFlatBlackText: {
      color: palette.faded,
      height: 52,
      textColor: palette.black,
      fontFamily: 'notosans',
      fontSize: 18,
      borderWidth: undefined,
      disabled: {
        color: palette.gray4,
        textColor: palette.bodyBlack,
        borderBottomColor: palette.gray3,
      },
    },
    opaqueGrey: {
      color: palette.buttonGrey,
      height: 52,
      textColor: palette.black,
      fontFamily: 'notosans',
      fontSize: 18,
      borderWidth: undefined,
      disabled: {
        color: palette.gray4,
        textColor: palette.bodyBlack,
        borderBottomColor: palette.gray3,
      },
    },
    opaqueFlatWhiteText: {
      color: palette.faded,
      height: 52,
      textColor: palette.white,
      fontFamily: 'notosans',
      fontSize: 18,
      borderWidth: undefined,
      disabled: {
        color: palette.gray4,
        textColor: palette.bodyBlack,
        borderBottomColor: palette.gray3,
      },
    },
    bigFlat: {
      color: palette.info100,
      height: 52,
      textColor: palette.white,
      fontFamily: 'notosans',
      fontSize: 18,
      borderBottomWidth: undefined,
      disabled: {
        color: palette.gray4,
        textColor: palette.bodyBlack,
        borderBottomColor: palette.gray3,
      },
    },
    thinFlat: {
      color: palette.info100,
      height: 52,
      textColor: palette.white,
      fontFamily: 'notosans',
      fontSize: 20,
      borderBottomWidth: 4,
      borderBottomColor: palette.brandBlue,
      disabled: {
        color: palette.gray4,
        textColor: palette.bodyBlack,
        borderBottomColor: palette.gray3,
      },
    },
    thinFlatBlue: {
      color: palette.neutralGrey,
      height: 52,
      textColor: palette.black,
      fontFamily: 'notosans',
      fontSize: 20,
      borderBottomWidth: 4,
      borderBottomColor: palette.darkGrey,
      disabled: {
        color: palette.gray4,
        textColor: palette.bodyBlack,
        borderBottomColor: palette.gray3,
      },
    },
    bigFlatNeutralGrey: {
      color: palette.neutralGrey,
      height: 52,
      textColor: palette.black,
      fontFamily: 'notosans',
      fontSize: 16,
      borderBottomWidth: undefined,
      disabled: {},
    },
    thinFlatNeutralGrey: {
      color: palette.neutralGrey,
      height: 52,
      textColor: palette.black,
      fontFamily: 'notosans',
      fontSize: 18,
      borderBottomWidth: 4,
      borderBottomColor: palette.darkGrey,
      disabled: {},
    },
    bigFlatDarkGrey: {
      color: palette.darkGrey,
      height: 52,
      textColor: palette.black,
      fontFamily: 'notosans',
      fontSize: 18,
      borderWidth: undefined,
      paddingHorizontal: 5,
      paddingVertical: 10,
      disabled: {},
    },
    bigFlatPurple: {
      color: palette.purple,
      fontWeight: 'bold',
      height: 30,
      textColor: palette.white,
      fontFamily: 'notosans',
      fontSize: 18,
      borderWidth: undefined,
      disabled: {
        color: palette.darkGrey,
        textColor: palette.bodyBlack,
      },
    },
    bigFlatBlue: {
      color: palette.brandBlue,
      fontWeight: 'bold',
      // height: 30,
      textColor: palette.white,
      fontFamily: 'notosans',
      // fontSize: 18,
      borderWidth: undefined,
      disabled: {
        color: palette.darkGrey,
        textColor: palette.bodyBlack,
      },
    },
    exposure25: {
      color: palette.exposure25,
      fontWeight: 'normal',
      height: 30,
      textColor: palette.bodyBlack,
      fontFamily: 'notosans',
      fontSize: 18,
      borderWidth: undefined,
      disabled: {
        color: palette.darkGrey,
        textColor: palette.bodyBlack,
      },
    },
    bigFlatWhite: {
      color: palette.white,
      height: 52,
      textColor: palette.info100,
      fontFamily: 'notosans',
      fontSize: 18,
      borderWidth: undefined,
      disabled: {},
    },
    hollow: {
      color: 'transparent',
      height: 44,
      textColor: undefined,
      fontFamily: 'notosans',
      fontSize: 18,
      borderWidth: 1,
      disabled: {},
    },
    bigHollow: {
      color: 'transparent',
      height: 52,
      textColor: undefined,
      fontFamily: 'notosans',
      fontSize: 18,
      borderWidth: 1,
      disabled: {},
    },
    text: {
      color: 'transparent',
      height: 52,
      textColor: palette.linkBlue,
      fontFamily: 'notosans',
      fontSize: 18,
      borderWidth: undefined,
      disabled: {},
    },
    buttonSelect: {
      color: 'bodyText',
      height: 52,
      textColor: palette.bodyBlack,
      fontFamily: 'notosans',
      borderColor: 'bodyText',
      fontSize: 18,
      disabled: {
        borderColor: 'fadedBackground',
      },
    },
    subduedText: {
      color: 'transparent',
      height: 44,
      textColor: palette.bodySubdued,
      fontFamily: 'notosans',
      fontSize: 16,
      borderWidth: undefined,
      disabled: {},
    },
  },
  maxContentWidth: 500,
};

export type Theme = typeof theme;
export default theme;
