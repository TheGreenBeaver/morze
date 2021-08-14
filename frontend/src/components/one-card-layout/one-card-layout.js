import React from 'react';
import { node } from 'prop-types';
import Card from '@material-ui/core/Card';
import useStyles from './styles/one-card-layout.styles';
import logo from '../../assets/img/logo-on-white.svg';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CenterBox from '../center-box';


function OneCardLayout({ children }) {

  const styles = useStyles();

  return (
    <CenterBox minHeight='100vh' className={styles.box}>
      <Card className={styles.root}>
        <CardMedia image={logo} classes={{ root: styles.logo }} />
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </CenterBox>
  );
}

OneCardLayout.propTypes = {
  children: node.isRequired
};

export default OneCardLayout;