/*
 * Splash Screen
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from 'react-device-detect';

import './splashScreen.css';

const key = 'splashScreen';

const logo = require('../../images/logo.png');

export function SplashScreen() {
  return (
    <MobileView>
      <div className="spalshscreen-conatiner">
        <img src={logo} className="image-container" />
      </div>
    </MobileView>
  );
}

const withConnect = connect();

export default compose(
  withConnect,
  memo,
)(SplashScreen);
