import React, { useState } from 'react';
import { arrayOf, bool, number, object, oneOfType, shape, string } from 'prop-types';
import clsx from 'clsx';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import HintButton from '../hint-button';
import { Delete, Edit, MoreVert, Reply } from '@material-ui/icons';
import { WS_ENDPOINTS } from '../../util/constants';
import { pushModal } from '../../store/actions/general';
import useStyles from './styles/message.styles';
import zDate from '../../util/dates';
import { useDispatch, useSelector } from 'react-redux';
import useChatWindow from '../../hooks/use-chat-window';
import ConfirmModal from '../modals/confirm-modal';
import { useWs } from '../../contexts/ws-context';
import { MessageAttachmentsDisplay } from '../attachments-display';
import MessageText from './message-text';
import CWBp from '../../util/chat-window-breakpoints';
import IconButton from '@material-ui/core/IconButton';
import useMenu from '../../hooks/use-menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { ListItemText } from '@material-ui/core';


function RealUserMessage({ msg, isMentioned }) {
  const dispatch = useDispatch();
  const styles = useStyles();
  const [isHovered, setIsHovered] = useState(false);
  const { id: currentUserId } = useSelector(state => state.account.userData);
  const { send } = useWs();

  const { user, createdAt, isUpdated, text, attachments, mentionedCount } = msg;

  const { startEditing, reply, slotData: { size } } = useChatWindow();
  const { buttonProps, menuProps, closeMenu } = useMenu();

  const isSmall = size.eq(CWBp.names.small, CWBp.axis.hor);
  const shouldShorten = size.lt(CWBp.names.large, CWBp.axis.hor);

  const isFromCurrentUser = user.id === currentUserId;
  const messageMenuOptions = [
    {
      title: 'Reply',
      onClick: e => {
        e.stopPropagation();
        closeMenu();
        reply(msg);
      },
      icon: <Reply />,
      className: styles.leftGap
    }
  ];
  if (isFromCurrentUser) {
    messageMenuOptions.unshift(
      {
        title: 'Edit',
        onClick: e => {
          e.stopPropagation();
          closeMenu();
          startEditing(msg);
        },
        icon: <Edit />
      },
      {
        title: 'Delete',
        onClick: e => {
          e.stopPropagation();
          closeMenu();
          dispatch(pushModal({
            body:
              <ConfirmModal
                onConfirm={() => send(WS_ENDPOINTS.messages.remove, msg.id)}
                bodyText='Are you sure you want to delete this message?'
                confirmText='Delete'
              />
          }))
        },
        icon: <Delete />
      }
    );
  }

  const messageMenuDisplay = isSmall && isFromCurrentUser
    ? <React.Fragment>
      <IconButton {...buttonProps} className={styles.leftGap}>
        <MoreVert />
      </IconButton>
      <Menu {...menuProps}>
        {
          messageMenuOptions.map(opt =>
            <MenuItem key={opt.title} onClick={opt.onClick} className={styles.messageOptionItem}>
              {opt.icon}
              <ListItemText className={styles.leftGap}>{opt.title}</ListItemText>
            </MenuItem>
          )
        }
      </Menu>
    </React.Fragment>
    : messageMenuOptions.map((opt, idx) =>
      <HintButton
        key={opt.title}
        title={opt.title}
        buttonProps={{
          onClick: opt.onClick,
          className: clsx(opt.className, !idx && styles.leftGap)
        }}
      >
        {opt.icon}
      </HintButton>
    );

  return (
    <div
      className={clsx(
        styles.message,
        isMentioned && styles.mentionedMessage,
        size.lt(CWBp.names.large, CWBp.axis.hor) && styles.wideBodyMessage
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

      <Box className={styles.messageBodyColumn}>
        <div className={styles.messageHeaderBlock}>
          <Box width={`calc(100% - ${!isFromCurrentUser || isSmall ? 20 : 64}px)`}>
            <Typography>{shouldShorten ? `${user.firstName[0]}.` : user.firstName} {user.lastName}</Typography>
            <Typography className={styles.leftGap} color='textSecondary'>
              {zDate(createdAt).fTime()}{isUpdated ? ' (Ed.)' : ''}
            </Typography>
          </Box>

          {isHovered && !isMentioned && <div>{messageMenuDisplay}</div>}
        </div>

        <MessageText text={text} />
        <MessageAttachmentsDisplay allAttachments={attachments.filter(att => att.isDirect)} />
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
      file: oneOfType([string, object]).isRequired,
      id: number.isRequired
    })).isRequired,
    mentionedCount: number
  }).isRequired,
  isMentioned: bool
};

RealUserMessage.defaultProps = {
  isMentioned: false
};

export default RealUserMessage;