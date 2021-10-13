import React from 'react';
import useAppSearch from '../../hooks/use-app-search';
import Typography from '@material-ui/core/Typography';
import { capitalize } from 'lodash';
import useMenu from '../../hooks/use-menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { SEARCH_TYPES, SIDEBAR_WIDTH } from '../../util/constants';
import InputAdornment from '@material-ui/core/InputAdornment';
import SmallSpinner from '../small-spinner';
import { ArrowDropDown, Search } from '@material-ui/icons';
import useStyles from './styles/sidebar-search-field.styles';
import { useTheme } from '@material-ui/core';


function SidebarSearchField() {
  const {
    loading, setSearchConfig, searchConfig, containerRef,
    searchResultsDisplayProps, searchInputProps, searchResultsDisplay
  } = useAppSearch();
  const styles = useStyles();
  const {
    buttonProps,
    menuProps,
    closeMenu
  } = useMenu();

  const theme = useTheme();

  return (
    <div className={styles.wrapper}>
      <Typography
        color='textSecondary'
        variant='caption'
        component='div'
        style={{ display: 'flex', alignItems: 'center' }}
      >
        Search for
        <b {...buttonProps} className={styles.typeSelectButton}>
          {capitalize(searchConfig.type)}
          <ArrowDropDown />
        </b>
      </Typography>
      <Menu {...menuProps}>
        {
          Object.values(SEARCH_TYPES).map(searchType =>
            <MenuItem
              onClick={() => {
                setSearchConfig(curr => ({ ...curr, type: searchType }));
                closeMenu();
              }}
              key={searchType}
              selected={searchConfig.type === searchType}
              dense
            >
              {capitalize(searchType)}
            </MenuItem>
          )
        }
      </Menu>

      <div ref={containerRef}>
        <TextField
          value={searchConfig.term}
          onChange={e => setSearchConfig(curr => ({ ...curr, term: e.target.value }))}
          InputProps={{
            startAdornment:
              <InputAdornment position='start'>
                {loading ? <SmallSpinner /> : <Search />}
              </InputAdornment>
          }}
          className={styles.textField}
          margin='none'
          {...searchInputProps}
        />
        <Menu
          {...searchResultsDisplayProps}
          PaperProps={{ style: { width: SIDEBAR_WIDTH - theme.spacing(2) * 2 } }}
        >
          {searchResultsDisplay}
        </Menu>
      </div>
    </div>
  );
}

export default SidebarSearchField;