import React from 'react';
import { string } from 'prop-types';
import Typography from '@material-ui/core/Typography';
import linkifyUrls from 'linkify-urls';
import useStyles from './styles/message.styles';
import useCommonStyles from '../../theme/common';


function MessageText({ text }) {
  const styles = useStyles();
  const commonStyles = useCommonStyles();
  const splitByNewlines = text.split(/\n/g);
  return splitByNewlines.map((lineOfText, idx) => {
    const linksAndText = Array.from(linkifyUrls(lineOfText, { type: 'dom' }).childNodes);
    const withPreventedPropagation = linksAndText.map((part, idx) => {
      const href = part.attributes?.href;
      const isLink = !!href;
      if (isLink) {
        return (
          <a
            key={idx}
            href={href.value}
            rel='noopener noreferrer'
            target='_blank'
            onClick={e => e.stopPropagation()}
            className={commonStyles.externalLink}
          >
            {part.textContent}
          </a>
        );
      }
      return <React.Fragment key={idx}>{part.textContent}</React.Fragment>;
    });
    return <Typography key={idx} className={styles.messageText}>{withPreventedPropagation}</Typography>;
  });
}

MessageText.propTypes = {
  text: string
};

MessageText.defaultProps = {
  text: ''
};

export default MessageText;