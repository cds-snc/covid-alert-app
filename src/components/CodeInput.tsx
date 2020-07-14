import React, {useCallback, useRef} from 'react';
import {TextInput, TouchableWithoutFeedback, StyleSheet} from 'react-native';

import {Box} from './Box';
import {Text} from './Text';

const inputBorderColor = (string: string, position: number) => {
  // active
  if (!string[position] && Boolean(string[position - 1])) return 'overlayBodyText';
  // first
  if (string.length === 0 && position === 0) return 'overlayBodyText';
  // empty
  if (!string[position]) return 'gray2';
  // filled
  return 'gray2';
};
const inputFocusColor = (string: string, position: number) => {
  // active
  if (!string[position] && Boolean(string[position - 1])) return 'focus';
  // first
  if (string.length === 0 && position === 0) return 'focus';
  // not active
  return 'overlayBackground';
};

export interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  accessibilityLabel: string;
}

export const CodeInput = ({value, onChange, accessibilityLabel}: CodeInputProps) => {
  const inputRef = useRef<TextInput>(null);
  const onChangeTrimmed = useCallback(text => onChange(text.trim()), [onChange]);

  const displayValue = useCallback(
    () =>
      Array(8)
        .fill(null)
        .map((_, x) => {
          const characterToDisplay = value[x] || ' ';
          return (
            <Box /* eslint-disable-next-line react/no-array-index-key */
              key={`input-${x}`}
              flex={1}
              marginHorizontal="none"
              marginRight={x === 3 ? 'm' : 'none'}
              borderRadius={9}
              borderWidth={4}
              borderColor={inputFocusColor(value, x)}
            >
              <Box
                flex={1}
                paddingHorizontal="xs"
                borderWidth={2}
                borderColor={inputBorderColor(value, x)}
                borderRadius={5}
              >
                <Text variant="codeInput" color="overlayBodyText" textAlign="center" paddingVertical="xs">
                  {characterToDisplay}
                </Text>
              </Box>
            </Box>
          );
        }),
    [value],
  );

  const giveFocus = useCallback(() => inputRef.current?.focus(), []);

  return (
    <>
      <TextInput
        value={value}
        ref={inputRef}
        onChangeText={onChangeTrimmed}
        keyboardType="number-pad"
        autoCorrect={false}
        autoCompleteType="off"
        returnKeyType="done"
        accessibilityLabel={accessibilityLabel}
        caretHidden
        maxLength={8}
        style={styles.input}
      />
      <TouchableWithoutFeedback
        onPress={giveFocus}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Box flexDirection="row" justifyContent="space-evenly" marginHorizontal="m" paddingVertical="l">
          {displayValue()}
        </Box>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 0,
    color: 'transparent',
    height: 60,
    position: 'absolute',
    top: 24,
    left: '4%',
    width: '92%',
    zIndex: 1,
  },
});
