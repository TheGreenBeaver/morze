import React from 'react';
import { arrayOf, number, object, shape, string } from 'prop-types';
import { getSlices } from './util';
import DisplayOneSlice from './display-one-slice';


function DisplayImg({ fittingAttachments, specificStyles, commonStyles }) {
  const imageSlices = getSlices(fittingAttachments);

  return (
    <div>
      {
        imageSlices.map((slice, idx) => {
          const dir = idx % 2 === 0 ? DisplayOneSlice.DIRECTION.ltr : DisplayOneSlice.DIRECTION.rtl;
          return (
            <DisplayOneSlice
              key={idx}
              sliceOfImages={slice}
              specificStyles={specificStyles}
              direction={dir}
              commonStyles={commonStyles}
            />
          );
        })
      }
    </div>
  );
}

DisplayImg.propTypes = {
  fittingAttachments: arrayOf(shape({
    id: number.isRequired,
    file: string.isRequired
  })).isRequired,
  specificStyles: object.isRequired,
  commonStyles: object.isRequired
};

export default DisplayImg;