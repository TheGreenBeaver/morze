import React, { useRef, useState } from 'react';
import { bool, string } from 'prop-types';
import { useFormikContext } from 'formik';
import CenterBox from '../center-box';
import { Delete, Person, PhotoCamera, PowerOff } from '@material-ui/icons';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import useCommonStyles from '../../theme/common';
import useStyles from './styles/editable-avatar.styles';
import HintButton from '../hint-button';
import useReadFiles from '../../hooks/use-read-files';
import { FILE_TYPES } from '../../util/constants';


function EditableAvatar({ name, otherName, isActive, removeName }) {

  const { status, isSubmitting, getFieldProps, setFieldValue } = useFormikContext();

  const commonStyles = useCommonStyles();
  const styles = useStyles();
  const inputRef = useRef(null);

  const isEditing = status?.isEditing;
  const available = isEditing && !isSubmitting;

  const actualField = getFieldProps(name);
  const displayField = getFieldProps(otherName);
  const removeField = getFieldProps(removeName);

  const [showAvatarHint, setShowAvatarHint] = useState(false);

  const readFiles = useReadFiles();

  return (
    <React.Fragment>
      <Box
        position='relative'
        borderRadius='50%'
        width={100}
        className={styles.wrapper}
        style={{ cursor: available ? 'pointer' : 'default' }}
        onMouseOver={() => {
          if (available) {
            setShowAvatarHint(true);
          }
        }}
        onMouseLeave={() => {
          if (available) {
            setShowAvatarHint(false);
          }
        }}
        onClick={() => {
          if (available) {
            inputRef.current.click();
          }
        }}
      >
        {
          showAvatarHint &&
          <CenterBox className={styles.avatarHint}>
            <PhotoCamera />
          </CenterBox>
        }
        <Avatar
          src={actualField.value instanceof File ? displayField.value : actualField.value}
          className={styles.avatar}
        >
          {isActive ? <Person /> : <PowerOff />}
        </Avatar>
        {
          isEditing &&
          <input
            type='file'
            multiple={false}
            ref={inputRef}
            className={commonStyles.hiddenInput}
            onChange={e => {
              const file = e.target.files[0];
              if (file) {
                readFiles(
                  [file],
                  ({ valueUpd, displayUpd }) => {
                    setFieldValue(otherName, displayUpd[0].url);
                    setFieldValue(name, valueUpd[0].file);
                    setFieldValue(removeName, false);
                  },
                  [FILE_TYPES.img]
                )
              }
            }}
          />
        }

        {
          isEditing && !removeField.value &&
          <HintButton
            title='Remove avatar'
            buttonProps={{
              onClick: e => {
                e.stopPropagation();
                setFieldValue(removeName, true);
                setFieldValue(name, null);
                setFieldValue(otherName, '');
              },
              onMouseOver: e => e.stopPropagation(),
              className: styles.removeBtn
            }}
          >
            <Delete />
          </HintButton>
        }
      </Box>
    </React.Fragment>
  );
}

EditableAvatar.propTypes = {
  name: string.isRequired,
  otherName: string.isRequired,
  removeName: string.isRequired,
  isActive: bool
};

export default EditableAvatar;