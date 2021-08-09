import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, useLocation, Redirect } from 'react-router-dom';
import { getDefaultRoute, pathIsAvailable, routeIsIncluded, routerConfig } from './util/routing';
import { clearError } from './store/actions/general';
import ErrorPage from './pages/error-page';
import FullScreenLayout from './components/full-screen-layout';
import OneCardLayout from './components/one-card-layout';
import { getCurrentUserData } from './api/auth';
import useErrorHandler from './hooks/use-error-handler';
import { setUserData } from './store/actions/account';
import LoadingScreen from './components/loading-screen';


function App() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { isAuthorized, userData } = useSelector(state => state.account);
  const { error } = useSelector(state => state.general);

  const handleBackendError = useErrorHandler();

  const userState = [isAuthorized, userData?.isVerified];

  useEffect(() => {
    dispatch(clearError());
  }, [pathname]);

  useEffect(() => {
    const requestCurrentUserData = async () => {
      try {
        const data = await getCurrentUserData();
        dispatch(setUserData(data));
      } catch (e) {
        handleBackendError(e)
      }
    };
    if (isAuthorized) {
      requestCurrentUserData();
    }
  }, [isAuthorized]);

  if (error) {
    return <ErrorPage />;
  }

  if (isAuthorized && !userData) {
    return <LoadingScreen />;
  }

  const Layout = userState.every(attr => !!attr) ? FullScreenLayout : OneCardLayout;

  return (
    <Layout>
      <Switch>
        {routerConfig.map(config => routeIsIncluded(config, ...userState) && <Route {...config} key={config.path} />)}
        {!pathIsAvailable(pathname, ...userState) && <Redirect to={getDefaultRoute(...userState)} />}
      </Switch>
    </Layout>
  );
}

export default App;
