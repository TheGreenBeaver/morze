import React from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import PasswordField from '../../components/password-field';
import Button from '@material-ui/core/Button';
import StyledLink from '../../components/styled-link';
import useFormStyles from '../../theme/form';
import { signUp } from '../../api/auth';
import useErrorHandler from '../../hooks/use-error-handler';
import { useSnackbar } from 'notistack';
import useAuth from '../../hooks/use-auth';


const FIELDS = [
  'firstName',
  'lastName',
  'username',
  { field: 'email', max: 255 },
  { field: 'password', max: 100 }
];
const DEFAULT_MAX_LEN = 50;
const yupConfig = FIELDS.reduce((config, field) => ({
  ...config,
  [field.field || field]: Yup.string().required(`${field.field || field} is required`).max(field.max || DEFAULT_MAX_LEN)
}), {});

function SignUp() {
  const styles = useFormStyles();
  const handleBackendError = useErrorHandler();
  const { enqueueSnackbar } = useSnackbar();
  const { saveCredentials } = useAuth();

  function onSubmit(values, formikHelpers) {
    formikHelpers.setSubmitting(true);
    signUp(values)
      .then(data => {
        enqueueSnackbar('Signed up for Morze successfully!');
        saveCredentials(data.token);
      })
      .catch(e => {
        formikHelpers.setSubmitting(false);
        if (!handleBackendError(e)) {
          formikHelpers.setErrors(e.response.data);
        }
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
        <Button type='submit' color='primary' classes={{ root: styles.submitBtn }}>
          Sign In
        </Button>
        <StyledLink to='/sign_in' classes={{ root: styles.redirect }}>
          Already have an account
        </StyledLink>
      </Form>
    </Formik>
  );
}

export default SignUp;