import React from 'react';
import { arrayOf, object } from 'prop-types';
import DisplayOneYoutube from '../common/display-youtube';
import { YOUTUBE_PREVIEW_SIZE } from '../../../util/constants';
import useChatWindow from '../../../hooks/use-chat-window';
import CWBp from '../../../util/chat-window-breakpoints';
import ImageList from '@material-ui/core/ImageList';
import { ImageListItem, ImageListItemBar } from '@material-ui/core';
import CenterBox from '../../center-box';
import { formatYouTubeDuration } from '../../../util/misc';
import clsx from 'clsx';


function DisplayYoutube({ fittingAttachments, specificStyles }) {
  const { slotData: { size }, chatData } = useChatWindow();
  const isNotLarge = size.lt(CWBp.names.large, CWBp.axis.hor);
  const previewSizes = isNotLarge
    ? { 1: YOUTUBE_PREVIEW_SIZE.default, 2: YOUTUBE_PREVIEW_SIZE.medium }
    : { 1: YOUTUBE_PREVIEW_SIZE.medium, 2: YOUTUBE_PREVIEW_SIZE.high };

  return (
    <ImageList cols={2}>
      {
        fittingAttachments.map((att, idx) => {
          const alwaysWide = idx % 3 === 0;
          const lastInList = (idx - 1) % 3 === 0 && idx === fittingAttachments.length - 1;
          const cols = alwaysWide || lastInList ? 2 : 1;
          const theSize = previewSizes[cols];
          const previewData = att.file.preview[theSize];

          return (
            <ImageListItem key={att.id} cols={cols} style={{ height: previewData.height }}>
              <CenterBox className={specificStyles.bgFiller}>
                <DisplayOneYoutube
                  url={att.file}
                  previewSize={theSize}
                  specificStyles={specificStyles}
                  chatData={chatData}
                  id={att.id}
                />
              </CenterBox>
              <ImageListItemBar
                title={att.file.title}
                className={clsx(
                  specificStyles.infoBar,
                  isNotLarge && cols === 1 && specificStyles.infoBarTiny
                )}
                subtitle={formatYouTubeDuration(att.file.duration)}
              />
            </ImageListItem>
          );
        })
      }
    </ImageList>
  );
}

DisplayYoutube.propTypes = {
  fittingAttachments: arrayOf(object).isRequired,
  specificStyles: object.isRequired
};

export default DisplayYoutube;