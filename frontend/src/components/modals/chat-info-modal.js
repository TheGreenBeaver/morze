import React, { useState } from 'react';
import { arrayOf, bool, number, object, shape, string } from 'prop-types';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import UserItem from '../items/user-item';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { useAxios } from '../../contexts/axios-context';
import { HTTP_ENDPOINTS, WS_ENDPOINTS } from '../../util/constants';
import { useDispatch } from 'react-redux';
import { Add, Block } from '@material-ui/icons';
import { compareStr } from '../../util/misc';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import { useWs } from '../../contexts/ws-context';
import { closeModal } from '../../store/actions/general';


function ChatInfoModal({ chatData, chatId }) {
  const dispatch = useDispatch();
  const [inviting, setInviting] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { api } = useAxios();
  const { send } = useWs();

  return (
    <DialogContent>
      <Typography variant='h5' gutterBottom>{chatData.name}</Typography>
      <Typography variant='h6'>Members</Typography>
      <List disablePadding>
        {
          chatData.users.map(u =>
            <ListItem key={u.id}>
              <UserItem data={u} dispatch={dispatch} />
            </ListItem>
          )
        }
      </List>
      <Box display='flex' gridColumnGap={8} marginBottom={1}>
        <Button
          color='secondary'
          onClick={() => setInviting(curr => !curr)}
          variant='text'
          startIcon={inviting ? <Block/> : <Add />}
          style={{ marginLeft: 10 }}
          size='small'
        >
          {inviting ? 'Cancel' : 'Invite users'}
        </Button>

        {
          inviting &&
          <Button
            color='secondary'
            size='small'
            onClick={() => {
              send(
                WS_ENDPOINTS.chats.invite, {
                  invited: selectedUsers.map(u => u.id),
                  chat: chatId
                });
              dispatch(closeModal());
            }}
            disabled={!selectedUsers.length}
          >
            Invite
          </Button>
        }
      </Box>
      {
        inviting &&
        <Autocomplete
          renderInput={props => <TextField {...props} />}
          options={userOptions}
          renderOption={opt => <UserItem isClickable={false} data={opt} dispatch={dispatch} />}
          getOptionLabel={opt => `${opt.firstName} ${opt.lastName}`}
          filterOptions={(options, state) => options.filter(opt =>
            compareStr(opt.firstName, state.inputValue) ||
            compareStr(opt.lastName, state.inputValue) ||
            compareStr(opt.username, state.inputValue) ||
            compareStr(`${opt.firstName} ${opt.lastName}`, state.inputValue)
          )}
          onOpen={() => {
            setLoading(true);
            api(HTTP_ENDPOINTS.listUsers).call()
              .then(data => setUserOptions(data))
              .catch(console.log)
              .finally(() => setLoading(false));
          }}
          multiple
          renderTags={(value, getTagProps) => value.map(selOpt =>
            <Chip
              avatar={<Avatar src={selOpt.avatar} />}
              label={`${selOpt.firstName} ${selOpt.lastName}`}
              {...getTagProps(selOpt)}
            />
          )}
          style={{ marginLeft: 8 }}
          loadingText='Loading options...'
          loading={loading}
          value={selectedUsers}
          onChange={(e, value) => setSelectedUsers(value)}
          disableCloseOnSelect
        />
      }
    </DialogContent>
  );
}

ChatInfoModal.propTypes = {
  chatData: shape({
    users: arrayOf(object).isRequired,
    name: string.isRequired,
    isAdmin: bool.isRequired
  }).isRequired,
  chatId: number.isRequired
};

export default ChatInfoModal;