import React, { useRef } from 'react';
import Box from '@material-ui/core/Box';
import useCommonStyles from '../../theme/common';
import HintButton from '../hint-button';
import { AttachFile } from '@material-ui/icons';
import useChatWindow from '../../hooks/use-chat-window';


function MessageAttachment() {
  const styles = useCommonStyles();
  const { addAttachments } = useChatWindow();
  const inputRef = useRef(null);

  return (
    <Box>
      <HintButton
        title='Attach files'
        buttonProps={{
          onClick: () => {
            inputRef.current.click();
          },
          color: 'secondary'
        }}
      >
        <AttachFile />
      </HintButton>
      <input
        type='file'
        className={styles.hiddenInput}
        ref={inputRef}
        multiple
        onChange={({ target: { files} }) => addAttachments(files)}
      />
    </Box>
  );
}

export default MessageAttachment;