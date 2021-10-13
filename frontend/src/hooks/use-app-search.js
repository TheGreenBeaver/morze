import React, { useEffect, useRef, useState } from 'react';
import { HTTP_ENDPOINTS, SEARCH_TYPES } from '../util/constants';
import useDebouncedApiCall from './use-debounced-api-call';
import Typography from '@material-ui/core/Typography';
import { capitalize } from 'lodash';
import UserItem from '../components/items/user-item';
import ChatItem from '../components/items/chat-item';
import MessageItem from '../components/items/message-item';
import useCommonStyles from '../theme/common';
import HookHolder from '../components/hook-holder';
import clsx from 'clsx';


const SEARCH_TYPES_ITEMS = {
  users: UserItem,
  chats: ChatItem,
  messages: MessageItem
};

function useAppSearch() {
  const commonStyles = useCommonStyles();

  const [searchConfig, setSearchConfig] = useState({
    term: '',
    type: SEARCH_TYPES.users
  });
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const lastRequestedTermRef = useRef('');
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [searchResultsDisplayAnchor, setSearchResultsDisplayAnchor] = useState(null);

  let searchResultsDisplay;
  const spacingClasses = 'MuiMenuItem-root MuiListItem-gutters';
  if (loading) {
    searchResultsDisplay = <Typography color='textSecondary' className={spacingClasses}>Fetching data...</Typography>
  } else {
    const Item = SEARCH_TYPES_ITEMS[searchConfig.type];
    searchResultsDisplay = searchResults.length
      ? <HookHolder useHooks={Item.useHooks}>
        {searchResults.map(result => <Item key={result.id} data={result} />)}
      </HookHolder>
      : <Typography color='textSecondary' className={clsx(spacingClasses, commonStyles.ellipsis)}>
        No {capitalize(searchConfig.type)} found matching {lastRequestedTermRef.current}
      </Typography>;
  }

  const canViewSearchResultsDisplay = !!searchResults.length || !!searchConfig.term;
  const searchResultsDisplayOpen = !!searchResultsDisplayAnchor;

  function closeSearchResultsDisplay() {
    if (searchResultsDisplayOpen) {
      setSearchResultsDisplayAnchor(null);
      return true;
    }

    return false;
  }

  useEffect(() => {
    const listenOutsideClick = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        closeSearchResultsDisplay();
      }
    };

    if (searchResultsDisplayOpen) {
      document.addEventListener('click', listenOutsideClick);
    }
    return () => {
      document.removeEventListener('click', listenOutsideClick);
    }
  }, [searchResultsDisplayOpen])

  function openSearchResultsDisplay(force) {
    if ((canViewSearchResultsDisplay && !searchResultsDisplayOpen) || force) {
      setSearchResultsDisplayAnchor(inputRef.current);
    }
  }

  useEffect(() => {
    if (!canViewSearchResultsDisplay) {
      closeSearchResultsDisplay();
    }
  }, [canViewSearchResultsDisplay]);

  function toggleSearchResultsDisplay() {
    if (!closeSearchResultsDisplay()) {
      openSearchResultsDisplay();
    }
  }

  function beforeAny({ params }) {
    setLoading(true);
    lastRequestedTermRef.current = params.term;
    setSearchResults([]);
  }

  function onSuccess(data) {
    setSearchResults(data);
    openSearchResultsDisplay(true);
  }

  function onAny() {
    setLoading(false);
  }

  useEffect(() => {
    setSearchResults([]);
    closeSearchResultsDisplay();
  }, [searchConfig.type])

  function extraCondition({ params }) {
    const shouldPerformSearch = !!params.term;
    if (!shouldPerformSearch) {
      setSearchResults([]);
    }
    return shouldPerformSearch;
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

  return {
    searchConfig,
    setSearchConfig,
    loading,
    searchResultsDisplay,
    containerRef,

    searchResultsDisplayProps: {
      open: searchResultsDisplayOpen,
      anchorEl: searchResultsDisplayAnchor,
      getContentAnchorEl: null,
      disablePortal: true,
      anchorOrigin: {
        horizontal: 'center',
        vertical: 'bottom'
      },
      transformOrigin: {
        horizontal: 'center',
        vertical: 'top'
      },
      autoFocus: false,
      MenuListProps: {
        autoFocusItem: false,
        autoFocus: false
      },
      disableAutoFocus: true,
      disableEnforceFocus: true,
      disableRestoreFocus: true,
      onClose: closeSearchResultsDisplay,
      PopoverClasses: { root: commonStyles.dummyBackdrop },
      container: containerRef.current
    },

    searchInputProps: {
      ref: inputRef,
      onClick: toggleSearchResultsDisplay
    }
  }
}

export default useAppSearch;