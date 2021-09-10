import React from 'react';
import { func, object, shape, string } from 'prop-types';


function DisplayYoutube({ onRemove, url }) {
  return (
    <img src={url.preview.default.url} alt='videoPreview' />
  );
}

DisplayYoutube.propTypes = {
  url: shape({
    player: shape({
      embedHtml: string.isRequired
    }).isRequired,
    preview: object.isRequired
  }).isRequired,
  onRemove: func
};

export default DisplayYoutube;