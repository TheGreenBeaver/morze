import React, { useState } from 'react';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import clsx from 'clsx';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { getOriginalFileName } from '../../util/misc';
import HintButton from '../hint-button';
import { Adjust, Delete, DoneAll, Edit, Reply } from '@material-ui/icons';
import { ONE_IMAGE_WRAPPER, FILE_TYPES } from '../../util/constants';
import { setModalContent } from '../../store/actions/general';
import ImagesModal from '../modals/images-modal';
import DisplayDoc from '../attachments-display/display-doc';
import useStyles from './styles/message.styles';
import { useChats } from '../../contexts/chats-context';
import zDate from '../../util/dates';
import { useDispatch, useSelector } from 'react-redux';
import useChatWindow from '../../hooks/use-chat-window';
import { default as useDisplayDocStyles } from '../attachments-display/styles/display-doc.styles';


function RealUserMessage({ msg, isMentioned, chatId }) {
  const dispatch = useDispatch();
  const styles = useStyles();
  const displayDocStyles = useDisplayDocStyles();
  const [isHovered, setIsHovered] = useState(false);
  const { id: currentUserId } = useSelector(state => state.account.userData);

  const { user, createdAt, isUpdated, text, attachments, mentionedCount } = msg;

  const { allChats } = useChats();
  const { startEditing, reply } = useChatWindow();

  const splText = (text || '').split(/\n/g);
  let textWithNewLines;
  if (splText.length > 1) {
    textWithNewLines = splText
      .map((part, idx) => [
        <React.Fragment key={idx * 2}>{part}</React.Fragment>,
        <br key={idx * 2 + 1} />
      ])
      .flat();
  } else {
    textWithNewLines = text;
  }

  const isRead = zDate(createdAt).isBefore(allChats[chatId].lastReadMessage?.createdAt);

  const imageAttachments = attachments.filter(({ type }) => type === FILE_TYPES.img);
  const imagesAmount = imageAttachments.length;

  const docAttachments = attachments.filter(({ type }) => type === FILE_TYPES.doc);
  const docAmount = docAttachments.length;

  const imgContainerClass = styles[`imgContainer_${imagesAmount}img`] || styles.imgContainer_many;

  return (
    <div
      className={clsx(
        styles.message,
        isMentioned && styles.mentionedMessage
      )}
      onMouseLeave={() => {
        if (!isMentioned) {
          setIsHovered(false);
        }
      }}
      onMouseOver={() => {
        if (!isMentioned) {
          setIsHovered(true);
        }
      }}
    >
      <div className={styles.avatarColumn}>
        <Avatar src={user.avatar} />
      </div>

      <Box flex='auto'>
        <div className={styles.messageHeaderBlock}>
          <div>
            <Typography className={styles.name}>{user.firstName} {user.lastName}</Typography>
            <Typography color='textSecondary'>{zDate(createdAt).fTime()}{isUpdated ? ' (Edited)' : ''}</Typography>
          </div>

          {
            isHovered && !isMentioned &&
            <div>
              {
                user.id === currentUserId &&
                <React.Fragment>
                  <HintButton
                    title='Edit'
                    buttonProps={{
                      onClick: e => {
                        e.stopPropagation();
                        startEditing(msg);
                      },
                      color: 'secondary'
                    }}>
                    <Edit />
                  </HintButton>
                  <HintButton
                    title='Delete'
                    buttonProps={{
                      color: 'secondary',
                      onClick: e => {
                        e.stopPropagation();
                        console.log('delete');
                      },
                      classes: { root: styles.deleteButton }
                    }}
                  >
                    <Delete />
                  </HintButton>
                </React.Fragment>
              }
              <HintButton
                title='Reply'
                buttonProps={{
                  onClick: e => {
                    e.stopPropagation();
                    reply(msg);
                  },
                  color: 'secondary'
                }}
              >
                <Reply />
              </HintButton>
            </div>
          }
        </div>

        <Typography>{textWithNewLines}</Typography>
        {
          !!imagesAmount &&
          <div className={clsx(styles.imgContainer, imgContainerClass)}>
            {
              imageAttachments.map((att, idx) =>
                <Box key={idx} position='relative' className={ONE_IMAGE_WRAPPER}>
                  <img
                    src={att.file}
                    alt='attachment'
                    className={clsx(
                      styles.imageAttachment,
                      att.height <= att.width
                        ? styles.imageAttachmentHorizontal
                        : styles.imageAttachmentVertical
                    )}
                    onClick={e => {
                      e.stopPropagation();
                      dispatch(setModalContent({
                        body: <ImagesModal chatId={chatId} initialImageId={att.id} />,
                        title: 'Chat Archives'
                      }));
                    }}
                  />
                </Box>
              )
            }
          </div>
        }
        {
          !!docAmount &&
          <Box display='flex' flexWrap='wrap' gridGap={8}>
            {
              docAttachments.map(att =>
                <DisplayDoc
                  url={att.file}
                  specificStyles={displayDocStyles}
                  originalName={getOriginalFileName(att.file)}
                />
              )
            }
          </Box>
        }
        {
          !isMentioned &&
          (isRead ? <DoneAll color='secondary' /> : <Adjust color='error' />)
        }
        {!!mentionedCount && <Typography color='secondary'>{`> ${mentionedCount} ...`}</Typography>}
      </Box>
    </div>
  );
}

RealUserMessage.propTypes = {
  msg: shape({
    user: shape({
      avatar: string,
      firstName: string.isRequired,
      lastName: string.isRequired,
      id: number.isRequired
    }),
    createdAt: string.isRequired,
    isUpdated: bool,
    text: string,
    attachments: arrayOf(shape({
      file: string.isRequired,
      id: number.isRequired
    })).isRequired,
    mentionedCount: number
  }).isRequired,
  isMentioned: bool,
  chatId: number.isRequired
};

RealUserMessage.defaultProps = {
  isMentioned: false
};

export default RealUserMessage;