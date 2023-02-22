import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { checkAuthorization } from './helpers';
import NoInternetBar from '../components/NoInternetBar';
import TopHeader from '../components/TopHeader';
import BottomDrawer from '../components/BottomDrawer';

const AppRoute = ({ component: Component, redirect: pathname, ...rest }) => {
  const Routes = props => {
    console.log('appRoutes', rest);

    if (checkAuthorization() === false) {
      return (
        <Route
          {...rest}
          render={props => (
            <div className="authLayout">
              <TopHeader title={rest} />
              <Component {...rest} {...props} />
              {/* <BottomDrawer /> */}
            </div>
          )}
        />
      );
    }
    return (
      // <Redirect
      //   to={{
      //     pathname,
      //     state: { from: props.location },
      //   }}
      // />
      <Route
        {...rest}
        render={props => (
          <div className="authLayout">
            <NoInternetBar />
            {/* <TopHeader /> */}
            <Component {...rest} {...props} />
            {/* <BottomDrawer /> */}
          </div>
        )}
      />
    );
  };
  return <Routes />;
};

AppRoute.defaultProps = { redirect: '/' };

AppRoute.propTypes = {
  component: PropTypes.object.isRequired,
  redirect: PropTypes.string,
};

export default AppRoute;
