import React from 'react';
import { arrayOf, func, number, oneOfType, shape, string } from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';


function SimpleSelect({ options, onChange, value, renderOption, classes, ...otherProps }) {
  return (
    <FormControl
      variant='outlined'
      margin='none'
      size='small'
      className={classes?.wrapper}
    >
      <Select
        value={value}
        onChange={onChange}
        className={classes?.select}
        {...otherProps}
        MenuProps={{
          anchorOrigin: {
            horizontal: 'center',
            vertical: 'bottom'
          },
          transformOrigin: {
            horizontal: 'center',
            vertical: 'top'
          },
          getContentAnchorEl: null,
        }}
      >
        {
          options.map(opt =>
            <MenuItem
              key={opt.value}
              value={opt.value}
            >
              {renderOption(opt)}
            </MenuItem>
          )
        }
      </Select>
    </FormControl>
  );
}

SimpleSelect.propTypes = {
  options: arrayOf(shape({
    value: oneOfType([string, number]).isRequired
  })),
  value: oneOfType([string, number]).isRequired,
  onChange: func.isRequired,
  renderOption: func,
  classes: shape({
    wrapper: string,
    select: string
  })
};

SimpleSelect.defaultProps = {
  renderOption: opt => opt.label
};

export default SimpleSelect;
