import React from 'react';
import Box from '@material-ui/core/Box';
import useStyles from './styles/attachment-display.styles';
import { default as useDocStyles } from './styles/display-doc.styles';
import { FILE_TYPES } from '../../util/constants';
import DisplayImg from './display-img';
import DisplayDoc from './display-doc';
import useChatWindow from '../../hooks/use-chat-window';
import DisplayYoutube from './display-youtube';


const EXT_DISPLAY = {
  [FILE_TYPES.img]: DisplayImg,
  [FILE_TYPES.doc]: DisplayDoc,
  [FILE_TYPES.youtube]: DisplayYoutube
};

function AttachmentsDisplay() {
  const { removeAttachment, attachmentsValues, attachmentsDisplay } = useChatWindow();

  const commonStyles = useStyles();
  const specificStyles = {
    doc: useDocStyles()
  };

  return Object.keys(FILE_TYPES).map(ext => {
    const fittingIds = attachmentsValues.filter(({ type }) => ext === type).map(d => d.fId);
    const fittingData = attachmentsDisplay.filter(data => fittingIds.includes(data.fId));

    return !!fittingData.length &&
      <Box className={commonStyles.wrapper} key={ext}>
        {
          fittingData.map(({ url, fId }) => {
            const onRemove = e => {
              e.stopPropagation();
              removeAttachment(fId);
            };
            const originalName = attachmentsValues.find(att => att.fId === fId).file.name;
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