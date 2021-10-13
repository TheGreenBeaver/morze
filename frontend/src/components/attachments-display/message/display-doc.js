import React from 'react';
import { arrayOf, number, object, shape, string } from 'prop-types';
import DisplayOneDoc from '../common/display-doc';
import { getOriginalFileName } from '../../../util/misc';
import Box from '@material-ui/core/Box';
import useChatWindow from '../../../hooks/use-chat-window';
import CWBp from '../../../util/chat-window-breakpoints';


function DisplayDoc({ fittingAttachments, specificStyles, commonStyles }) {
  const { slotData: { size } } = useChatWindow();
  return (
    <Box display='flex' flexWrap='wrap'>
      {
        fittingAttachments.map(att =>
          <DisplayOneDoc
            key={att.id}
            url={att.file}
            width={size.lt(CWBp.names.large, CWBp.axis.hor) ? '50%' : 'calc(100% / 3)'}
            specificStyles={specificStyles}
            originalName={getOriginalFileName(att.file)}
            commonStyles={commonStyles}
          />
        )
      }
    </Box>
  );
}

DisplayDoc.propTypes = {
  fittingAttachments: arrayOf(shape({
      id: number.isRequired,
      file: string.isRequired
    })
  ).isRequired,
  specificStyles: object.isRequired,
  commonStyles: object.isRequired
};

export default DisplayDoc;