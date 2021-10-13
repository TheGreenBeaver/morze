import React from 'react';
import { arrayOf, object } from 'prop-types';
import { FILE_TYPES } from '../../../util/constants';
import DisplayImg from './display-img/display-img';
import DisplayDoc from './display-doc';
import DisplayYoutube from './display-youtube';
import useDocStyles from '../common/styles/display-doc.styles';
import useYouTubeStyles from '../common/styles/display-youtube.styles';
import useImgStyles from './styles/display-img.styles';
import useCommonStyles from '../../../theme/common';


const EXT_DISPLAY = {
  [FILE_TYPES.img]: DisplayImg,
  [FILE_TYPES.doc]: DisplayDoc,
  [FILE_TYPES.youtube]: DisplayYoutube
};

function AttachmentsDisplay({ allAttachments }) {
  const specificStyles = {
    [FILE_TYPES.doc]: useDocStyles(),
    [FILE_TYPES.img]: useImgStyles(),
    [FILE_TYPES.youtube]: useYouTubeStyles()
  };
  const commonStyles = useCommonStyles();

  const attachmentsDisplay = Object.keys(FILE_TYPES).map(fType => {
    const fittingAttachments = allAttachments.filter(att => att.type === fType);

    const Component = EXT_DISPLAY[fType];

    if (!fittingAttachments.length) {
      return null;
    }

    return (
      <div className={commonStyles.verticalDistribution} key={fType}>
        <Component
          key={fType}
          fittingAttachments={fittingAttachments}
          specificStyles={specificStyles[fType]}
          commonStyles={commonStyles}
        />
      </div>
    );
  });

  return <div>{attachmentsDisplay}</div>;
}

AttachmentsDisplay.propTypes = {
  allAttachments: arrayOf(object).isRequired
};

export default AttachmentsDisplay;