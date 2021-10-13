import React from 'react';
import { func, number, object, oneOfType, string } from 'prop-types';
import Box from '@material-ui/core/Box';
import { Cancel, Description } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';


function DisplayDoc({ onRemove, url, commonStyles, originalName, specificStyles, width }) {
  return (
    <Box
      position='relative'
      maxWidth={140}
      width={width}
      display='flex'
      alignItems='flex-end'
      className={specificStyles.linkWrapper}
    >
      {
        onRemove &&
        <IconButton
          className={clsx(commonStyles.removeBtn, specificStyles.removeBtn)}
          onClick={onRemove}
          color='secondary'
        >
          <Cancel />
        </IconButton>
      }
      <a
        href={url}
        target='_blank'
        rel='noopener noreferrer'
        className={clsx(specificStyles.docLink, commonStyles.externalLink)}
        onClick={e => e.stopPropagation()}
      >
        <Description />
        <Typography
          variant='caption'
          className={specificStyles.docLinkText}
        >
          {originalName}
        </Typography>
      </a>
    </Box>
  );
}

DisplayDoc.propTypes = {
  onRemove: func,
  url: string.isRequired,
  commonStyles: object,
  specificStyles: object.isRequired,
  originalName: string.isRequired,
  width: oneOfType([string, number])
};

DisplayDoc.defaultProps = {
  width: 'fit-content'
};

export default DisplayDoc;