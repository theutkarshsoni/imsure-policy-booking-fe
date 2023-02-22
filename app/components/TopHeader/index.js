import React from 'react';
import { FormattedMessage } from 'react-intl';

import A from '../Header/A';
import Img from '../Header/Img';
import NavBar from '../Header/NavBar';
import HeaderLink from '../Header/HeaderLink';
import Banner from '../Header/banner.jpg';
import messages from '../Header/messages';


//
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import NotificationsIcon from '@material-ui/icons/Notifications';

import './header.css';

import HamburgerMenu from '../HamburgerMenu';
import GoBack from '../GoBack/GoBack';
// import ArrowBackIcon from '@material-ui/icons/ArrowBack';

//

function TopHeader(props) {
  console.log("topHeader props", props.props);


  if (props && props.props && props.props === 'authRoute') {
    return (
      // <div>
      //   <A href="https://www.reactboilerplate.com/">
      //     <Img src={Banner} alt="react-boilerplate - Logo" />
      //   </A>
      //   <NavBar>
      //     <HeaderLink to="/">
      //       <FormattedMessage {...messages.home} />
      //     </HeaderLink>
      //     <HeaderLink to="/features">
      //       <FormattedMessage {...messages.features} />
      //     </HeaderLink>
      //   </NavBar>
      // </div>
      <div className="header-app">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className="header-company">
              {process.env.REACT_APP_NAME ? process.env.REACT_APP_NAME : "OAF"}
            </Typography>
            {/* <NotificationsIcon /> */}
          </Toolbar>
        </AppBar>
        <GoBack />
      </div>
    );
  }
  else {
    return (
      // <div>
      //   <A href="https://www.reactboilerplate.com/">
      //     <Img src={Banner} alt="react-boilerplate - Logo" />
      //   </A>
      //   <NavBar>
      //     <HeaderLink to="/">
      //       <FormattedMessage {...messages.home} />
      //     </HeaderLink>
      //     <HeaderLink to="/features">
      //       <FormattedMessage {...messages.features} />
      //     </HeaderLink>
      //   </NavBar>
      // </div>
      <div className="header-app">
        <AppBar position="static">
          <Toolbar>
            {/* <Typography variant="h6" className="header-company">
              {process.env.REACT_APP_NAME ? process.env.REACT_APP_NAME : "OAF"}
            </Typography> */}
            {/* <NotificationsIcon /> */}
            <HamburgerMenu props={props} />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default TopHeader;
