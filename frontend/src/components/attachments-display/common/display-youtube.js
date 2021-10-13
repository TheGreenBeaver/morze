import React from 'react';
import { func, number, object, oneOf, shape, string } from 'prop-types';
import { FILE_TYPES, YOUTUBE_PREVIEW_SIZE } from '../../../util/constants';
import { useDispatch } from 'react-redux';
import { pushModal } from '../../../store/actions/general';
import YoutubeModal from '../../modals/youtube-modal';
import Box from '@material-ui/core/Box';
import { Cancel, PlayArrow } from '@material-ui/icons';
import Chip from '@material-ui/core/Chip';
import { formatYouTubeDuration, getChatArchives } from '../../../util/misc';
import IconButton from '@material-ui/core/IconButton';
import ArchivesModal from '../../modals/archives-modal';


function DisplayYoutube({ onRemove, url: ytData, previewSize, specificStyles, commonStyles, chatData, id }) {
  const dispatch = useDispatch();
  const previewData = ytData.preview[previewSize];

  const isInInput = !!onRemove;

  return (
    <Box
      position='relative'
      width={previewData.width}
      height={previewData.height}
      onClick={e => {
        e.stopPropagation();
        dispatch(pushModal({
          title: isInInput
            ? ''
            : 'Chat Archives',
          body: isInInput
            ? <YoutubeModal player={ytData.player} />
            : <ArchivesModal
              archives={getChatArchives(chatData)}
              initial={{ type: FILE_TYPES.youtube, id }}
            />
        }));
      }}
      className={commonStyles?.pointer}
    >
      {
        isInInput &&
        <IconButton
          className={commonStyles.removeBtn}
          onClick={onRemove}
          color='secondary'
        >
          <Cancel />
        </IconButton>
      }
      <img src={previewData.url} alt='videoPreview' />
      <PlayArrow
        className={specificStyles.playCircle}
        style={{ fontSize: previewData.height * 0.35 }}
      />
      {
        isInInput &&
        <Chip
          label={formatYouTubeDuration(ytData.duration)}
          className={specificStyles.durationChip}
        />
      }
    </Box>
  );
}

DisplayYoutube.propTypes = {
  url: shape({
    player: shape({
      embedHtml: string.isRequired
    }).isRequired,
    preview: object.isRequired
  }).isRequired,
  onRemove: func,
  previewSize: oneOf([...Object.values(YOUTUBE_PREVIEW_SIZE)]),
  specificStyles: object.isRequired,
  commonStyles: object,
  chatData: object,
  id: number
};

DisplayYoutube.defaultProps = {
  previewSize: YOUTUBE_PREVIEW_SIZE.default
};

export default DisplayYoutube;