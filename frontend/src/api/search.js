import axios from './index';


function search(config, headers) {
  return axios.get('/search', {
    params: config,
    headers
  }).then(({ data }) => data);
}

export {
  search
};