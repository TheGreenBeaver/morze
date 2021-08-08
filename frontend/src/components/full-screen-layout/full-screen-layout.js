import React from 'react';
import { node } from 'prop-types';


function FullScreenLayout({ children }) {
  return (
    <div style={{ backgroundColor: 'red' }}>
      !FSL!
      {children}
    </div>
  );
}

FullScreenLayout.propTypes = {
  children: node.isRequired
};

export default FullScreenLayout;