import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';

import HomeIcon from '@material-ui/icons/Home';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import StorefrontIcon from '@material-ui/icons/Storefront';
import SettingsIcon from '@material-ui/icons/Settings';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import BugReportIcon from '@material-ui/icons/BugReport';

import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

import "./hamburger.css";

import { NavLink, withRouter } from 'react-router-dom';
// import { checkAuthorization, UserDetails } from '../../helpers/helpers';

import { Image } from 'semantic-ui-react';
let menuicon = require('../../images/menu.svg');
let backicon = require('../../images/back_icon.svg');
// let home = require('../../images/home.svg');
// let home_select = require('../../images/home_select.svg');
// let profile = require('../../images/profile.svg');
// let profile_select = require('../../images/profile_select.svg');
// let tc = require('../../images/terms_and_conditions.svg');
// let tc_select = require('../../images/terms_and_conditions_select.svg');
// let sp = require('../../images/shopkeeper_profile.svg');
// let sp_select = require('../../images/shopkeeper_profile_select.svg');
// let bug = require('../../images/report_a_bug.svg');
// let bug_select = require('../../images/report_a_bug_select.svg');
// let logout = require('../../images/logout.svg');
// let logout_select = require('../../images/logout_select.svg');
// let faq = require('../../images/faq.svg');
// let faq_select = require('../../images/faq_select.svg');
// let cc = require('../../images/customer_care.svg');
// let cc_select = require('../../images/customer_care_select.svg');
// let call = require('../../images/call.svg');
// let call_select = require('../../images/call_select.svg');
// let qs = require('../../images/scan_qr_side menu.svg');
// let qs_select = require('../../images/scan_qr_side menu_select.svg');
// let qr = require('../../images/qr_side_menu.svg');
// let qr_select = require('../../images/qr_side_menu_select.svg');
let logo = require('../../images/logo2.png');
let logout = require('../../images/logout_black.svg');

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));


//

function HamburgerMenu(props) {

  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [down, setDown] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        {/* {
          console.log('hamburger pros', props)
        } */}
        {/* <div className="network-error" style={{ display: navigator.onLine ? 'none' : 'block' }}>
          <span>No internet. Connect to Wi-Fi or celluar network.</span>     
        </div> */}
        <Toolbar style={{ backgroundColor: '#fff' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <Image src={menuicon} />
          </IconButton>
          {/* <h6 className="header-company">
            {process.env.REACT_APP_NAME ? process.env.REACT_APP_NAME : "qzap"}
            {props.props && props.props.title && props.props.title.params && props.props.title.params.component ? props.props.title.params.component : null}
          </h6> */}
          <img src={logo} style={{ display: 'block', margin: 'auto' }} />
          {/* <NotificationsIcon /> */}
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          {/* <div style={{ marginRight: "auto" }}>
            <Grid container wrap="nowrap" spacing={2}>
              <Grid item style={{ margin: 'auto'}}>
                <Avatar></Avatar>
              </Grid>
            </Grid>
          </div> */}
          <IconButton onClick={handleDrawerClose} style={{ marginBottom: 'auto' }}>
            {/* {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />} */}
            <Image src={backicon} />
          </IconButton>
        </div>
        {/* <hr className="divider" /> */}
        <List>

          <NavLink exact className="sidenav-link" to="/tpa/login" onClick={() => { localStorage.clear(); }}>
            <ListItem className="sidenav-profile-item" button key={"Logout"}>
              <ListItemIcon className="sidenav-icon"><Image src={logout} /></ListItemIcon>
              <ListItemText className="sidenav-text large-bold-font" primary={"Logout"} />
            </ListItem>
          </NavLink>

          {/* <div className={"sidenav-link " + (down ? 'active' : '')} onClick={() => { setDown(!down); console.log(down); }}>
            <ListItem className="sidenav-item" button key={"Screens"}>
              <ListItemIcon className="sidenav-icon"><Image src={(down ? cc_select : cc)} /></ListItemIcon>
              <ListItemText className="sidenav-text" primary={"Screens"} />
            </ListItem>
          </div>
          <div style={{ display: down ? 'block' : 'none', marginLeft: '30px' }}>
            <NavLink exact className="sidenav-link" to="/">
              <ListItem className="sidenav-item" button key={"Login"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Login"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/confirm">
              <ListItem className="sidenav-item" button key={"OTP"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"OTP"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/legal">
              <ListItem className="sidenav-item" button key={"T&C"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"T&C"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/user-type">
              <ListItem className="sidenav-item" button key={"User Type"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"User Type"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/policy/list">
              <ListItem className="sidenav-item" button key={"Policy Verification"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Policy Verification"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/claim/1">
              <ListItem className="sidenav-item" button key={"Claim 1"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Claim 1"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/claim/2">
              <ListItem className="sidenav-item" button key={"Select Life"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Select Life"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/claim/3">
              <ListItem className="sidenav-item" button key={"Claim Information"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Claim Information"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/claim/4">
              <ListItem className="sidenav-item" button key={"Aliment Information"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Aliment Information"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/treatmentinfo">
              <ListItem className="sidenav-item" button key={"Treatment Info"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Treatment Info"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/additionalinfo">
              <ListItem className="sidenav-item" button key={"Additional Info"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Additional Info"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/treatingdoctorinfo">
              <ListItem className="sidenav-item" button key={"Treating Doctor Info"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Treating Doctor Info"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/claim/5">
              <ListItem className="sidenav-item" button key={"Billing Information"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Billing Information"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/claim/5.1">
              <ListItem className="sidenav-item" button key={"Billing Estimate"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Billing Estimate"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/claim/6">
              <ListItem className="sidenav-item" button key={"Report Information"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Report Information"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/claim/6.1">
              <ListItem className="sidenav-item" button key={"Medical History"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Medical History"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/claim/7">
              <ListItem className="sidenav-item" button key={"Claim Summary"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Claim Summary"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/claim/7/hospital">
              <ListItem className="sidenav-item" button key={"Claim Summary For Hospital"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Claim Summary For Hospital"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/claim/7.1">
              <ListItem className="sidenav-item" button key={"Claim Summary for Estimate"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Claim Summary for Estimate"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/declaration">
              <ListItem className="sidenav-item" button key={"Declaration"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Declaration"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/declaration/hospital">
              <ListItem className="sidenav-item" button key={"Declaration for hospital"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Declaration for hospital"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/patientPhoto">
              <ListItem className="sidenav-item" button key={"Patient Photo"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Patient Photo"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/thankyou">
              <ListItem className="sidenav-item" button key={"Thank You"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Thank You"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/admin/login">
              <ListItem className="sidenav-item" button key={"Admin Login"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Admin Login"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/admin/healthclaimform">
              <ListItem className="sidenav-item" button key={"Health Claim Form"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Health Claim Form"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/admin/addUserRole">
              <ListItem className="sidenav-item" button key={"Add User Role"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon
                <ListItemText className="sidenav-text" primary={"Add User Role"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/admin/policyConfig">
              <ListItem className="sidenav-item" button key={"Policy Configurator"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Policy Configurator"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/admin/webForm4">
              <ListItem className="sidenav-item" button key={"Web Form 4.0"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Web Form 4.0"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/admin/dashboard">
              <ListItem className="sidenav-item" button key={"Dashboard"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Dashboard"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/admin/createPolicy">
              <ListItem className="sidenav-item" button key={"Create Policy"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Create Policy"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/admin/pendingClaimSummary">
              <ListItem className="sidenav-item" button key={"Pending Claim Summary"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Pending Claim Summary"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/admin/explanation">
              <ListItem className="sidenav-item" button key={"Explanation of Benefits"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Explanation of Benefits"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/admin/explanationAndroid">
              <ListItem className="sidenav-item" button key={"Explanation of Benefits- Android"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Explanation of Benefits - Android"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/admin/detailedBreakUp">
              <ListItem className="sidenav-item" button key={"Detailed Breakup of Room & Nursing Charges"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Detailed Breakup of Room & Nursing Charges"} />
              </ListItem>
            </NavLink>

            <NavLink exact className="sidenav-link" to="/user-dashboard">
              <ListItem className="sidenav-item" button key={"User Dashboard"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"User Dashboard"} />
              </ListItem>
            </NavLink>

             <NavLink exact className="sidenav-link" to="/features">
              <ListItem className="sidenav-item" button key={"Features"}>
                <ListItemIcon className="sidenav-icon"><Image src={(location.pathname === "/" ? home_select : home)} /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Features"} />
              </ListItem>
            </NavLink>

          </div> */}
        </List>
      </Drawer>
    </div>
  );
}

export default HamburgerMenu;
