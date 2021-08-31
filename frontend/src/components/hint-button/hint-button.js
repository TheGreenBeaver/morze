import React from 'react';
import { node, object, string } from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';


function HintButton({ children, title, Component, tooltipProps, buttonProps }) {
  return (
    <Tooltip title={title} {...tooltipProps}>
      <span>
        <Component {...buttonProps}>
          {children}
        </Component>
      </span>
    </Tooltip>
  );
}

HintButton.propTypes = {
  children: node.isRequired,
  title: string.isRequired,
  Component: object,
  tooltipProps: object,
  buttonProps: object
};

HintButton.defaultProps = {
  Component: IconButton
};

export default HintButton;