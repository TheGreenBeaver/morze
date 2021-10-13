import { createContext, useContext } from 'react';
import { HTTP_ENDPOINTS, INITIAL_MSG_DATA, WS_ENDPOINTS } from '../util/constants';
import { Formik } from 'formik';
import { useWs } from './ws-context';
import { useAxios } from './axios-context';
import { isEqual } from 'lodash';
import { attachmentToApi, isFile } from '../util/misc';
import { node, number } from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  clickMessage,
  setEditedMsgInitial,
  setIsEditing,
  setMessagesToMention,
  setValuesBeforeEditing,
  clearSelectedMessages
} from '../store/actions/chats';
import { useChats } from './chats-context';


const Context = createContext({
  setEditedMsgInitial: upd => {},

  isEditing: false,
  setIsEditing: isEditing => {},

  valuesBeforeEditing: INITIAL_MSG_DATA,
  setValuesBeforeEditing: upd => {},

  messagesToMention: [],
  clearMentions: () => {},
  setMessagesToMention: newMentions => {},
  mentionHere: () => {},
  mentionAtChat: otherChat => {},
  reply: msg => {},

  selectedMessages: [],
  clickMessage: msg => {},
  clearSelectedMessages: () => {},

  scrollToMessage: null,
  dataToRebase: null,
  messagesListLoaded: false,

  chatData: {
    name: '',
    isAdmin: false,
    lastReadMessage: null,
    messages: [],
    users: [],
    unreadCount: 0,
    id: null
  },
  slotData: {
    rRef: null, // readable ref, use this for any calc operations
    wRef: () => {}, // writeable ref, use this ONLY to pass to 'ref' prop
    size: null
  }
});

// This should only be used via the useChatWindow hook, where all the setters are wrapped in complete actions, combined
// with Formik
function useChatWindowContext() {
  return useContext(Context);
}

function ChatWindowContext({ children, chatId, idx }) {
  const dispatch = useDispatch();
  const { send } = useWs();
  const { api } = useAxios();

  const { slotSizes, slotRefs, getRef, allChats, forceOpenChat } = useChats();
  const {
    isEditing,
    editedMsgInitial,
    valuesBeforeEditing,
    messagesToMention,
    selectedMessages,
    scrollToMessage,
    dataToRebase,
    messagesListLoaded,

    name,
    isAdmin,
    lastReadMessage,
    messages,
    users,
    unreadCount
  } = (allChats[chatId] || {});

  return (
    <Context.Provider
      value={{
        setEditedMsgInitial: upd => dispatch(setEditedMsgInitial(chatId, upd)),

        isEditing,
        setIsEditing: newIsEditing => dispatch(setIsEditing(chatId, newIsEditing)),

        valuesBeforeEditing,
        setValuesBeforeEditing: upd => dispatch(setValuesBeforeEditing(chatId, upd)),

        messagesToMention,
        mentionHere: () => {
          dispatch(setMessagesToMention(chatId, [...selectedMessages]));
          dispatch(clearSelectedMessages(chatId));
        },
        mentionAtChat: otherChat => {
          dispatch(setMessagesToMention(otherChat, [...selectedMessages]));
          dispatch(clearSelectedMessages(chatId));
          forceOpenChat(otherChat);
        },
        reply: msg => dispatch(setMessagesToMention(chatId, [msg])),
        clearMentions: () => dispatch(setMessagesToMention(chatId, [])),
        setMessagesToMention: newMentions => dispatch(setMessagesToMention(chatId, newMentions)),

        selectedMessages,
        clickMessage: msg => dispatch(clickMessage(chatId, msg)),
        clearSelectedMessages: () => dispatch(clearSelectedMessages(chatId)),

        scrollToMessage,
        dataToRebase,
        messagesListLoaded,

        chatData: {
          name,
          lastReadMessage,
          messages,
          isAdmin,
          users,
          unreadCount,
          id: chatId
        },
        slotData: {
          size: slotSizes[idx],
          wRef: getRef(idx),
          rRef: slotRefs[idx]
        }
      }}
    >
      <Formik
        initialValues={INITIAL_MSG_DATA}
        onSubmit={async (values, formikHelpers) => {
          const { text: rawText, attachments } = values;
          // Edited a message, but did not change anything: exit editing mode, reset values to the previously written message
          if (
            isEditing &&
            isEqual(rawText, editedMsgInitial.text) &&
            isEqual(attachments, editedMsgInitial.attachments) &&
            isEqual(messagesToMention.map(m => m.id), editedMsgInitial.mentionedMessages.map(m => m.id))
          ) {
            dispatch(setIsEditing(chatId, false));
            formikHelpers.setValues(valuesBeforeEditing);
            return;
          }

          const text = rawText.trim();
          // A new message is written, but has no content: do nothing, just wait for a proper message
          if (!(text || attachments.length || messagesToMention.length)) {
            return;
          }

          const attachmentsToUpload = attachments.filter(isFile);
          const linkedAttachments = attachments.filter(att => !isFile(att)).map(attachmentToApi);
          let attachmentsToSend = [...linkedAttachments];

          // Some files are fresh, not just URLs received from BE (can happen when editing a message with attachments)
          if (attachmentsToUpload.length) {
            const formData = new FormData();
            attachmentsToUpload.forEach(a => {
              formData.append('files', a.file, a.file.name);
            });
            const { attachments: filePaths } = await api(HTTP_ENDPOINTS.uploadFile, formData).call();
            attachmentsToSend = [
              ...linkedAttachments,
              ...filePaths
            ];
          }

          const toSend = {
            mentionedMessages: messagesToMention.map(m => m.id),
            text, attachments: attachmentsToSend
          };
          if (isEditing) {
            toSend.message = editedMsgInitial.id;
          } else {
            toSend.chat = chatId;
          }
          send(WS_ENDPOINTS.messages[isEditing ? 'edit' : 'send'], toSend);
          formikHelpers.setValues(isEditing ? valuesBeforeEditing : INITIAL_MSG_DATA);
          dispatch(setMessagesToMention(chatId, []));
          dispatch(setIsEditing(chatId, false));
        }}
      >
        {children}
      </Formik>
    </Context.Provider>
  );
}

ChatWindowContext.propTypes = {
  children: node.isRequired,
  idx: number.isRequired,
  chatId: number
};

export default ChatWindowContext;
export { useChatWindowContext };