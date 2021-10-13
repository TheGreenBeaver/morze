import React, { useEffect, useState, useRef } from 'react';
import { bool, func, number } from 'prop-types';
import { AUTO_SCROLL_THRESHOLD, CHAT_WINDOWS_CONFIG, WS_ENDPOINTS } from '../../util/constants';
import { useWs } from '../../contexts/ws-context';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import useStyles from './styles/chat-window.styles';
import clsx from 'clsx';
import useDragStyles from '../../theme/drag';
import Message from '../message';
import Divider from '@material-ui/core/Divider';
import { useChats } from '../../contexts/chats-context';
import MessageInputArea from '../message-input-area';
import useChatWindow from '../../hooks/use-chat-window';
import ChatWindowHeader from './chat-window-header';
import { useDispatch } from 'react-redux';
import { setScrollToMessage } from '../../store/actions/chats';
import zDate from '../../util/dates';
import { getMsgAnchor } from '../../util/misc';
import Fab from '@material-ui/core/Fab';
import { ArrowDownward, ArrowUpward } from '@material-ui/icons';
import Badge from '@material-ui/core/Badge';
import { last, throttle, isEqual } from 'lodash';
import useReRenderTrigger from '../../hooks/use-re-render-trigger';


function ChatWindow({ idx, chatId, setDraggedItem, setDragTarget, onDragEnd, isDragTarget, isDragged }) {
  const { send } = useWs();
  const { removeSlot } = useChats();
  const { slotData, chatData, scrollToMessage, saveData, rebaseData, messagesListLoaded } = useChatWindow();
  const dispatch = useDispatch();
  const sizedAutoScrollThreshold = AUTO_SCROLL_THRESHOLD[slotData.size.breakpoint.h];

  const initialScrollsDone = useRef(0); // first one for the last message, second one for the list
  const initialScrollsNeeded = useRef(2);
  const inputAreaRef = useRef(null);
  const wrapperBoxRef = useRef(null);

  const [draggable, setDraggable] = useState(false);
  const [navigateButtonData, setNavigateButtonData] = useState({
    props: {},
    content: null,
    shouldRender: false
  });
  console.log(navigateButtonData);

  const styles = useStyles();
  const dragStyles = useDragStyles();

  const firstUnreadData = chatData.lastReadMessage
    ? chatData.messages.find(msg => zDate(msg.createdAt).isAfter(chatData.lastReadMessage.createdAt, true))
    : chatData.messages[0];
  useEffect(() => {
    const _wrapperBox = wrapperBoxRef.current;

    const recalculateNavigateButton = () => {
      const wrapperBox = wrapperBoxRef.current;
      let newNavigateButtonData = {
        props: {},
        content: null,
        shouldRender: false
      };

      if (wrapperBox) {
        const { height: visibleWrapperHeight } = wrapperBox.getBoundingClientRect();
        const commonProps = {
          size: 'medium',
          color: 'primary',
          style: { position: 'absolute', top: (inputAreaRef.current?.offsetTop || 56) - 56, right: 32 },
          variant: 'circular'
        };

        if (!firstUnreadData) {
          const scrollIsMeaningful =
            wrapperBox.scrollHeight - wrapperBox.scrollTop >
            visibleWrapperHeight * sizedAutoScrollThreshold;
          if (scrollIsMeaningful) {
            newNavigateButtonData = {
              shouldRender: true,
              props: {
                ...commonProps,
                onClick: () => {
                  const lastMessageAnchor = getMsgAnchor(last(chatData.messages).id, chatId);
                  document.getElementById(lastMessageAnchor).scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                  });
                }
              },
              content: <ArrowDownward />
            };
          }
        } else {
          const firstUnreadAnchor = getMsgAnchor(firstUnreadData.id, chatId);
          const firstUnreadElement = document.getElementById(firstUnreadAnchor);

          if (firstUnreadElement) {
            const visibleElementPosition = firstUnreadElement.offsetTop - wrapperBox.scrollTop;

            if (visibleElementPosition < 0) {
              newNavigateButtonData= {
                props: {
                  ...commonProps,
                  onClick: () => firstUnreadElement.scrollIntoView({
                    block: 'center',
                    behavior: 'smooth'
                  })
                },
                shouldRender: true,
                content:
                  <Badge badgeContent={chatData.unreadCount} color='secondary'>
                    <ArrowUpward />
                  </Badge>
              };
            } else if (visibleWrapperHeight < visibleElementPosition) {
              newNavigateButtonData = {
                props: {
                  ...commonProps,
                  onClick: () => firstUnreadElement.scrollIntoView({
                    block: 'center',
                    behavior: 'smooth'
                  })
                },
                shouldRender: true,
                content:
                  <Badge badgeContent={chatData.unreadCount} color='secondary'>
                    <ArrowDownward />
                  </Badge>
              }
            }
          }
        }
      }

      if (!isEqual(newNavigateButtonData, navigateButtonData)) {
        setNavigateButtonData(newNavigateButtonData);
      }
    };

    const throttled = throttle(() => recalculateNavigateButton(), 350);

    if (_wrapperBox) {
      _wrapperBox.addEventListener('scroll', throttled);
    }

    return () => {
      if (_wrapperBox) {
        _wrapperBox.removeEventListener('scroll', throttled);
      }
    }
  }, [wrapperBoxRef]);

  useReRenderTrigger(['scroll'], { eventEmitter: wrapperBoxRef.current, auto: true, wait: 400 });

  useEffect(() => {
    if (chatId != null) {
      if (messagesListLoaded) {
        initialScrollsNeeded.current = 1;
      } else {
        send(WS_ENDPOINTS.messages.list, { chat: chatId });
      }
    }
  }, [chatId]);

  useEffect(() => {
    rebaseData();
  }, [rebaseData])

  useEffect(() => {
    if (scrollToMessage) {
      const messageElement = document.getElementById(scrollToMessage);
      if (messageElement) {
        messageElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        dispatch(setScrollToMessage(chatId, null));
      }
    }
  }, [scrollToMessage, chatData.messages]);

  useEffect(() => { // ...otherwise, check the user has not scrolled to much upwards
    if (chatId) {
      const wrapperBox = wrapperBoxRef.current;
      if (wrapperBox) {
        const { height: visibleWrapperHeight } = wrapperBox.getBoundingClientRect();
        const scrollIsMeaningful =
          wrapperBox.scrollHeight - wrapperBox.scrollTop >
          visibleWrapperHeight * sizedAutoScrollThreshold;
        if (!scrollIsMeaningful || !initialScrollsDone.current < initialScrollsNeeded.current) {
          const lastMessageAnchor = getMsgAnchor(last(chatData.messages).id, chatId);
          document.getElementById(lastMessageAnchor).scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          });
          initialScrollsDone.current++;
        }
      }
    }
  }, [chatData.messages, chatId]);

  function getNavigateButton() {
    if (!navigateButtonData.shouldRender) {
      return null;
    }

    return (
      <Fab {...navigateButtonData.props}>
        {navigateButtonData.content}
      </Fab>
    );
  }

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
        paddingBottom={1}
        onDragStart={() => {
          setDraggedItem(chatId);
          saveData();
        }}
        onDragEnd={onDragEnd}
      >
        {isDragged && <div className={styles.draggedItemOverlay} />}
        <ChatWindowHeader chatId={chatId} setDraggable={setDraggable} />
        <Box flex='auto'/>
        <Box
          overflow='auto'
          alignItems='center'
          display='flex'
          flexDirection='column'
          className={styles.messagesWrapper}
          ref={wrapperBoxRef}
        >
          {
            chatData.messages.map((msg, idx) =>
              <Message
                key={msg.id}
                chatId={chatId}
                msg={msg}
                prevMsg={chatData.messages[idx - 1]}
              />
            )
          }
        </Box>

        {getNavigateButton()}

        <Divider />
        <MessageInputArea innerRef={inputAreaRef} />
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
      onDragEnter={() => {
        setDragTarget(idx);
        saveData();
      }}
      onDragLeave={e => {
        const { top, bottom, left, right } = slotData.rRef?.getBoundingClientRect();
        const { pageX, pageY } = e;
        if (pageY > 0 && (pageX > right || pageX < left || pageY > bottom || pageY < top)) {
          setDragTarget(null);
        }
      }}
      ref={slotData.wRef}
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