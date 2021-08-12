import React, { useEffect, useRef, useState } from 'react';
import { bool } from 'prop-types';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { InputAdornment } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import useStyles from './styles/search-field.styles';
import { useDispatch } from 'react-redux';
import { SEARCH_TYPES } from '../../util/constants';
import useAuth from '../../hooks/use-auth';
import { debounce } from 'lodash';
import { search } from '../../api/search';
import { setSearchResults } from '../../store/actions/search';
import useErrorHandler from '../../hooks/use-error-handler';


const debouncedFunc = debounce(
  (currConfig, currHeaders, currDispatch, currErrHandler) =>
    search(currConfig, currHeaders)
      .then(data => currDispatch(setSearchResults(data)))
      .catch(currErrHandler),
  800
);

function SearchField({ expandable }) {
  const dispatch = useDispatch();
  const styles = useStyles();
  const { getHeaders } = useAuth();
  const handleBackendError = useErrorHandler();

  const [searchConfig, setSearchConfig] = useState({
    term: '',
    type: SEARCH_TYPES.ANY
  });

  const debouncedSearch = useRef(debouncedFunc);

  useEffect(() => {
    debouncedSearch.current.cancel();
    if (searchConfig.term) {
      debouncedSearch.current(searchConfig, getHeaders(), dispatch, handleBackendError);
    }
  }, [searchConfig]);

  const classes = expandable
    ? { root: styles.baseAmber, input: styles.expandable }
    : { root: styles.baseWhite };

  return (
    <OutlinedInput
      startAdornment={
        <InputAdornment position='start'>
          <Search />
        </InputAdornment>
      }
      onChange={e => setSearchConfig(curr => ({ ...curr, term: e.target.value }))}
      classes={classes}
    />
  );
}

SearchField.propTypes = {
  expandable: bool
};

export default SearchField;