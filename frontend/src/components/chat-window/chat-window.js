import React, { useEffect, useRef, useState } from 'react';
import { bool, func, number } from 'prop-types';
import { CHAT_WINDOWS_CONFIG, WS_ENDPOINTS } from '../../util/constants';
import { useWs } from '../../contexts/ws-context';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { Cancel, Close, ControlCamera, Reply } from '@material-ui/icons';
import useStyles from './styles/chat-window.styles';
import clsx from 'clsx';
import HintButton from '../hint-button';
import useDragStyles from '../../theme/drag';
import { Tooltip } from '@material-ui/core';
import Message from '../message';
import Divider from '@material-ui/core/Divider';
import { useChats } from '../../contexts/chats-context';
import MessageInputArea from '../message-input-area';
import useChatWindow from '../../hooks/use-chat-window';


function ChatWindow({ idx, chatId, setDraggedItem, setDragTarget, onDragEnd, isDragTarget, isDragged }) {
  const { send } = useWs();
  const { removeSlot, allChats, statistics, addOrRemoveChat } = useChats();
  const { selectedMessages, mentionHere, clearMentions, clearSelectedMessages } = useChatWindow();

  const [draggable, setDraggable] = useState(false);

  const slotRef = useRef(null);

  const styles = useStyles();
  const dragStyles = useDragStyles();

  useEffect(() => {
    if (chatId != null) {
      send(WS_ENDPOINTS.messages.list, { chat: chatId });
    }
  }, [chatId]);

  let content;
  if (chatId == null) {
    content =
      <React.Fragment>
        <Typography
          gutterBottom
          align='center'
        >
          This is an empty slot for some chat
        </Typography>
        <Button
          variant='text'
          color='secondary'
          onClick={() => removeSlot(idx)}
        >
          Close Slot
        </Button>
      </React.Fragment>;
  } else {
    const chatData = allChats[chatId];

    content =
      <Box
        position='relative'
        draggable={draggable}
        height='100%'
        width='100%'
        overflow='hidden'
        display='flex'
        alignItems='stretch'
        flexDirection='column'
        onDragStart={() => setDraggedItem(chatId)}
        onDragEnd={onDragEnd}
      >
        {isDragged && <div className={styles.draggedItemOverlay} />}
        <Box
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          position='absolute'
          width='100%'
          top={0}
          className={styles.chatHeaderWrapper}
        >
          {
            statistics.moreThanOne &&
            <Tooltip title='Move to another slot'>
              <ControlCamera
                onMouseOver={() => setDraggable(true)}
                onMouseLeave={() => setDraggable(false)}
                className={clsx(dragStyles.cursorMove, styles.dragIndicator)}
              />
            </Tooltip>
          }
          <Typography variant='h5'>{chatData.name}</Typography>
          {
            !!selectedMessages.length &&
            <Box display='flex'>
              <Typography>
                {selectedMessages.length} Messages
              </Typography>
              <HintButton
                title='Reply'
                buttonProps={{
                  onClick: e => {
                    e.stopPropagation();
                    mentionHere();
                  },
                  color: 'secondary'
                }}
              >
                <Reply />
              </HintButton>
              <HintButton
                title='Dismiss'
                buttonProps={{
                  onClick: e => {
                    e.stopPropagation();
                    clearMentions();
                  },
                  color: 'secondary'
                }}
              >
                <Cancel />
              </HintButton>
            </Box>
          }
          <HintButton
            title='Close chat'
            buttonProps={{
              onClick: () => {
                addOrRemoveChat(chatId);
                clearSelectedMessages();
                clearMentions();
              }
            }}
          >
            <Close />
          </HintButton>
        </Box>

        <Box
          overflow='auto'
          flex='auto'
          alignItems='center'
          display='flex'
          flexDirection='column-reverse'
          className={styles.messagesWrapper}
        >
          {
            chatData.messages.map((msg, idx) =>
              <Message
                key={msg.id}
                chatId={chatId}
                msg={msg}
                prevMsg={chatData.messages[idx + 1]}
              />
            )
          }
        </Box>

        <Divider />
        <MessageInputArea />
      </Box>;
  }

  return (
    <Box
      className={clsx([
        `${CHAT_WINDOWS_CONFIG.baseAreaName}${idx + 1}`,
        styles.slot,
        isDragTarget && dragStyles.dragTarget
      ])}
      display='flex'
      alignItems='center'
      justifyContent='center'
      flexDirection='column'
      onDragOver={() => setDragTarget(idx)}
      onDragLeave={e => {
        const { top, bottom, left, right } = slotRef.current?.getBoundingClientRect();
        const { pageX, pageY } = e;
        if (pageY > 0 && (pageX > right || pageX < left || pageY > bottom || pageY < top)) {
          setDragTarget(null);
        }
      }}
      ref={slotRef}
    >
      {content}
    </Box>
  );
}

ChatWindow.propTypes = {
  idx: number.isRequired,
  setDragTarget: func.isRequired,
  setDraggedItem: func.isRequired,
  onDragEnd: func.isRequired,
  isDragTarget: bool,
  isDragged: bool,
  chatId: number,
};

export default ChatWindow;