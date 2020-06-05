import React from 'react';

import {Box, BoxProps} from './Box';
import {Icon} from './Icon';

export interface ProgressCirclesProps extends BoxProps {
  numberOfSteps: number;
  activeStep: number;
}

export const ProgressCircles = ({numberOfSteps, activeStep, ...props}: ProgressCirclesProps) => {
  const renderSteps = () => {
    const steps = [];
    for (let i = 0; i < numberOfSteps; ++i) {
      steps.push(
        <Box key={`step${i}`} marginHorizontal="xs">
          {activeStep - 1 === i ? (
            <Icon name="progress-circle-filled" size={8} />
          ) : (
            <Icon name="progress-circle-empty" size={8} />
          )}
        </Box>,
      );
    }
    return steps;
  };
  return (
    <Box justifyContent="center" flexDirection="row" {...props}>
      {renderSteps()}
    </Box>
  );
};
