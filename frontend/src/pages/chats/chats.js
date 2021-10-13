import React, { useState } from 'react';
import { CHAT_WINDOWS_CONFIG, SIDEBAR_OFFSET_CLASS, SIDEBAR_WIDTH } from '../../util/constants';
import { useDispatch, useSelector } from 'react-redux';
import './styles/chats.styles.scss';
import Box from '@material-ui/core/Box';
import ChatWindow from '../../components/chat-window';
import Drawer from '@material-ui/core/Drawer';
import useStyles from './styles/chats.styles';
import { pushModal, setSidebarOpen } from '../../store/actions/general';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { last } from 'lodash';
import Divider from '@material-ui/core/Divider';
import { Add, LibraryAdd, RotateLeft, RotateRight } from '@material-ui/icons';
import HintButton from '../../components/hint-button';
import useDragStyles from '../../theme/drag';
import clsx from 'clsx';
import { Badge, useTheme } from '@material-ui/core';
import AddChatModal from '../../components/modals/add-chat-modal';
import { Skeleton } from '@material-ui/lab';
import { useChats } from '../../contexts/chats-context';
import SidebarSearchField from '../../components/search-field/sidebar-search-field';
import { wAmount } from '../../util/misc';


function Chats() {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector(state => state.general);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragTarget, setDragTarget] = useState(null);

  const { config, allChats, insertOrMoveChat, rotate, addSlot, addOrRemoveChat, screenIsSmall, statistics } = useChats();
  const { chatIds, template } = config;
  const { slotsPresent, noChats, moreThanOne, notMaxSlots } = statistics;

  const styles = useStyles();
  const dragStyles = useDragStyles();
  const theme = useTheme();

  const slotsWrapperProps = slotsPresent
    ? {
      display: 'grid',
      gridTemplateAreas: template,
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
      gridTemplateRows: '1fr 1fr'
    }
    : {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      onDragOver: e => {
        const { pageX, pageY } = e;
        const { innerWidth, innerHeight } = window;
        const leftOffset = screenIsSmall ? theme.spacing(3) : SIDEBAR_WIDTH;
        const width = innerWidth - leftOffset - theme.spacing(3);
        const height = innerHeight - theme.spacing(8);
        const centerX = width / 2 + leftOffset;
        const centerY = height / 2 + theme.spacing(3);
        const breakpoint = Math.max(height, width) / 4;
        const distance = Math.sqrt((centerX - pageX) ** 2 + (centerY - pageY) ** 2);
        if (distance <= breakpoint) {
          setDragTarget(0);
        } else {
          setDragTarget(null);
        }
      }
    };

  function onDragEnd() {
    setDraggedItem(null);
    if (dragTarget != null) {
      setDragTarget(null);
      insertOrMoveChat(draggedItem, dragTarget);
    }
  }

  function getAddButton(className) {
    return (
      <HintButton
        title='Add chat'
        buttonProps={{
          onClick: () =>
            dispatch(pushModal({
              body: <AddChatModal />,
              title: 'Create Chat'
            })),
          className
        }}
      >
        <Add />
      </HintButton>
    );
  }

  function getShortMessage(msg) {
    const attCount = msg.attachments.filter(att => att.isDirect).length;
    return msg.text ||
      (!!attCount && wAmount(attCount, 'file')) ||
      (!!msg.mentionedMessages.length && `> ${wAmount(msg.mentionedMessages.length, 'message')}`)
  }

  const addButton = noChats
    ?
    <Box
      position='relative'
      width={21}
      height={21}
      marginLeft={2}
    >
      <Skeleton
        animation='pulse'
        variant='circle'
        className={styles.addChatBtnPulse}
        width={21}
        height={21}
      />
      {getAddButton(styles.addChatBtn)}
    </Box>
    : getAddButton();

  return (
    <React.Fragment>
      <Drawer
        variant={screenIsSmall ? 'temporary' : 'permanent'}
        classes={{
          paper: clsx(styles.drawerPaper, !screenIsSmall && styles.drawerPaperWideScreen),
          root: styles.drawer
        }}
        onClose={() => dispatch(setSidebarOpen(false))}
        open={sidebarOpen || !screenIsSmall}
      >
        {screenIsSmall && <SidebarSearchField />}
        <Box
          display='flex'
          alignItems='center'
          justifyContent='space-between'
        >
          {addButton}

          <Box
            display='flex'
            alignItems='center'
          >

            {
              !screenIsSmall &&
              <React.Fragment>
                <HintButton
                  title='Rotate slots counter-clockwise'
                  buttonProps={{
                    onClick: () => rotate(CHAT_WINDOWS_CONFIG.rotationActions.counterClockwise),
                    disabled: !moreThanOne
                  }}
                >
                  <RotateLeft />
                </HintButton>

                <HintButton
                  title='Rotate slots clockwise'
                  buttonProps={{
                    onClick: () => rotate(CHAT_WINDOWS_CONFIG.rotationActions.clockwise),
                    disabled: !moreThanOne
                  }}
                >
                  <RotateRight />
                </HintButton>
              </React.Fragment>
            }

            <HintButton
              title='Add slot'
              buttonProps={{
                onClick: () => addSlot(),
                disabled: !notMaxSlots
              }}
            >
              <LibraryAdd />
            </HintButton>
          </Box>
        </Box>
        <Divider />
        <List>
          {
            noChats &&
            <Typography align='center'>
              You are a member of no chats yet. Create one to start messaging
            </Typography>
          }
          {
            Object.values(allChats)
              .filter(chat => !chatIds.includes(chat.id))
              .map(chat =>
                <ListItem
                  button
                  key={chat.id}
                  draggable={!screenIsSmall}
                  divider
                  classes={{ button: styles.chatItem }}
                  onDragStart={() => setDraggedItem(chat.id)}
                  onDragEnd={onDragEnd}
                  onClick={() => addOrRemoveChat(chat.id)}
                >
                  <Typography variant='h6' classes={{ root: styles.itemText }}>{chat.name}</Typography>
                  <Badge
                    color='secondary'
                    badgeContent={chat.unreadCount}
                    classes={{ root: styles.itemText }}
                  >
                    <Typography color='textSecondary'>
                      {getShortMessage(last(chat.messages))}
                    </Typography>
                  </Badge>
                </ListItem>
              )
          }
        </List>
      </Drawer>

      <Box
        {...slotsWrapperProps}
        width='100%'
        className={clsx([
          styles.chatWindowsWrapper,
          !screenIsSmall && SIDEBAR_OFFSET_CLASS
        ])}
      >
        {
          !slotsPresent && dragTarget === 0 &&
          <div
            className={clsx([
              styles.dropOnEmptyIndicator,
              dragStyles.dragTarget,
              !screenIsSmall && SIDEBAR_OFFSET_CLASS
            ])}
          />
        }
        {
          slotsPresent
            ? chatIds.map((id, idx) =>
              <ChatWindow
                idx={idx}
                key={idx}
                setDraggedItem={setDraggedItem}
                setDragTarget={setDragTarget}
                onDragEnd={onDragEnd}
                isDragTarget={dragTarget === idx}
                isDragged={draggedItem != null && draggedItem === id}
                chatId={id}
              />
            )
            : <Typography align='center'>Select chats to start messaging</Typography>
        }
      </Box>
    </React.Fragment>
  );
}

export default Chats;