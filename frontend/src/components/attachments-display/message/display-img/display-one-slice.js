/* eslint-disable default-case */
import React from 'react';
import { arrayOf, number, object, oneOf, shape, string } from 'prop-types';
import { useDispatch } from 'react-redux';
import { useTheme } from '@material-ui/core';
import useChatWindow from '../../../../hooks/use-chat-window';
import CWBp from '../../../../util/chat-window-breakpoints';
import { pushModal } from '../../../../store/actions/general';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import AutoSizeImg from '../../../auto-size-img';
import ArchivesModal from '../../../modals/archives-modal';
import { FILE_TYPES } from '../../../../util/constants';
import { getChatArchives } from '../../../../util/misc';


const DIRECTION = {
  ltr: 'Ltr',
  rtl: 'Rtl',
};

function DisplayOneSlice({ sliceOfImages, specificStyles, direction, commonStyles }) {
  const dispatch = useDispatch();
  const theme = useTheme();

  const amount = sliceOfImages.length;
  const { slotData: { size }, chatData } = useChatWindow();

  const sizeIsSmall = size.eq(CWBp.names.small, CWBp.axis.hor);

  function onClick(e, att) {
    e.stopPropagation();
    dispatch(pushModal({
      body:
        <ArchivesModal
          initial={{ id: att.id, type: FILE_TYPES.img }}
          archives={getChatArchives(chatData)}
        />,
      title: 'Chat Archives'
    }));
  }

  const messageWidth = Math.min(
    600,
    size.width - theme.spacing(3) * 2 - theme.spacing(2)
  );
  const availableWidth =
    messageWidth - 40 - theme.spacing(2) * 2 - theme.spacing(size.eq(CWBp.names.large, CWBp.axis.hor) ? 7 : 2);

  let mainBoxHeight = availableWidth;
  let mainBoxClass;
  const imageClasses = [...Array(6)].map((_, idx) => specificStyles[`gridImg${idx + 1}`]);
  switch (amount) {
    case 1:
      mainBoxHeight *= 0.67;
      break;
    case 2:
      mainBoxHeight = sizeIsSmall
        ? availableWidth + theme.spacing(1)
        : availableWidth * 0.5;
      mainBoxClass = clsx(
        specificStyles.twoImagesBox,
        sizeIsSmall ? specificStyles.twoImagesBoxVert : specificStyles.twoImagesBoxHor
      );
      break;
    case 3:
      mainBoxHeight *= 0.67;
      mainBoxClass = specificStyles[`threeImagesBox${direction}`];
      break;
    case 4:
      mainBoxClass = clsx(
        specificStyles.moreThanThreeBox,
        specificStyles[`fourImagesBox${direction}`]
      );
      break;
    case 5:
      mainBoxClass = clsx(
        specificStyles.moreThanThreeBox,
        specificStyles[`fiveImagesBox${direction}`]
      );
      break;
    case 6:
      mainBoxClass = clsx(
        specificStyles.moreThanThreeBox,
        specificStyles[`sixImagesBox${direction}`]
      );
  }

  return (
    <Box
      width='100%'
      height={mainBoxHeight}
      className={clsx(mainBoxClass, commonStyles.verticalDistribution)}
    >
      {
        sliceOfImages.map((att, idx) =>
          <AutoSizeImg
            key={idx}
            src={att.file}
            className={imageClasses[idx]}
            onClick={e => onClick(e, att)}
            height='100%'
            width='100%'
            stretch
          />
        )
      }
    </Box>
  );
}

DisplayOneSlice.DIRECTION = DIRECTION;

DisplayOneSlice.propTypes = {
  sliceOfImages: arrayOf(shape({
    id: number.isRequired,
    file: string.isRequired
  })).isRequired,
  specificStyles: object.isRequired,
  direction: oneOf([...Object.values(DIRECTION)]).isRequired
};

export default DisplayOneSlice;