import React, { useEffect, useRef, useState } from 'react';
import { bool, func, number, object } from 'prop-types';
import { CHAT_WINDOWS_CONFIG, HTTP_ENDPOINTS, WS_ENDPOINTS, MSG_FIELD_NAMES } from '../../util/constants';
import { useWs } from '../../contexts/ws-context';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { Close, ControlCamera, Send } from '@material-ui/icons';
import useStyles from './styles/chat-window.styles';
import clsx from 'clsx';
import HintButton from '../hint-button';
import { Formik, Form, useFormikContext } from 'formik';
import useDragStyles from '../../theme/drag';
import { Tooltip } from '@material-ui/core';
import SubmittableTextArea from '../submittable-text-area';
import Message from './message';
import { pick } from 'lodash';
import Divider from '@material-ui/core/Divider';
import { useAxios } from '../../contexts/axios-context';
import MessageAttachment from './message-attachment';
import AttachmentsDisplay from '../attachments-display';
import { getOriginalFileName } from '../../util/misc';
import MentionedMessagesDisplay from './mentioned-messages-display';
import { isEqual } from 'lodash';
import ChatBotMessage from './chat-bot-message';
import { useChats } from '../../contexts/chats-context';


const INITIAL_DATA = {
  [MSG_FIELD_NAMES.text]: '',
  [MSG_FIELD_NAMES.attachments]: [],
  [MSG_FIELD_NAMES.asDataUrls]: [],
};

function ChatWindow({
  idx, chatId, setDraggedItem, setDragTarget, onDragEnd, isDragTarget, isDragged,
  setValuesBeforeEditing, isEditing, setIsEditing, setEditedMsgInitial, valuesBeforeEditing
}) {
  const { setValues, values } = useFormikContext();
  const { send } = useWs();
  const { removeSlot, allChats, statistics, addOrRemoveChat, readMessage, setMessagesToMention } = useChats();

  const [draggable, setDraggable] = useState(false);
  const [selectedMessagesIds, setSelectedMessagesIds] = useState([]);

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
          <HintButton
            title='Close chat'
            buttonProps={{
              onClick: () => addOrRemoveChat(chatId)
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
            chatData.messages.map(msg =>
              msg.user.fromChatBot
                ? <ChatBotMessage text={msg.text} readMessage={() => readMessage(msg.id, msg.createdAt, chatId)} />
                :
                <Box
                  id={`message-${chatId}-${msg.id}`}
                  key={msg.id}
                  display='flex'
                  alignItems='center'
                  flexDirection='column'
                  className={clsx(
                    styles.oneMessageWrapper,
                    selectedMessagesIds.includes(msg.id) && styles.oneMessageWrapperSelected
                  )}
                  onClick={() => {
                    setSelectedMessagesIds(curr => {
                      return curr.includes(msg.id)
                        ? curr.filter(id => id !== msg.id)
                        : [...curr, msg.id];
                    });
                  }}
                  onMouseEnter={() => readMessage(msg.id, msg.createdAt, chatId)}
                >
                  <Message
                    user={msg.user}
                    text={msg.text}
                    onEdit={() => {
                      setValuesBeforeEditing(values);

                      setIsEditing(true);
                      const editedMsgValues = {
                        ...pick(msg, [MSG_FIELD_NAMES.text, 'id']),
                        [MSG_FIELD_NAMES.attachments]: msg.attachments.map(att => ({
                          file: { path: att.file, name: getOriginalFileName(att.file) },
                          fId: att.id
                        })),
                        [MSG_FIELD_NAMES.asDataUrls]: msg.attachments.map(att => ({
                          url: att.file,
                          fId: att.id
                        }))
                      };
                      setEditedMsgInitial(editedMsgValues);
                      setMessagesToMention([...msg.mentionedMessages]);
                      setValues(editedMsgValues);
                    }}
                    attachments={msg.attachments}
                    onReply={() => setMessagesToMention([msg])}
                    createdAt={msg.createdAt}
                    isMentioned={false}
                    isUpdated={msg.isUpdated}
                    chatId={chatId}
                    isRead={msg.isRead}
                  />
                  {
                    msg.mentionedMessages.map(mMsg =>
                      <Message
                        key={mMsg.id}
                        user={mMsg.user}
                        text={mMsg.text}
                        onClick={e => {
                          e.stopPropagation();
                          console.log(`SCROLL TO MESSAGE WITH ID = ${mMsg.id}`);
                        }}
                        attachments={mMsg.attachments}
                        isMentioned={true}
                        createdAt={mMsg.createdAt}
                        chatId={chatId}
                        hasMentioned={mMsg.hasMentioned}
                      />
                    )
                  }
                </Box>
            )
          }
        </Box>

        <Divider />
        <Form className={styles.inputWrapper}>
          <MessageAttachment />
          <SubmittableTextArea
            margin='none'
            placeholder='Type your message...'
            valuesBeforeEditing={valuesBeforeEditing}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
          <HintButton title='Send' buttonProps={{ type: 'submit' }}>
            <Send />
          </HintButton>
        </Form>
        <MentionedMessagesDisplay />
        <AttachmentsDisplay />
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

function isFile(att) {
  return att.file instanceof File;
}

function FormikWrappedChatWindow(props) {
  const { send } = useWs();
  const { api } = useAxios();
  const [valuesBeforeEditing, setValuesBeforeEditing] = useState(INITIAL_DATA);
  const [editedMsgInitial, setEditedMsgInitial] = useState(INITIAL_DATA);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Formik
      initialValues={INITIAL_DATA}
      onSubmit={async (values, formikHelpers) => {
        const { text: rawText, attachments } = values;
        // Edited a message, but did not change anything: exit editing mode, reset values to the previously written message
        if (
          isEditing &&
          isEqual(rawText, editedMsgInitial.text) &&
          isEqual(attachments, editedMsgInitial.attachments) &&
          isEqual(mentionedMessages, editedMsgInitial.mentionedMessages)
        ) {
          setIsEditing(false);
          formikHelpers.setValues(valuesBeforeEditing);
          return;
        }

        const text = rawText.trim();
        // A new message is written, but has no content: do nothing, just wait for a proper message
        if (!(text || attachments.length || mentionedMessages.length)) {
          return;
        }

        formikHelpers.setSubmitting(true);
        const attachmentsToUpload = attachments.filter(isFile);
        let attachmentsToSend = null;

        // Some files are fresh, not just URLs received from BE (can happen when editing a message with attachments)
        if (attachmentsToUpload.length) {
          const formData = new FormData();
          attachmentsToUpload.forEach(a => {
            formData.append('files', a.file, a.file.name);
          });
          const { attachments: filePaths } = await api(HTTP_ENDPOINTS.uploadFile, formData).call();
          attachmentsToSend = [
            ...attachments.filter(att => !isFile(att)).map(att => ({ file: att.file.path })),
            ...filePaths.map(fp => ({ file: fp }))
          ];
        }

        const toSend = {
          [MSG_FIELD_NAMES.mentionedMessages]: values[MSG_FIELD_NAMES.mentionedMessages],
          text, attachments: attachmentsToSend, chat: props.chatId
        };
        if (isEditing) {
          toSend.message = values.id;
        }
        send(WS_ENDPOINTS.messages[isEditing ? 'edit' : 'send'], toSend);
        formikHelpers.setValues(isEditing ? valuesBeforeEditing : INITIAL_DATA);
        setIsEditing(false);
      }}
      enableReinitialize
    >
      <ChatWindow
        {...props}
        setValuesBeforeEditing={setValuesBeforeEditing}
        setEditedMsgInitial={setEditedMsgInitial}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        valuesBeforeEditing={valuesBeforeEditing}
      />
    </Formik>
  )
}

FormikWrappedChatWindow.propTypes = {
  idx: number.isRequired,
  setDragTarget: func.isRequired,
  setDraggedItem: func.isRequired,
  onDragEnd: func.isRequired,
  isDragTarget: bool,
  isDragged: bool,
  chatId: number,
};
ChatWindow.propTypes = {
  ...FormikWrappedChatWindow.propTypes,
  setValuesBeforeEditing: func.isRequired,
  valuesBeforeEditing: object.isRequired,
  setEditedMsgInitial: func.isRequired,
  isEditing: bool.isRequired,
  setIsEditing: func.isRequired
}

export default FormikWrappedChatWindow;