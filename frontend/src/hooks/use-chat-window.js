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


function useChatWindow() {
  const { setValues, values, setFieldValue } = useFormikContext();
  const { api } = useAxios();

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
    clearSelectedMessages
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
    const editedMsgValues = {
      text: msg.text,
      attachments: msg.attachments.map(att => ({ fId: att.id, file: att.file, type: att.type })),
      asDataUrls: msg.attachments.map(att => ({ fId: att.id, url: att.file, type: att.type }))
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
    console.log(files)
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
    let unreadAmount = links.length;

    const checkFinish = () => {
      if (--unreadAmount === 0) {
        setFieldValue(MSG_FIELD_NAMES.attachments, [...attachmentsValues, ...valueUpd]);
        setFieldValue(MSG_FIELD_NAMES.asDataUrls, [...attachmentsDisplay, ...displayUpd]);
      }
    }

    for (const link of links) {
      // skip ones that are already uploaded
      if (!attachmentsValues.find(att => att.file === link || isYouTubeLinkUsed(att.file?.links, link))) {
        let url;
        try {
          url = new URL(link);
        } catch {
          // skip invalid urls
          checkFinish();
          continue;
        }

        const { host, search: rawSearch } = url;
        const search = queryString.parse(rawSearch);
        if (YOUTUBE_HOSTS.includes(host) && !!rawSearch && !!search.v) { // youtube
          const videoId = search.v;

          api(HTTP_ENDPOINTS.youtube, { videoId }).call()
            .then(ytData => {
              valueUpd.push({ fId: ytData.id, file: ytData.file, type: ytData.type });
              displayUpd.push({ fId: ytData.id, url: ytData.file, type: ytData.type });
              checkFinish()
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
            valueUpd.push({ fId, file: link, type: FILE_TYPES.img });
            displayUpd.push({ fId, url: link, type: FILE_TYPES.img });
            checkFinish();
          };
          image.onerror = e => {
            console.log(e);
            checkFinish();
          }
        }
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
    addAttachmentsByLinks
  };
}

export default useChatWindow;