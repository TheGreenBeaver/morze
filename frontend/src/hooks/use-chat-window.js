import { useFormikContext } from 'formik';
import {
  FILE_TYPES,
  HTTP_ENDPOINTS,
  INITIAL_MENTIONED_DATA,
  INITIAL_MSG_DATA,
  MSG_FIELD_NAMES,
  YOUTUBE_HOSTS
} from '../util/constants';
import useReadFiles from './use-read-files';
import { useChatWindowContext } from '../contexts/chat-window-context';
import { useAxios } from '../contexts/axios-context';
import { v4 as uuid } from 'uuid';
import { isYouTubeLinkUsed } from '../util/misc';
import queryString  from 'query-string';
import { useDispatch } from 'react-redux';
import { setDataToRebase } from '../store/actions/chats';
import { useCallback } from 'react';
import useCachedFunction from './use-cached-function';


function useChatWindow() {
  const { setValues, values, setFieldValue } = useFormikContext();
  const { api } = useAxios();

  const dispatch = useDispatch();

  const {
    setIsEditing,
    setValuesBeforeEditing,
    setEditedMsgInitial,
    valuesBeforeEditing,
    setMessagesToMention,
    isEditing,
    selectedMessages,
    clickMessage,
    mentionHere,
    mentionAtChat,
    reply,
    messagesToMention,
    clearMentions,
    clearSelectedMessages,
    chatData,
    slotData,
    scrollToMessage,
    dataToRebase,
    messagesListLoaded
  } = useChatWindowContext();
  const readFiles = useReadFiles();

  const attachmentsValues = values[MSG_FIELD_NAMES.attachments];
  const attachmentsDisplay = values[MSG_FIELD_NAMES.asDataUrls];
  const messageText = values[MSG_FIELD_NAMES.text];

  function cancelEditing() {
    setIsEditing(false);
    setValuesBeforeEditing(INITIAL_MSG_DATA);
    setEditedMsgInitial(INITIAL_MENTIONED_DATA);
    setValues(valuesBeforeEditing);
    clearMentions();
  }

  function startEditing(msg) {
    const ownAttachments = msg.attachments.filter(att => att.isDirect);
    const editedMsgValues = {
      text: msg.text,
      attachments: ownAttachments.map(att => ({ fId: att.id, file: att.file, type: att.type, saved: att.saved })),
      asDataUrls: ownAttachments.map(att => ({ fId: att.id, url: att.file, type: att.type }))
    };
    setIsEditing(true);
    setValuesBeforeEditing(values);
    setEditedMsgInitial({
      ...editedMsgValues,
      id: msg.id,
      mentionedMessages: msg.mentionedMessages
    });
    setValues(editedMsgValues);
    setMessagesToMention(msg.mentionedMessages);
  }

  function addAttachments(files) {
    readFiles(
      files,
      ({ valueUpd, displayUpd }) => {
        setFieldValue(MSG_FIELD_NAMES.attachments, [...attachmentsValues, ...valueUpd]);
        setFieldValue(MSG_FIELD_NAMES.asDataUrls, [...attachmentsDisplay, ...displayUpd]);
      }
    );
  }

  function addAttachmentsByLinks(links) {
    const valueUpd = [];
    const displayUpd = [];
    // skip ones that are already uploaded
    const validLinks = links.filter(link =>
      !attachmentsValues.find(att => att.file === link || isYouTubeLinkUsed(att.file?.links, link))
    );
    let unreadAmount = validLinks.length;

    const checkFinish = () => {
      if (--unreadAmount === 0) {
        setFieldValue(MSG_FIELD_NAMES.attachments, [...attachmentsValues, ...valueUpd]);
        setFieldValue(MSG_FIELD_NAMES.asDataUrls, [...attachmentsDisplay, ...displayUpd]);
      }
    }

    for (const link of validLinks) {
      let url;
      try {
        url = new URL(link);
      } catch {
        // skip invalid urls
        checkFinish();
        continue;
      }

      const { host, search: rawSearch, pathname } = url;
      const search = queryString.parse(rawSearch);
      if (Object.values(YOUTUBE_HOSTS).includes(host)) { // youtube
        let videoId;
        if (host === YOUTUBE_HOSTS.be) {
          videoId = pathname.replace('/', '');
        } else {
          videoId = search.v;
        }

        if (!videoId) {
          checkFinish();
          continue;
        }

        api(HTTP_ENDPOINTS.youtube, { videoId }).call()
          .then(ytData => {
            valueUpd.push({ fId: ytData.id, file: ytData.file, type: ytData.type, saved: false });
            displayUpd.push({ fId: ytData.id, url: ytData.file, type: ytData.type });
            checkFinish();
          })
          .catch(e => {
            console.log(e);
            checkFinish();
          });
      } else { // images
        const image = document.createElement('img');
        image.setAttribute('src', link);
        image.onload = () => {
          const fId = uuid();
          valueUpd.push({ fId, file: link, type: FILE_TYPES.img, saved: false });
          displayUpd.push({ fId, url: link, type: FILE_TYPES.img });
          checkFinish();
        };
        image.onerror = e => {
          console.log(e);
          checkFinish();
        };
      }
    }
  }

  function removeAttachment(fId) {
    setFieldValue(
      MSG_FIELD_NAMES.attachments,
      attachmentsValues.filter(av => av.fId !== fId)
    );
    setFieldValue(
      MSG_FIELD_NAMES.asDataUrls,
      attachmentsDisplay.filter(ad => ad.fId !== fId)
    );
  }

  const _saveData = useCachedFunction(
    (_chatId, _values) => dispatch(setDataToRebase(_chatId, _values))
  );

  function saveData() {
    _saveData(chatData.id, values);
  }

  const rebaseData = useCallback(() => {
    if (dataToRebase) {
      setValues(dataToRebase);
    }
  }, [dataToRebase]);

  return {
    isEditing,
    startEditing,
    cancelEditing,
    addAttachments,
    removeAttachment,
    attachmentsValues,
    attachmentsDisplay,
    messageText,
    selectedMessages,
    clickMessage,
    mentionHere,
    mentionAtChat,
    reply,
    messagesToMention,
    clearMentions,
    clearSelectedMessages,
    addAttachmentsByLinks,
    slotData,
    chatData,
    scrollToMessage,
    saveData,
    rebaseData,
    messagesListLoaded
  };
}

export default useChatWindow;