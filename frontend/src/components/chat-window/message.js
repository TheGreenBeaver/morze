import React, { useState } from 'react';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import useStyles from './styles/message.styles';
import { default as useDisplayDocStyles } from '../attachments-display/styles/display-doc.styles';
import { useDispatch, useSelector } from 'react-redux';
import HintButton from '../hint-button';
import { Adjust, Delete, DoneAll, Edit, Reply } from '@material-ui/icons';
import clsx from 'clsx';
import { extractTime, getOriginalFileName, isFileType } from '../../util/misc';
import Box from '@material-ui/core/Box';
import { ONE_IMAGE_WRAPPER } from '../../util/constants';
import { setModalContent } from '../../store/actions/general';
import ImagesModal from '../modals/images-modal';
import DisplayDoc from '../attachments-display/display-doc';


function Message({ onClick, onEdit, onReply, user, text, attachments, isMentioned, createdAt, isUpdated, chatId, mentionedCount, isRead }) {
  const dispatch = useDispatch();
  const styles = useStyles();
  const displayDocStyles = useDisplayDocStyles();
  const { id: currentUserId } = useSelector(state => state.account.userData);
  const [isHovered, setIsHovered] = useState(false);

  const splText = text.split(/\n/g);
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

  const imageAttachments = attachments.filter(({ file }) => isFileType('img', file));
  const imagesAmount = imageAttachments.length;

  const docAttachments = attachments.filter(({ file }) => isFileType('doc', file));
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
      onClick={e => {
        if (isMentioned) {
          onClick(e);
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
            <Typography color='textSecondary'>{extractTime(createdAt)}{isUpdated ? ' (Edited)' : ''}</Typography>
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
                        onEdit();
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
                    onReply();
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

Message.propTypes = {
  onClick: func,
  onEdit: func,
  onReply: func,
  user: shape({
    avatar: string,
    firstName: string.isRequired,
    lastName: string.isRequired,
    username: string.isRequired,
    isActive: bool.isRequired,
    id: number.isRequired
  }).isRequired,
  text: string.isRequired,
  attachments: arrayOf(shape({
    file: string.isRequired,
    height: number,
    width: number,
    id: number.isRequired
  })).isRequired,
  isMentioned: bool.isRequired,
  createdAt: string.isRequired,
  isUpdated: bool,
  mentionedCount: number,
  isRead: bool
};

export default Message;