import React from 'react';

//
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// import GoBack from '../GoBack/GoBack';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import "./header.css";
import HamburgerMenu from "../../components/HamburgerMenu";

function TopHeader(props) {

  return (
    <div className="header-app">
      <AppBar position="static">
        <Toolbar>
          <HamburgerMenu />
          {/* <Typography variant="h6" className="header-company">
            {process.env.APP_NAME ? process.env.APP_NAME : 'Imsure'}
          </Typography> */}

        </Toolbar>
      </AppBar>
      {/* <ArrowBackIcon /> */}
    </div>
  );
}

export default TopHeader;
