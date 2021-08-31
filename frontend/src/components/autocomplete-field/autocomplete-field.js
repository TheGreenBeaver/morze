import React from 'react';
import { arrayOf, shape, func, string, bool } from 'prop-types';
import { useField } from 'formik';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { startCase } from 'lodash';


function AutocompleteField({ name, options, onOpen, label, loading }) {
  const [field, meta, helpers] = useField(name);

  return (
    <Autocomplete
      options={options}
      onOpen={onOpen}
      getOptionLabel={opt => opt.label}
      multiple
      loading={loading}
      loadingText='Loading options...'
      value={field.value}
      onChange={(e, value) => helpers.setValue(value)}
      renderInput={params => <TextField {...params} label={label || startCase(name)} />}
    />
  );
}

AutocompleteField.propTypes = {
  name: string.isRequired,
  options: arrayOf(shape({
    value: string.isRequired,
    label: string
  })).isRequired,
  onOpen: func,
  label: string,
  loading: bool
};

export default AutocompleteField;