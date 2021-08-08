import React from 'react';
import { node, string } from 'prop-types';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import useStyles from './styles/styled-link.styles';


function StyledLink({ to, children, ...otherProps }) {
  const styles = useStyles();

  return (
    <Link
      component={RouterLink}
      to={to}
      className={styles.root}
      {...otherProps}
    >
      {children}
    </Link>
  );
}

StyledLink.propTypes = {
  to: string.isRequired,
  children: node.isRequired
};

export default StyledLink;