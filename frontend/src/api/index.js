import axios from 'axios';


const API_VERSION = 1;

const instance = axios.create({
  baseURL: `/api/v${API_VERSION}/`
});

export default instance;