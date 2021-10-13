import React, { useState } from 'react';
import { arrayOf, bool, number, object, oneOf, oneOfType, shape, string } from 'prop-types';
import { FILE_TYPES } from '../../util/constants';
import DialogContent from '@material-ui/core/DialogContent';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from '@material-ui/lab/TabPanel';
import TabContext from '@material-ui/lab/TabContext';
import useStyles from './styles/archives-modal.styles';
import DocsList from '../attachments-display/archives/docs-list';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { ArrowBack, ChevronLeft, ChevronRight } from '@material-ui/icons';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AutoSizeImg from '../auto-size-img';
import ImgList from '../attachments-display/archives/img-list';
import VideosList from '../attachments-display/archives/videos-list';
import CenterBox from '../center-box';
import OneVideo from '../attachments-display/archives/one-video';


const FILE_TYPE_LABELS = {
  [FILE_TYPES.img]: 'Images',
  [FILE_TYPES.doc]: 'Documents',
  [FILE_TYPES.youtube]: 'Videos'
};
const FILE_TYPE_LIST = {
  [FILE_TYPES.img]: ImgList,
  [FILE_TYPES.doc]: DocsList,
  [FILE_TYPES.youtube]: VideosList
}
const FILE_TYPE_ITEM = {
  [FILE_TYPES.img]: ({ data }) => <AutoSizeImg src={data.file} width='100%' height='100%' />,
  [FILE_TYPES.youtube]: OneVideo
}
const fTypeList = Object.values(FILE_TYPES);

function SingleItemWrapper({ children, setCurrentId, fittingData, currentId, styles }) {
  const currentIdx = fittingData.findIndex(item => item.id === currentId);
  const nextItem = fittingData[currentIdx + 1];
  const prevItem = fittingData[currentIdx - 1];

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='flex-start'
      width='100%'
      height='100%'
    >
      <Button
        startIcon={<ArrowBack />}
        className={styles.backBtn}
        onClick={e => {
          e.stopPropagation();
          setCurrentId(null);
        }}
      >
        Back to list
      </Button>
      <CenterBox position='relative'>
        {
          !!prevItem &&
          <IconButton
            onClick={e => {
              e.stopPropagation();
              setCurrentId(prevItem.id)
            }}
            className={clsx(styles.navBtn, styles.prevBtn)}
          >
            <ChevronLeft />
          </IconButton>
        }
        {
          !!nextItem &&
          <IconButton
            disabled={!nextItem}
            onClick={e => {
              e.stopPropagation();
              setCurrentId(nextItem.id)
            }}
            className={clsx(styles.navBtn, styles.nextBtn)}
          >
            <ChevronRight />
          </IconButton>
        }

        {children}
      </CenterBox>
    </Box>
  );
}

function ArchivesModal({ archives, initial, restricted }) {
  const [currentTab, setCurrentTab] = useState(initial.type);
  const [currentId, setCurrentId] = useState(initial.id);
  const styles = useStyles();

  const singleItem = currentId != null;
  let content;
  if (singleItem) {
    const SingleItemComponent = FILE_TYPE_ITEM[currentTab];
    const fittingData = archives.filter(att => att.type === currentTab);
    content =
      <SingleItemWrapper
        currentId={currentId}
        setCurrentId={setCurrentId}
        styles={styles}
        fittingData={fittingData}
      >
        <SingleItemComponent data={fittingData.find(att => att.id === currentId)} />
      </SingleItemWrapper>;
  } else {
    content =
      <TabContext value={currentTab}>
        <Tabs
          value={currentTab}
          onChange={(_, newTab) => {
            setCurrentTab(newTab);
          }}
          variant='fullWidth'
          TabIndicatorProps={{
            style: { width: 'calc(100% / 3)', left: `calc(100% / 3 * ${fTypeList.indexOf(currentTab)})` }
          }}
          classes={{ root: styles.tabsRoot }}
        >
          {
            fTypeList.map(fType =>
              <Tab
                key={fType}
                label={FILE_TYPE_LABELS[fType]}
                value={fType}
                className={styles.oneTab}
              />
            )
          }
        </Tabs>

        {
          fTypeList.map(fType => {
            const fittingData = archives.filter(item => item.type === fType);
            const ListComponent = FILE_TYPE_LIST[fType];

            return (
              <TabPanel value={fType} key={fType} className={styles.tabPanel}>
                {
                  fittingData.length
                    ? <ListComponent
                      data={fittingData}
                      setCurrentId={setCurrentId}
                    />
                    : <Typography align='center'>
                      No {FILE_TYPE_LABELS[fType]} {restricted ? 'attached to this message' :'in this chat'}
                    </Typography>
                }
              </TabPanel>
            );
          })
        }
      </TabContext>;
  }

  return (
    <DialogContent className={styles.dialogContent}>
      {content}
    </DialogContent>
  );
}

ArchivesModal.propTypes = {
  archives: arrayOf(shape({
    type: oneOf([...fTypeList]).isRequired,
    file: oneOfType([object, string]).isRequired,
    id: number.isRequired
  })).isRequired,
  initial: object,
  restricted: bool
};

ArchivesModal.defaultProps = {
  initial: { type: FILE_TYPES.img }
};

export default ArchivesModal;