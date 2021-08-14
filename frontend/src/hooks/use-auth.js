import { useCookies } from 'react-cookie';
import { logOutAction } from '../store/actions/account';
import { useDispatch } from 'react-redux';


const TOKEN_FIELD = 'Token';

function useAuth() {
  const [cookies, setCookie, removeCookie] = useCookies();
  const dispatch = useDispatch();

  const isAuthorized = !!cookies[TOKEN_FIELD];

  function getHeaders(headers = {}) {
    const authCookie = document.cookie.split('; ').find(cookie => cookie.startsWith(TOKEN_FIELD));
    return { ...headers, Authorization: `Token ${authCookie.replace(`${TOKEN_FIELD}=`, '')}` };
  }

  function saveCredentials(token) {
    setCookie(TOKEN_FIELD, token, { maxAge: 60 * 60 * 24 * 365 });
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