import React from 'react';
import { useFormikContext } from 'formik';
import Box from '@material-ui/core/Box';
import useStyles from './styles/attachment-display.styles';
import { default as useDocStyles } from './styles/display-doc.styles';
import { isFileType } from '../../util/misc';
import { FILE_EXT_MAPPING, MSG_FIELD_NAMES } from '../../util/constants';
import DisplayImg from './display-img';
import DisplayDoc from './display-doc';


const EXT_DISPLAY = {
  img: DisplayImg,
  doc: DisplayDoc
};

function AttachmentsDisplay() {
  const { values, setFieldValue } = useFormikContext();

  const actualField = MSG_FIELD_NAMES.attachments;
  const parsedField = MSG_FIELD_NAMES.asDataUrls;

  const actualAttachments = values[actualField];
  const parsedAttachments = values[parsedField];

  const commonStyles = useStyles();
  const specificStyles = {
    doc: useDocStyles()
  };

  return Object.keys(FILE_EXT_MAPPING).map(ext => {
    const fittingIds = actualAttachments.filter(({ file }) => isFileType(ext, file)).map(d => d.fId);
    const fittingData = parsedAttachments.filter(data => fittingIds.includes(data.fId));

    return !!fittingData.length &&
      <Box className={commonStyles.wrapper} key={ext}>
        {
          fittingData.map(({ url, fId }) => {
            const onRemove = e => {
              e.stopPropagation();
              setFieldValue(parsedField, parsedAttachments.filter(v => v.fId !== fId));
              setFieldValue(actualField, actualAttachments.filter(v => v.fId !== fId));
            };
            const originalName = actualAttachments.find(att => att.fId === fId).file.name;
            const Component = EXT_DISPLAY[ext];
            return (
              <Component
                key={fId}
                url={url}
                originalName={originalName}
                commonStyles={commonStyles}
                onRemove={onRemove}
                specificStyles={specificStyles[ext]}
              />
            );
          })
        }
      </Box>;
  });
}

export default AttachmentsDisplay;