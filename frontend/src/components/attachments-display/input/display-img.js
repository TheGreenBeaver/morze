import React from 'react';
import { func, object, string } from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import { Cancel } from '@material-ui/icons';
import CenterBox from '../../center-box';


function DisplayImg({ onRemove, url, commonStyles }) {
  return (
    <CenterBox
      position='relative'
      width={75}
      height={75}
      minWidth={75}
      minHeight={75}
      overflow='hidden'
    >
      <IconButton
        className={commonStyles.removeBtn}
        onClick={onRemove}
        color='secondary'
      >
        <Cancel />
      </IconButton>
      <img src={url} alt='attachment' style={{ width: '100%', height: 'auto' }} />
    </CenterBox>
  );
}

DisplayImg.propTypes = {
  onRemove: func.isRequired,
  url: string.isRequired,
  commonStyles: object.isRequired
};

export default DisplayImg;