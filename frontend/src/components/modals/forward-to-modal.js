import React, { useState } from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../store/actions/general';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { func } from 'prop-types';
import ListItemText from '@material-ui/core/ListItemText';


function ForwardToModal({ forwardToChat, clearSelectedMessages }) {
  const dispatch = useDispatch();
  const allChats = useSelector(state => state.chats);

  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <React.Fragment>
      <DialogContent>
        <List disablePadding>
          {
            Object.values(allChats).map(chat =>
              <ListItem
                button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                selected={selectedChat === chat.id}
              >
                <ListItemText>{chat.name}</ListItemText>
              </ListItem>
            )
          }
        </List>
      </DialogContent>
      <DialogActions>
        <Button
          variant='outlined'
          color='secondary'
          onClick={() => {
            clearSelectedMessages();
            dispatch(closeModal());
          }}
        >
          Cancel
        </Button>
        <Button
          color='secondary'
          disabled={selectedChat == null}
          onClick={() => {
            forwardToChat(selectedChat);
            dispatch(closeModal());
          }}
        >
          Forward
        </Button>
      </DialogActions>
    </React.Fragment>

  );
}

ForwardToModal.propTypes = {
  clearSelectedMessages: func.isRequired,
  forwardToChat: func.isRequired
};

export default ForwardToModal;