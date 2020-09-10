import React from 'react';
import {Box, Text} from 'components';
import {TouchableOpacity, View, StyleSheet} from 'react-native';

export const RadioButton = (props: any) => {
  const activeStyles = props.active === props.value ? {...styles.active} : {};
  return (
    <Box marginBottom="m">
      <TouchableOpacity
        onPress={() => {
          props.onPress(props.value);
        }}
      >
        <Box flex={1} flexDirection="row">
          <Box style={{...styles.circle, ...activeStyles}}>
            {props.active === props.value ? <View style={styles.checkedCircle} /> : <View />}
          </Box>
          <Box>
            <Text variant="bodyText">{props.text}</Text>
          </Box>
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

const styles = StyleSheet.create({
  circle: {
    height: 30,
    width: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center', // To center the checked circle…
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  active: {
    borderWidth: 3,
  },
  checkedCircle: {
    width: 16,
    height: 16,
    borderRadius: 30,
    backgroundColor: '#000',
    borderWidth: 4,
  },
});
