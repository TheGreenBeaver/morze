import React from 'react';
import { node } from 'prop-types';
import useStyles from './styles/full-screen-layout.styles';
import Header from '../header';


function FullScreenLayout({ children }) {
  const styles = useStyles();

  return (
    <React.Fragment>
      <Header />
      <div className={styles.content}>
        {children}
      </div>
    </React.Fragment>
  );
}

FullScreenLayout.propTypes = {
  children: node.isRequired
};

export default FullScreenLayout;