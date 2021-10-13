import React from 'react';
import { arrayOf, number, object, shape, string, func } from 'prop-types';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import { YOUTUBE_PREVIEW_SIZE } from '../../../util/constants';
import useCommonStyles from '../../../theme/common';
import useStyles from '../common/styles/display-youtube.styles';
import { formatYouTubeDuration } from '../../../util/misc';
import { PlayArrow } from '@material-ui/icons';
import CenterBox from '../../center-box';


function VideosList({ data, setCurrentId }) {
  const commonStyles = useCommonStyles();
  const videoStyles = useStyles();
  return (
    <ImageList cols={2} rowHeight={180} gap={12}>
      {
        data.map(item => {
          const { url, height } = item.file.preview[YOUTUBE_PREVIEW_SIZE.medium];

          return (
            <ImageListItem
              className={commonStyles.pointer}
              key={item.id}
              onClick={() => setCurrentId(item.id)}
            >
              <CenterBox position='relative' width='100%' height='100%'>
                <img src={url} alt='preview' height='100%' />
                <PlayArrow
                  className={videoStyles.playCircle}
                  style={{ fontSize: height * 0.35 }}
                />
              </CenterBox>
              <ImageListItemBar
                title={item.file.title}
                subtitle={formatYouTubeDuration(item.file.duration)}
                className={videoStyles.infoBar}
              />
            </ImageListItem>
          );
        })
      }
    </ImageList>
  );
}

VideosList.propTypes = {
  data: arrayOf(shape({
    id: number.isRequired,
    file: shape({
      title: string.isRequired,
      preview: object.isRequired,
      duration: string.isRequired
    }).isRequired
  })).isRequired,
  setCurrentId: func.isRequired
};

export default VideosList;