import React from 'react';
import { func, node } from 'prop-types';


function HookHolder({ useHooks, children }) {
  const hooksResult = useHooks();

  return React.Children.map(children, child => React.cloneElement(child, { ...hooksResult }));
}

HookHolder.propTypes = {
  useHooks: func,
  children: node.isRequired
};

HookHolder.defaultProps = {
  useHooks: () => ({})
};

export default HookHolder;
        