import React from 'react';
import { shape, string } from 'prop-types';
import DialogContent from '@material-ui/core/DialogContent';
import CenterBox from '../center-box';


function YoutubeModal({ player }) {
  return (
    <DialogContent>
      <CenterBox dangerouslySetInnerHTML={{ __html: player.embedHtml }} />
    </DialogContent>
  );
}

YoutubeModal.propTypes = {
  player: shape({
    embedHtml: string.isRequired
  })
};

export default YoutubeModal;