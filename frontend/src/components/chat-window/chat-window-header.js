import React from 'react';
import useChatWindow from '../../hooks/use-chat-window';
import { func, number } from 'prop-types';
import { useChats } from '../../contexts/chats-context';
import Box from '@material-ui/core/Box';
import useStyles from './styles/chat-window-header.styles';
import clsx from 'clsx';
import { Cancel, Close, ControlCamera, Delete, MoreVert } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import useDragStyles from '../../theme/drag';
import CWBp from '../../util/chat-window-breakpoints';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from 'react-redux';
import { pushModal } from '../../store/actions/general';
import ChatInfoModal from '../modals/chat-info-modal';
import IconButton from '@material-ui/core/IconButton';
import useMenu from '../../hooks/use-menu';
import { useWs } from '../../contexts/ws-context';
import { WS_ENDPOINTS } from '../../util/constants';
import Divider from '@material-ui/core/Divider';
import useCommonStyles from '../../theme/common';
import ForwardToModal from '../modals/forward-to-modal';


function ChatWindowHeader({ setDraggable, chatId }) {
  const dispatch = useDispatch();
  const { addOrRemoveChat, insertOrMoveChat } = useChats();
  const { id: currentUserId } = useSelector(state => state.account.userData);
  const { selectedMessages, slotData, chatData, clearSelectedMessages, clearMentions, mentionHere, mentionAtChat } = useChatWindow();
  const { buttonProps, menuProps, closeMenu } = useMenu();
  const { send } = useWs();

  const styles = useStyles();
  const dragStyles = useDragStyles();
  const commonStyles = useCommonStyles();

  const { statistics, config } = useChats();

  const selectedMessagesPresent = !!selectedMessages.length;
  const allSelectedAreFromCurrent = !selectedMessages.some(msg => msg.user.id !== currentUserId);
  const showSelectedMsgOptions = slotData.size.lt(CWBp.names.large, CWBp.axis.hor) && selectedMessagesPresent;
  const showChatOptions = slotData.size.eq(CWBp.names.small, CWBp.axis.vert) ||
    (slotData.size.eq(CWBp.names.medium, CWBp.axis.vert) && selectedMessagesPresent);

  function openChatInfo(e) {
    e?.stopPropagation();
    dispatch(pushModal({
      title: 'Chat Info',
      body: <ChatInfoModal chatData={chatData} chatId={chatId} />
    }));
  }

  function closeChat() {
    addOrRemoveChat(chatId);
    clearSelectedMessages();
    clearMentions();
  }

  function forwardToChat(otherChat) {
    mentionAtChat(otherChat);
    if (!config.chatIds.includes(otherChat)) {
      if (statistics.notMaxSlots) {
        addOrRemoveChat(otherChat);
      } else {
        const slotIdx = Math.max(config.chatIds.indexOf(null), 0);
        insertOrMoveChat(otherChat, slotIdx);
      }
    }
  }

  const titlePane =
    <Box className={clsx(styles.titlePane, styles.middleArea)}>
      <Typography align='center' variant='h5'>{chatData.name}</Typography>
      {
        slotData.size.gt(CWBp.names.small, CWBp.axis.vert) &&
        <Button
          variant='text'
          onClick={openChatInfo}
          className={clsx(commonStyles.pureLinkBtn, styles.chatInfoBtn)}
        >
          {chatData.users.length} members
        </Button>
      }
    </Box>;

  const selectedMessagesDisplay =
    <React.Fragment>
      <Tooltip title='Clear Selected'>
        <IconButton
          onClick={clearSelectedMessages}
          className={clsx(slotData.size.eq(CWBp.names.large, CWBp.axis.vert) && styles.leftArea)}
          color='secondary'
        >
          <Cancel />
        </IconButton>
      </Tooltip>

      <Box
        display='flex'
        alignItems='center'
        className={clsx(
          slotData.size.eq(CWBp.names.large, CWBp.axis.vert) && styles.middleArea,
          styles.selectedMessagesMainPane
        )}
      >
        <Typography>{selectedMessages.length} message{selectedMessages.length > 1 ? 's' : ''}</Typography>
        {
          slotData.size.eq(CWBp.names.large, CWBp.axis.hor) &&
          <React.Fragment>
            <Button
              onClick={mentionHere}
              color='secondary'
              size='small'
              variant='outlined'
            >
              Reply
            </Button>
            <Button
              onClick={() => {
                dispatch(pushModal({
                  title: 'Forward to',
                  body:
                    <ForwardToModal
                      clearSelectedMessages={clearSelectedMessages}
                      forwardToChat={forwardToChat}
                    />
                }));
              }}
              color='secondary'
              variant='outlined'
              size='small'
            >
              Forward
            </Button>
            {
              allSelectedAreFromCurrent &&
                <Tooltip title='Delete'>
                  <IconButton
                    color='secondary'
                    onClick={() => {
                      // TODO: modal
                      send(WS_ENDPOINTS.messages.remove, selectedMessages.map(msg => msg.id));
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
            }
          </React.Fragment>
        }
      </Box>
    </React.Fragment>;

  const chatMenu =
    <React.Fragment>
      <IconButton
        {...buttonProps}
        className={styles.rightArea}
      >
        <MoreVert />
      </IconButton>

      <Menu {...menuProps} disablePortal>
        {
          showSelectedMsgOptions &&
          [
            <MenuItem
              onClick={() => {
                mentionHere();
                closeMenu();
              }}
              key='reply'
            >
              Reply
            </MenuItem>,
            <MenuItem
              onClick={() => {
                dispatch(pushModal({
                  title: 'Forward to',
                  body:
                    <ForwardToModal
                      clearSelectedMessages={clearSelectedMessages}
                      forwardToChat={forwardToChat}
                    />
                }));
                closeMenu();
              }}
              key='forward'
            >
              Forward
            </MenuItem>,
            allSelectedAreFromCurrent &&
            <MenuItem
              key='delete'
              onClick={() => {
                // TODO: modal
                send(WS_ENDPOINTS.messages.remove, selectedMessages.map(msg => msg.id));
                closeMenu();
              }}
            >
              Delete
            </MenuItem>
          ]
        }
        {
          showChatOptions && showSelectedMsgOptions &&
          <Divider />
        }
        {
          showChatOptions &&
          [
            <MenuItem
              onClick={() => {
                closeChat();
                closeMenu();
              }}
              key='closeChat'
            >
              Close Chat
            </MenuItem>,
            <MenuItem
              onClick={() => {
                openChatInfo();
                closeMenu();
              }}
              key='info'
            >
              Chat Info
            </MenuItem>
          ]
        }
      </Menu>
    </React.Fragment>;

  const closeChatBtn =
    <Tooltip title='Close chat'>
      <IconButton
        onClick={closeChat}
        className={styles.rightArea}
      >
        <Close />
      </IconButton>
    </Tooltip>;

  return (
    <Box width='100%'>
      <Box
        className={clsx(
          styles.basic,
          slotData.size.eq(CWBp.names.small, CWBp.axis.vert) ? styles.heightS : styles.heightML
        )}
      >
        {
          statistics.moreThanOne &&
          <Tooltip title='Move to another slot'>
            <ControlCamera
              onMouseOver={() => setDraggable(true)}
              onMouseLeave={() => setDraggable(false)}
              className={clsx(dragStyles.cursorMove, styles.dragIndicator, styles.leftArea)}
            />
          </Tooltip>
        }
        {
          selectedMessagesPresent && slotData.size.lt(CWBp.names.large, CWBp.axis.vert)
            ? <Box display='flex' className={styles.middleArea}>{selectedMessagesDisplay}</Box>
            : titlePane
        }
        {showChatOptions ? chatMenu : closeChatBtn}
      </Box>
      {
        selectedMessagesPresent && slotData.size.eq(CWBp.names.large, CWBp.axis.vert) &&
        <Box display='flex' className={clsx(styles.basic, styles.heightS)}>
          {selectedMessagesDisplay}
          {slotData.size.lt(CWBp.names.large, CWBp.axis.hor) && chatMenu}
        </Box>
      }
    </Box>
  );
}

ChatWindowHeader.propTypes = {
  setDraggable: func.isRequired,
  chatId: number.isRequired
};

export default ChatWindowHeader;