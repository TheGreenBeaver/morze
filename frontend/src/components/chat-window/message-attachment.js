import React, { useRef } from 'react';
import { useFormikContext } from 'formik';
import Box from '@material-ui/core/Box';
import useCommonStyles from '../../theme/common';
import HintButton from '../hint-button';
import { AttachFile } from '@material-ui/icons';
import { v4 as uuid } from 'uuid';
import { FILE_EXT_MAPPING, MSG_FIELD_NAMES } from '../../util/constants';
import { isFileType } from '../../util/misc';


function MessageAttachment() {
  const rawDataField = MSG_FIELD_NAMES.attachments;
  const parsedDataField = MSG_FIELD_NAMES.asDataUrls;

  const { values, setFieldValue } = useFormikContext();
  const styles = useCommonStyles();
  const inputRef = useRef(null);

  return (
    <Box>
      <HintButton
        title='Attach files'
        buttonProps={{
          onClick: () => {
            inputRef.current.click();
          },
          color: 'secondary'
        }}
      >
        <AttachFile />
      </HintButton>
      <input
        type='file'
        className={styles.hiddenInput}
        ref={inputRef}
        multiple
        onChange={({ target: { files} }) => {
          const valueUpd = [];
          const dataUrlsUpd = [];
          let unreadAmount = files.length;
          for (const file of files) {
            const extFits = Object.keys(FILE_EXT_MAPPING).map(ext => isFileType(ext, file)).some(isExt => isExt);
            if (!extFits) {
              continue;
            }
            if (isFileType('img', file)) {
              const fr = new FileReader();
              fr.onload = loadEv => {
                const fId = uuid();
                valueUpd.push({ file, fId });
                dataUrlsUpd.push({ fId, url: loadEv.target.result });
                if (--unreadAmount === 0) {
                  setFieldValue(rawDataField, [...values[rawDataField], ...valueUpd]);
                  setFieldValue(parsedDataField, [...values[parsedDataField], ...dataUrlsUpd]);
                }
              }
              fr.readAsDataURL(file);
            } else {
              const fId = uuid();
              valueUpd.push({ file, fId });
              const url = URL.createObjectURL(file);
              dataUrlsUpd.push({ fId, url });
              if (--unreadAmount === 0) {
                setFieldValue(rawDataField, [...values[rawDataField], ...valueUpd]);
                setFieldValue(parsedDataField, [...values[parsedDataField], ...dataUrlsUpd]);
              }
            }
          }
        }}
      />
    </Box>
  );
}

export default MessageAttachment;