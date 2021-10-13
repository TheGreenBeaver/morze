const express = require('express');
const useMiddleware = require('../middleware/index');
const useMulter = require('../middleware/multer');
const { composeMediaPath, getVar } = require('../util/misc');
const fetch = require('node-fetch');
const httpStatus = require('http-status');
const { serializeYouTubeData } = require('../serializers/attachments');
const { FILE_EXT_MAPPING } = require('../util/constants');
const path = require('path');


const router = express.Router();

useMiddleware(router, { prefix: 'auth.' });
useMulter('attachments', 'files', 'array', router, [{ route: '/file_attachments', method: 'post' }]);

router.post('/file_attachments', (req, res, next) => {
  try {
    return res.json({
      attachments: req.files.map(f => ({
        file: composeMediaPath(f),
        type: Object.entries(FILE_EXT_MAPPING)
          .find(([_, possibleExt]) => possibleExt.includes(path.extname(f.path)))[0]
      }))
    });
  } catch (e) {
    next(e);
  }
});

router.post('/youtube', async (req, res, next) => {
  try {
    const { videoId } = req.body;
    const apiKey = getVar('YOUTUBE_API_KEY');
    const youtubeDataRaw = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=id,player,snippet,contentDetails&id=${videoId}&key=${apiKey}`
    );
    if (!youtubeDataRaw.ok) {
      // 421
      return res.status(httpStatus.MISDIRECTED_REQUEST).json({ youtube: `Failed to load ${videoId}` });
    }
    const youtubeData = await youtubeDataRaw.json();
    const videoData = youtubeData.items[0];
    return res.json(serializeYouTubeData(videoData));
  } catch (e) {
    next(e);
  }
});

module.exports = router;
