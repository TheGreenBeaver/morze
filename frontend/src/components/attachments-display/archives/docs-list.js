import React from 'react';
import { arrayOf, number, shape, string } from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { getOriginalFileName } from '../../../util/misc';
import { Description } from '@material-ui/icons';
import useCommonStyles from '../../../theme/common';
import useStyles from './styles/docs-list.styles';


function DocsList({ data }) {
  const commonStyles = useCommonStyles();
  const styles = useStyles();
  return (
    <List disablePadding>
      {
        data.map(doc =>
          <ListItem
            className={commonStyles.externalLink}
            divider={false}
            key={doc.id}
            component='a'
            href={doc.file}
            rel='noopener noreferrer'
            target='_blank'
          >
            <Description className={styles.itemIcon} />
            <ListItemText>{getOriginalFileName(doc.file)}</ListItemText>
          </ListItem>
        )
      }
    </List>
  );
}

DocsList.propTypes = {
  data: arrayOf(shape({
    file: string.isRequired,
    id: number.isRequired
  })).isRequired
};

export default DocsList;