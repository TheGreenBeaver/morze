import React from 'react';
import Box from '@material-ui/core/Box';
import useStyles from './styles/attachments-display.styles';
import useDocStyles from '../common/styles/display-doc.styles';
import useYouTubeStyles from '../common/styles/display-youtube.styles';
import { FILE_TYPES } from '../../../util/constants';
import DisplayImg from './display-img';
import DisplayDoc from '../common/display-doc';
import useChatWindow from '../../../hooks/use-chat-window';
import DisplayYoutube from '../common/display-youtube';
import { getOriginalFileName } from '../../../util/misc';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import useCommonStyles from '../../../theme/common';


const EXT_DISPLAY = {
  [FILE_TYPES.img]: DisplayImg,
  [FILE_TYPES.doc]: DisplayDoc,
  [FILE_TYPES.youtube]: DisplayYoutube
};

const EXT_TITLE = {
  [FILE_TYPES.img]: 'Images',
  [FILE_TYPES.doc]: 'Documents',
  [FILE_TYPES.youtube]: 'Videos'
};

function AttachmentsDisplay() {
  const { removeAttachment, attachmentsValues, attachmentsDisplay } = useChatWindow();

  const commonStyles = { ...useStyles(), ...useCommonStyles() };
  const specificStyles = {
    [FILE_TYPES.doc]: useDocStyles(),
    [FILE_TYPES.youtube]: useYouTubeStyles()
  };

  return Object.keys(FILE_TYPES).map(ext => {
    const fittingIds = attachmentsValues.filter(({ type }) => ext === type).map(d => d.fId);
    const fittingData = attachmentsDisplay.filter(data => fittingIds.includes(data.fId));

    return !!fittingData.length &&
      <React.Fragment key={ext}>
        <Typography
          className={commonStyles.inputAreaHorizontalAlign}
          variant='subtitle1'
          color='textSecondary'
        >
          Attached {EXT_TITLE[ext]}
        </Typography>
        <Box
          className={clsx(
            commonStyles.wrapper,
            commonStyles.inputAreaHorizontalAlign,
            commonStyles[`${ext}Height`]
          )}
        >
          {
            fittingData.map(({ url, fId }) => {
              const onRemove = e => {
                e.stopPropagation();
                removeAttachment(fId);
              };
              const originalName = ext === FILE_TYPES.doc
                ? getOriginalFileName(attachmentsValues.find(att => att.fId === fId).file)
                : null;
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
        </Box>
      </React.Fragment>;
  });
}

export default AttachmentsDisplay;