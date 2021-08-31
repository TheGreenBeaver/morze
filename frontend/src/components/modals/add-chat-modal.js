import React, { useState } from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import { useWs } from '../../contexts/ws-context';
import { HTTP_ENDPOINTS, WS_ENDPOINTS } from '../../util/constants';
import AutocompleteField from '../autocomplete-field';
import { useAxios } from '../../contexts/axios-context';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import useStyles from './styles/add-chat-modal.styles';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../store/actions/general';


function AddChatModal() {
  const { send } = useWs();
  const { api } = useAxios();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const styles = useStyles();
  const dispatch = useDispatch();

  function onOpen() {
    setIsLoading(true);
    api(HTTP_ENDPOINTS.listUsers).call()
      .then(data => {
        setUsers(data.map(u => ({ label: `${u.firstName} ${u.lastName}`, value: u.id })));
        setIsLoading(false);
      });
  }

  return (
    <Formik
      initialValues={{
        invited: [],
        name: ''
      }}
      onSubmit={values => {
        send(WS_ENDPOINTS.chats.create, { ...values, invited: values.invited.map(u => u.value) });
        dispatch(closeModal());
      }}
      validationSchema={Yup.object({
        name: Yup.string().max(50)
      })}
    >
      <Form className={styles.form}>
        <DialogContent className={styles.content}>
          <Field
            component={TextField}
            name='name'
            label='Name'
          />
          <AutocompleteField
            name='invited'
            options={users}
            onOpen={onOpen}
            loading={isLoading}
            label='Invite Users'
          />
        </DialogContent>
        <DialogActions>
          <Button type='submit'>Create</Button>
        </DialogActions>
      </Form>
    </Formik>
  );
}

export default AddChatModal;