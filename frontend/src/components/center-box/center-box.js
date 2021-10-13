import React from 'react';
import { node } from 'prop-types';
import Box from '@material-ui/core/Box';


function CenterBox({ children, ...otherProps }) {
  const props = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    ...otherProps
  };

  return (
    <Box {...props}>
      {children}
    </Box>
  );
}

CenterBox.propTypes = {
  children: node
};

export default CenterBox;