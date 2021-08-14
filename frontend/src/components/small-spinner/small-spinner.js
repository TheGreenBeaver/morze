import React from 'react';
import { object, oneOf } from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTheme } from '@material-ui/core';


const POSITION = {
  left: 'left',
  right: 'right'
};

function SmallSpinner({ position, style, ...other }) {
  const theme = useTheme();
  return (
    <CircularProgress
      size={theme.typography.fontSize}
      style={{ ...style, [`margin${position === POSITION.left ? 'Right' : 'Left'}`]: theme.spacing(2) }}
      {...other}
    />
  );
}

SmallSpinner.propTypes = {
  position: oneOf([...Object.values(POSITION)]),
  style: object
};

SmallSpinner.defaultProps = {
  position: POSITION.left
};

SmallSpinner.POSITION = POSITION;

export default SmallSpinner;