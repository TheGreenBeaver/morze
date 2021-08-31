import React, { useState } from 'react';
import { bool } from 'prop-types';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { InputAdornment } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import useStyles from './styles/search-field.styles';
import { useDispatch, useSelector } from 'react-redux';
import { HTTP_ENDPOINTS, LINKS, SEARCH_TYPES } from '../../util/constants';
import { setSearchIsLoading, setSearchResults } from '../../store/actions/search';
import { useHistory } from 'react-router-dom';
import useClearPath from '../../hooks/use-clear-path';
import SmallSpinner from '../small-spinner';
import useDebouncedApiCall from '../../hooks/use-debounced-api-call';


function SearchField({ expandable }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const clearPathname = useClearPath();
  const styles = useStyles();
  const { isLoading } = useSelector(state => state.search);

  const [searchConfig, setSearchConfig] = useState({
    term: '',
    type: SEARCH_TYPES.users
  });

  function beforeAny() {
    dispatch(setSearchIsLoading(true));
  }

  function onSuccess(data) {
    if (clearPathname !== LINKS.search) {
      history.push(LINKS.search);
    }
    dispatch(setSearchResults(data));
  }

  function onAny() {
    dispatch(setSearchIsLoading(false));
  }

  function extraCondition(currentSearchConfig) {
    return !!currentSearchConfig.params.term;
  }

  useDebouncedApiCall(
    HTTP_ENDPOINTS.search,
    [{ params: searchConfig }],
    {
      beforeAny,
      extraCondition,
      onSuccess,
      onAny
    }
  );

  const classes = expandable
    ? { root: styles.baseAmber, input: styles.expandable }
    : { root: styles.baseWhite };

  return (
    <OutlinedInput
      startAdornment={
        <InputAdornment position='start'>
          {isLoading ? <SmallSpinner /> : <Search />}
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