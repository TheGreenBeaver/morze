import { applyToOneOrMany } from './misc';
import SignIn from '../pages/sign-in';
import SignUp from '../pages/sign-up';
import EmailSent from '../pages/email-sent';
import Confirm from '../pages/confirm';
import Chats from '../pages/chats';
import { LINKS } from './constants';


const CONFIRMATION_ROUTE_BASE = '/confirm';
const EMAIL_SENT_ROUTE_BASE = '/email_sent';
const RESET_ROUTE_BASE = '/reset';

const ANY_AUTH = 'any';
const EMAIL_ROUTES = ['verify', 'password', 'username'];

const routerConfig = [
  {
    path: LINKS.signIn,
    component: SignIn,
    exact: true,
    auth: false
  },
  {
    path: LINKS.signUp,
    component: SignUp,
    exact: true,
    auth: false
  },
  {
    path: LINKS.chats,
    component: Chats,
    exact: false,
    auth: true,
    verified: true
  },

  {
    path: EMAIL_ROUTES.map(pathname => `${CONFIRMATION_ROUTE_BASE}/${pathname}/:uid/:token`),
    component: Confirm,
    exact: true,
    auth: ANY_AUTH
  },
  {
    path: EMAIL_ROUTES.map(pathname => `${EMAIL_SENT_ROUTE_BASE}/${pathname}`),
    component: EmailSent,
    exact: true,
    auth: ANY_AUTH
  },
];

function getDefaultRoute(isAuthorized, isVerified) {
  if (!isAuthorized) {
    return LINKS.signIn;
  }

  if (isVerified) {
    return LINKS.chats;
  }

  return `${EMAIL_SENT_ROUTE_BASE}/${EMAIL_ROUTES[0]}`;
}

function getPathRegex(path) {
  const splPath = path.split('/');
  const modifiedPath = splPath.map(pathPart => {
    if (pathPart.startsWith(':')) {
      const splPart = pathPart.split(/[)(]/);

      const isRequired = !pathPart.endsWith('?');
      const hasPattern = splPart.length > 1;
      const situation = `${+isRequired}${+hasPattern}`;
      switch (situation) {
        case '00':
          return '?[^/]*';
        case '01':
          return `?(${splPart[1]})?`;
        case '10':
          return '[^/]+';
        case '11':
          return splPart[1];
        default:
          return ''
      }
    }
    return pathPart;
  });
  return RegExp(`^${modifiedPath.join('/')}$`);
}

const patternRoutes = routerConfig.map(({ path, auth, verified }) => ({
  pattern: applyToOneOrMany(path, getPathRegex),
  auth,
  verified
}));

function routeIsIncluded(routeConfig, isAuthorized, isVerified) {
  return [isAuthorized, ANY_AUTH].includes(routeConfig.auth) && (!isVerified === !routeConfig.verified);
}

function pathIsAvailable(path, isAuthorized, isVerified) {
  const toSearch = patternRoutes.filter(pRoute => routeIsIncluded(pRoute, isAuthorized, isVerified));
  for (const pRoute of toSearch) {
    const patternMatch = applyToOneOrMany(pRoute.pattern, pattern => pattern.test(path));
    const isAvailable = Array.isArray(patternMatch) ? patternMatch.some(m => m) : patternMatch;
    if (isAvailable) {
      return true;
    }
  }

  return false;
}

export {
  routerConfig,

  CONFIRMATION_ROUTE_BASE,
  EMAIL_SENT_ROUTE_BASE,
  RESET_ROUTE_BASE,

  getDefaultRoute,
  pathIsAvailable,
  routeIsIncluded
};