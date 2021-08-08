const TOKEN_FIELD = 'token';

function saveCredentials(token) {
  localStorage.setItem(TOKEN_FIELD, token);
}

function clearCredentials() {
  localStorage.removeItem(TOKEN_FIELD);
}

function getIsAuthorized() {
  return !!localStorage.getItem(TOKEN_FIELD);
}

function getHeaders(headers = {}) {
  return { ...headers, Authorization: `Token ${localStorage.getItem(TOKEN_FIELD)}` };
}

export {
  saveCredentials,
  clearCredentials,
  getIsAuthorized,
  getHeaders
};