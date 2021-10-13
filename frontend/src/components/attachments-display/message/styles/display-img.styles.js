import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  twoImagesBox: {
    display: 'grid',
  },
  twoImagesBoxVert: {
    rowGap: theme.spacing(1),
    gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
    gridTemplateColumns: '1fr',
    gridTemplateAreas: '"first" "second"'
  },
  twoImagesBoxHor: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    columnGap: theme.spacing(1),
    gridTemplateRows: '1fr',
    gridTemplateAreas: '"first second"'
  },

  threeImagesBoxLtr: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
    gridTemplateRows: 'minmax(0, 1fr) minmax(0, 1fr)',
    gridTemplateAreas: '"first second" "first third"',
    columnGap: theme.spacing(1),
    rowGap: theme.spacing(1),
  },
  threeImagesBoxRtl: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)',
    gridTemplateRows: 'minmax(0, 1fr) minmax(0, 1fr)',
    gridTemplateAreas: '"first third" "second third"',
    columnGap: theme.spacing(1),
    rowGap: theme.spacing(1),
  },

  moreThanThreeBox: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gridTemplateRows: 'repeat(3, minmax(0, 1fr))',
    rowGap: theme.spacing(1),
    columnGap: theme.spacing(1),
  },

  fourImagesBoxLtr: {
    gridTemplateAreas: '"first first second" "first first third" "first first fourth"',
  },
  fourImagesBoxRtl: {
    gridTemplateAreas: '"first fourth fourth" "second fourth fourth" "third fourth fourth"',
  },

  fiveImagesBoxLtr: {
    gridTemplateAreas: '"first first second" "first first third" "fourth fifth fifth"'
  },
  fiveImagesBoxRtl: {
    gridTemplateAreas: '"first fifth fifth" "second fifth fifth" "third third fourth"'
  },

  sixImagesBoxLtr: {
    gridTemplateAreas: '"first first second" "first first third" "fourth fifth sixth"',
  },
  sixImagesBoxRtl: {
    gridTemplateAreas: '"first sixth sixth" "second sixth sixth" "third fourth fifth"',
  },

  gridImg1: {
    gridArea: 'first'
  },
  gridImg2: {
    gridArea: 'second'
  },
  gridImg3: {
    gridArea: 'third'
  },
  gridImg4: {
    gridArea: 'fourth'
  },
  gridImg5: {
    gridArea: 'fifth'
  },
  gridImg6: {
    gridArea: 'sixth'
  },
}));

export default useStyles;