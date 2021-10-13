import React, { useState } from 'react';
import useAppSearch from '../../hooks/use-app-search';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import { ChatBubbleOutline, Close, Forum, Person, Search } from '@material-ui/icons';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import SimpleSelect from '../simple-select';
import { objectToSelectOptions } from '../../util/misc';
import { SEARCH_TYPES } from '../../util/constants';
import { capitalize } from 'lodash';
import useStyles from './styles/header-search-field.styles';
import Menu from '@material-ui/core/Menu';


const SEARCH_TYPES_ICONS = {
  users: <Person />,
  messages: <ChatBubbleOutline />,
  chats: <Forum />
}

function HeaderSearchField() {
  const styles = useStyles();
  const {
    setSearchConfig, searchConfig, containerRef,
    searchInputProps, searchResultsDisplayProps, searchResultsDisplay
  } = useAppSearch();
  const [isExpanded, setIsExpanded] = useState(false);

  const adjustedResultsDisplayProps = {
    ...searchResultsDisplayProps,
    open: searchResultsDisplayProps.open && isExpanded
  }

  return (
    <Box position='relative' height={45}>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        className={clsx(
          styles.expandable,
          styles.wrapper,
          isExpanded ? styles.expanded : styles.collapsed
        )}
        position='absolute'
        right={45}
      >
        <Box ref={containerRef} width='100%'>
          <TextField
            margin='none'
            value={searchConfig.term}
            onChange={e => setSearchConfig(curr => ({ ...curr, term: e.target.value }))}
            disabled={!isExpanded}
            InputProps={{
              classes: { focused: styles.textFieldFocused, root: styles.textField }
            }}
            {...searchInputProps}
          />
          <Menu
            {...adjustedResultsDisplayProps}
            PaperProps={{ className: styles.resultsPaper }}
          >
            {searchResultsDisplay}
          </Menu>
        </Box>

        <SimpleSelect
          disabled={!isExpanded}
          onChange={e => setSearchConfig(curr => ({ ...curr, type: e.target.value }))}
          value={searchConfig.type}
          options={objectToSelectOptions(SEARCH_TYPES)}
          classes={{ select: styles.typeSelect, wrapper: styles.typeSelectWrapper }}
          renderOption={opt => capitalize(opt.label)}
          renderValue={val => SEARCH_TYPES_ICONS[val]}
        />
      </Box>

      <IconButton
        onClick={() => setIsExpanded(curr => !curr)}
        className={styles.toggleButton}
      >
        {isExpanded ? <Close /> : <Search />}
      </IconButton>
    </Box>
  );
}

export default HeaderSearchField;