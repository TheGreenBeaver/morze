import React from 'react';
import { any, bool, node } from 'prop-types';
import { Form, Formik } from 'formik';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import useCommonStyles from '../../theme/common';


function EditableViewWrapper({ children, isEditable, extraActions, onSubmit, initialValues, validationSchema }) {
  const commonStyles = useCommonStyles();

  return (
    <Formik
      initialStatus={{ isEditing: false }}
      onSubmit={(values, formikHelpers) => {
        formikHelpers.setSubmitting(true);
        formikHelpers.setStatus({ isEditing: false });
        onSubmit(values, formikHelpers);
      }}
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validationSchema}
    >
      {
        formik =>
          <Form>
            <DialogContent className={commonStyles.centerVertical}>
              {children}
            </DialogContent>

            <DialogActions>
              {
                isEditable &&
                <React.Fragment>
                  {
                    formik.status.isEditing &&
                    <React.Fragment>
                      <Button
                        variant='outlined'
                        color='secondary'
                        onClick={() => {
                          formik.resetForm();
                          formik.setStatus({ isEditing: false });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type='submit'
                        color='secondary'
                      >
                        Save
                      </Button>
                    </React.Fragment>
                  }
                  {
                    !formik.status.isEditing &&
                    <Button
                      color='secondary'
                      onClick={() => formik.setStatus({ isEditing: true })}
                    >
                      Edit
                    </Button>
                  }
                </React.Fragment>
              }
              {extraActions}
            </DialogActions>
          </Form>
      }
    </Formik>
  );
}

EditableViewWrapper.propTypes = {
  children: node.isRequired,
  extraActions: node,
  isEditable: bool,
  validationSchema: any
};

export default EditableViewWrapper;