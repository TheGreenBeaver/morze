import React from 'react';
import { object, shape } from 'prop-types';
import CenterBox from '../../center-box';


function OneVideo({ data: { file: { player: { embedHtml } } } }) {
  return (
    <CenterBox
      width='80%'
      dangerouslySetInnerHTML={{ __html: embedHtml }}
    />
  );
}

OneVideo.propTypes = {
  data: shape({
    file: shape({
      player: object.isRequired
    }).isRequired
  }).isRequired
};

export default OneVideo;