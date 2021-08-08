import React from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';
import { signIn } from '../../api/auth';
import { useDispatch } from 'react-redux';
import { signInAction } from '../../store/actions/account';
import PasswordField from '../../components/password-field';
import Button from '@material-ui/core/Button';
import StyledLink from '../../components/styled-link';
import useErrorHandler from '../../hooks/use-error-handler';
import useFormStyles from '../../theme/form';


function SignIn() {
  const dispatch = useDispatch();
  const handleBackendError = useErrorHandler();

  const styles = useFormStyles();

  function onSubmit(values, formikHelpers) {
    formikHelpers.setSubmitting(true);
    signIn(values)
      .then(data => dispatch(signInAction(data.token)))
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

        <Button type='submit' color='primary' classes={{ root: styles.submitBtn }}>
          Sign In
        </Button>
        <StyledLink to='/sign_up' classes={{ root: styles.redirect }}>
          Don't have an account yet
        </StyledLink>
      </Form>
    </Formik>
  );
}

export default SignIn;