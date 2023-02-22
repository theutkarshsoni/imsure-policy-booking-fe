import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { checkAuthorization } from './helpers';
// import NoInternetBar from '../components/NoInternetBar';

const AuthRoute = ({ component: Component, redirect: pathname, ...rest }) => {
  const Routes = props => {
    if (checkAuthorization() === false) {
      return (
        <Route
          {...rest}
          render={props =>
            <Component {...rest} {...props} />
            // (
            //   <div className="authLayout">
            //     {/* <NoInternetBar /> */}
            //     <Component {...rest} {...props} />
            //   </div>
            // )
          }
        />
      );
    }
    return (
      <Route>
        {/* <TopHeader props='authRoute' /> */}
        <Redirect
          to={{
            pathname,
            state: { from: props.location },
          }}
        />
      </Route>
    );
  };
  return <Routes />;
};

AuthRoute.defaultProps = { redirect: '/' };

AuthRoute.propTypes = {
  component: PropTypes.object.isRequired,
  redirect: PropTypes.string,
};

export default AuthRoute;
