import React, { useState } from 'react';
import { number } from 'prop-types';
import { useSelector } from 'react-redux';
import { isFileType } from '../../util/misc';
import useStyles from './styles/images-modal.styles';
import Box from '@material-ui/core/Box';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import clsx from 'clsx';
import CenterBox from '../center-box';
import IconButton from '@material-ui/core/IconButton';


function ImagesModal({ chatId, initialImageId }) {
  const allChats = useSelector(state => state.chats);
  const chatData = allChats[chatId];
  const allImages = chatData.messages
    .map(msg =>
      msg.attachments.filter(({ file }) => isFileType('img', file))
    )
    .flat();

  function countIdx(id) {
    return allImages.findIndex(imageData => imageData.id === id);
  }

  const [imageIdx, setImageIdx] = useState(countIdx(initialImageId));
  const styles = useStyles();

  if (imageIdx === -1) {
    return (
      <div className={styles.allImagesGrid}>
        {
          allImages.map(imageData =>
            <CenterBox
              key={imageData.id}
              height={100}
              width={100}
              onClick={() => countIdx(imageData.id)}
            >
              <img
                src={imageData.file}
                alt='attachment'
                className={imageData.height > imageData.width
                  ? styles.vertical
                  : styles.horizontal
                }
              />
            </CenterBox>
          )
        }
      </div>
    );
  }

  const theImage = allImages[imageIdx];
  return (
    <Box width={500} height={500} position='relative'>
      <IconButton
        title='Previous'
        onClick={() => {
          setImageIdx(curr => Math.max(0, curr - 1));
        }}
        disabled={imageIdx === 0}
        className={clsx(styles.navBtn, styles.btnBack)}
        color='secondary'
      >
        <ChevronLeft />
      </IconButton>
      <img
        src={theImage}
        alt='attachment'
        className={theImage.height > theImage.width
          ? styles.vertical
          : styles.horizontal
        }
      />
      <IconButton
        onClick={() => {
          setImageIdx(curr => Math.min(allImages.length - 1, curr + 1));
        }}
        disabled={imageIdx === allImages.length - 1}
        className={clsx(styles.navBtn, styles.btnNext)}
        color='secondary'
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
}

ImagesModal.propTypes = {
  chatId: number.isRequired,
  initialImageId: number
};

export default ImagesModal;