import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useLocation } from 'react-router-dom';
import CenterBox from '../../components/center-box';

const EMAIL_TYPE_MAPPING = {
  verify: 'verify your account',
  username: 'confirm username reset',
  password: 'confirm password reset'
};

function EmailSent() {

  const { pathname } = useLocation();
  const process = EMAIL_TYPE_MAPPING[pathname.split('/')[2]];

  return (
    <CenterBox>
      <Typography variant='body1' align='center'>
        An email is sent to the address you've provided. Please follow the link in it to {process}
      </Typography>
    </CenterBox>
  );
}

export default EmailSent;