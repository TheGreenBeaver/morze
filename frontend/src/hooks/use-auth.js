import { useCookies } from 'react-cookie';
import { logOutAction } from '../store/actions/account';
import { useDispatch } from 'react-redux';


const TOKEN_FIELD = 'Token';

function useAuth() {
  const [cookies, setCookie, removeCookie] = useCookies();
  const dispatch = useDispatch();

  const isAuthorized = !!cookies[TOKEN_FIELD];

  function getHeaders(headers = {}) {
    return { ...headers, Authorization: `Token ${cookies[TOKEN_FIELD]}` };
  }

  function saveCredentials(token) {
    setCookie(TOKEN_FIELD, token, { path: '/' });
  }

  function clearCredentials() {
    removeCookie(TOKEN_FIELD);
    dispatch(logOutAction());
  }

  return {
    isAuthorized,

    getHeaders,
    saveCredentials,
    clearCredentials
  };
}

export default useAuth;