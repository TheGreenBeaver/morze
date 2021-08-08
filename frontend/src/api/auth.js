import axios from './index';
import { getHeaders } from '../util/auth';


function signIn(credentials) {
  return axios.post('/auth/sign_in', credentials).then(({ data }) => data);
}

function signUp(credentials) {
  return axios.post('/users', credentials).then(({ data }) => data);
}

function getCurrentUserData() {
  return axios.get('/users/me', { headers: getHeaders() }).then(({ data }) => data);
}

function confirm(type, uid, token) {
  return axios.post(`/users/${type}`, { uid, token }).then(({ data }) => data);
}

export {
  signIn,
  getCurrentUserData,
  signUp,
  confirm
};