import React from 'react';
import { bool, string } from 'prop-types';
import Box from '@material-ui/core/Box';


function AutoSizeImg({ src, stretch, style, ...otherProps }) {
  return (
   <Box
     style={{
       backgroundImage: `url("${src.replace(/\\/g, '/')}")`,
       backgroundSize: stretch ? 'cover' : 'contain',
       backgroundPosition: 'center',
       backgroundRepeat: 'no-repeat',
       ...style
     }}
     {...otherProps}
   />
  );
}

AutoSizeImg.propTypes = {
  src: string.isRequired,
  stretch: bool
};

export default AutoSizeImg;
        