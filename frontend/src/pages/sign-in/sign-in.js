import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';
import PasswordField from '../../components/password-field';
import StyledLink from '../../components/styled-link';
import useFormStyles from '../../theme/form';
import useAuth from '../../hooks/use-auth';
import { useAxios } from '../../contexts/axios-context';
import { ERR_FIELD, HTTP_ENDPOINTS } from '../../util/constants';
import LoadingButton from '../../components/loading-button';
import ErrorPrompt from '../../components/error-prompt';


function SignIn() {
  const { saveCredentials } = useAuth();
  const { api } = useAxios();
  const [credentialsError, setCredentialsError] = useState(null);

  const styles = useFormStyles();

  function onSubmit(values, formikHelpers) {
    setCredentialsError(null);
    formikHelpers.setSubmitting(true);
    api(HTTP_ENDPOINTS.signIn, values).call()
      .then(data => saveCredentials(data.token))
      .catch(e => {
        formikHelpers.setSubmitting(false);
        setCredentialsError(e.response.data[ERR_FIELD][0]);
      });
  }

  return (
    <Formik
      initialValues={{
        username: '',
        password: ''
      }}
      onSubmit={onSubmit}
      validationSchema={Yup.object({
        username: Yup.string().required('Please enter your username'),
        password: Yup.string().required('Please enter your password')
      })}
    >
      <Form>
        <Field
          component={TextField}
          name='username'
          label='Username'
          autoComplete='username'
        />
        <PasswordField />

        <LoadingButton classes={{ root: styles.submitBtn }}>
          Sign In
        </LoadingButton>
        <ErrorPrompt text={credentialsError} />
        <StyledLink to='/sign_up' classes={{ root: styles.redirect }}>
          Don't have an account yet
        </StyledLink>
      </Form>
    </Formik>
  );
}

export default SignIn;