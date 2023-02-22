import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
// import ViewListIcon from '@material-ui/icons/ViewList';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import {
  Image
} from 'semantic-ui-react';
import { UserDetails } from '../../helpers/helpers'

import "./bottomDrawer.css";

//

const barImg = require('../../images/BB.png');
const homeDefault = require('../../images/Bottom_logos/home_default.png');
const home = require('../../images/Bottom_logos/home.png');
const profileDefault = require('../../images/Bottom_logos/Profile_default.png');
const profile = require('../../images/Bottom_logos/Profile.png');
const qr = require('../../images/Bottom_logos/QR.png');

function BottomDrawer(props) {
  console.log("Bottom navigation", props);

  return (
    <BottomNavigation
      // value={value}
      // onChange={(event, newValue) => {
      //     setValue(newValue);
      // }}
      // showLabels
      style={{
        // height: "0%",
        //   width: '100%',
        // //   backgroundColor: "transparent",
        bottom: '0',
        position: "fixed"
      }}
      className="bottom-drawer"
    >
      {/* <div style={{height: '50%', position: 'absolute', bottom: '0%', width: '100%', backgroundColor: "#ffffff"}}>

      </div> */}
      <img
        src={barImg}
        style={{
          width: '100%',
          height: "auto",
          bottom: "-10px",
          position: "absolute"
        }}
      />
      <NavLink to="/">
        {/* <BottomNavigationAction label="Home" /> */}
        <img
          src={props.path === 'dashboard' ? home : homeDefault}
          style={{
            width: 'auto',
            height: 'auto',
            position: 'absolute',
            left: '15%',
            bottom: "20%"
          }}
        />
      </NavLink>
      {/* <NavLink to="/search">
                <BottomNavigationAction label="Search" icon={<SearchIcon />} />
            </NavLink> */}
      <NavLink to="/qr/scan">
        {/* <BottomNavigationAction label="Search" icon={<AccessibilityIcon />} /> */}
        <img
          src={qr}
          style={{
            width: 'auto',
            height: 'auto',
            position: 'absolute',
            left: '50%',
            top: '30%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      </NavLink>
      {/* <NavLink to="/favorite">
        <BottomNavigationAction label="Favorite" icon={<FavoriteIcon />} />
      </NavLink> */}
      <NavLink to="/account">
        <img
          src={props.path === 'account' ? profile : profileDefault}
          style={{
            width: 'auto',
            height: 'auto',
            position: 'absolute',
            right: '15%',
            bottom: "20%"
          }}
        />
        {/* <BottomNavigationAction label="Account" /> */}
      </NavLink>
    </BottomNavigation >
  );
}

export default BottomDrawer;
