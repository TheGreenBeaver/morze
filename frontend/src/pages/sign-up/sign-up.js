import React from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import PasswordField from '../../components/password-field';
import StyledLink from '../../components/styled-link';
import useFormStyles from '../../theme/form';
import { useSnackbar } from 'notistack';
import useAuth from '../../hooks/use-auth';
import { useAxios } from '../../contexts/axios-context';
import { HTTP_ENDPOINTS } from '../../util/constants';
import LoadingButton from '../../components/loading-button';
import { startCase } from 'lodash';


const FIELDS = [
  { field: 'firstName', max: 50 },
  { field: 'lastName', max: 50 },
  { field: 'username', max: 50 },
  { field: 'email', max: 255 },
  { field: 'password', max: 100 }
];
const yupConfig = FIELDS.reduce((config, f) => ({
  ...config,
  [f.field]: Yup.string().required(`${startCase(f.field)} is required`).max(f.max)
}), {});

function SignUp() {
  const { enqueueSnackbar } = useSnackbar();
  const { saveCredentials } = useAuth();
  const { api } = useAxios();

  const styles = useFormStyles();

  function onSubmit(values, formikHelpers) {
    formikHelpers.setSubmitting(true);
    api(HTTP_ENDPOINTS.signUp, values).call()
      .then(data => {
        enqueueSnackbar('Signed up for Morze successfully!', { variant: 'success' });
        saveCredentials(data.token);
      })
      .catch(e => {
        formikHelpers.setSubmitting(false);
        formikHelpers.setErrors(e.response.data);
      });
  }

  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: ''
      }}
      validationSchema={Yup.object(yupConfig)}
      onSubmit={onSubmit}
    >
      <Form>
        <Field
          component={TextField}
          name='firstName'
          label='First Name'
          autoComplete='given-name'
        />
        <Field
          component={TextField}
          name='lastName'
          label='Last Name'
          autoComplete='family-name'
        />
        <Field
          component={TextField}
          name='username'
          label='Username'
          autoComplete='username'
        />
        <Field
          component={TextField}
          name='email'
          label='Email'
          autoComplete='email'
        />
        <PasswordField />
        <LoadingButton classes={{ root: styles.submitBtn }}>
          Sign Up
        </LoadingButton>
        <StyledLink to='/sign_in' classes={{ root: styles.redirect }}>
          Already have an account
        </StyledLink>
      </Form>
    </Formik>
  );
}

export default SignUp;