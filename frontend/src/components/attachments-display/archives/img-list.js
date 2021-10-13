import React from 'react';
import { arrayOf, number, shape, string, func } from 'prop-types';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import useCommonStyles from '../../../theme/common';


function ImgList({ data, setCurrentId }) {
  const commonStyles = useCommonStyles();

  return (
    <ImageList cols={4} rowHeight={120} gap={16}>
      {
        data.map(item =>
          <ImageListItem
            className={commonStyles.pointer}
            key={item.id}
            onClick={() => setCurrentId(item.id)}
          >
            <img src={item.file} alt='preview'/>
          </ImageListItem>
        )
      }
    </ImageList>
  );
}

ImgList.propTypes = {
  data: arrayOf(shape({
    id: number.isRequired,
    file: string.isRequired
  })),
  setCurrentId: func.isRequired
};

export default ImgList;