import React from 'react';
import {Box, Text} from 'components';
import {TouchableOpacity, View, StyleSheet} from 'react-native';

export const RadioButton = (props: any) => {
  const selected = props.active === props.value;
  const activeStyles = selected ? {...styles.active} : {};
  return (
    <Box marginBottom="m">
      <TouchableOpacity
        onPress={() => {
          props.onPress(props.value);
        }}
        accessibilityRole="radio"
        accessibilityState={{selected}}
      >
        <Box flex={1} flexDirection="row">
          <Box style={{...styles.circle, ...activeStyles}}>
            {selected ? <View style={styles.checkedCircle} /> : <View />}
          </Box>
          <Box style={styles.label}>
            <Text variant="bodyText">{props.text}</Text>
          </Box>
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

const styles = StyleSheet.create({
  circle: {
    flex: 0,
    height: 40,
    width: 40,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  label: {
    flex: 1,
    paddingTop: 7,
  },
  active: {
    borderWidth: 4,
  },
  checkedCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000',
    borderWidth: 0,
  },
});
