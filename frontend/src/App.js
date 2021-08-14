import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, useLocation, Redirect } from 'react-router-dom';
import { getDefaultRoute, pathIsAvailable, routeIsIncluded, routerConfig } from './util/routing';
import { clearError } from './store/actions/general';
import ErrorPage from './pages/error-page';
import FullScreenLayout from './components/full-screen-layout';
import OneCardLayout from './components/one-card-layout';
import { setUserData } from './store/actions/account';
import LoadingScreen from './components/loading-screen';
import useAuth from './hooks/use-auth';
import { useAxios } from './contexts/axios-context';
import { HTTP_ENDPOINTS } from './util/constants';


function App() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { userData } = useSelector(state => state.account);
  const { error } = useSelector(state => state.general);
  const { isAuthorized } = useAuth();
  const { api } = useAxios();

  const userState = [isAuthorized, userData?.isVerified];

  useEffect(() => {
    dispatch(clearError());
  }, [pathname]);

  useEffect(() => {
    if (isAuthorized) {
      api(HTTP_ENDPOINTS.getCurrentUserData).call()
        .then(data => dispatch(setUserData(data)));
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
