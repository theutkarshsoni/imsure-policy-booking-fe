import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { checkAuthorization } from './helpers';
import TopHeader from '../components/TopHeader';
// import BottomDrawer from '../components/BottomDrawer';

const PrivateRoute = ({
  component: Component,
  redirect: pathname,
  ...rest
}) => {
  const Routes = props => {
    if (checkAuthorization() === true) {
      return (
        <Route
          {...rest}
          render={props =>
            <Component {...rest} {...props} />

            // (
            //   <div className="authLayout">
            //     <TopHeader title={rest} />
            //     <Component {...rest} {...props} />
            //     {/* <BottomDrawer /> */}
            //   </div>
            // )
          }
        />
      );
    }
    return (
      <Redirect
        to={{
          pathname,
          state: { from: props.location },
        }}
      />
    );
  };
  return <Routes />;
};

PrivateRoute.defaultProps = { redirect: '/sessions' };

PrivateRoute.propTypes = {
  component: PropTypes.object.isRequired,
  redirect: PropTypes.string,
};

export default PrivateRoute;
