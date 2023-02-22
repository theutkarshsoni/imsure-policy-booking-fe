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
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
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
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

import "./goback.css";

import { NavLink, withRouter } from 'react-router-dom';
import { checkAuthorization } from '../../helpers/helpers';


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

function GoBack(props) {

  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

//   const history = useHistory();
console.log("goback props", props);


  const handleDrawerOpen = () => {

    setOpen(true);
    // history.push('/')
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
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={(e) => props.history.goBack()}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography className="header-company" variant="h6" noWrap>
            {process.env.REACT_APP_NAME ? process.env.REACT_APP_NAME : "OAF"}
          </Typography>
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
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <NavLink className="sidenav-link" to="/">
            <ListItem className="sidenav-item" button key={"Dashboard"}>
              <ListItemIcon className="sidenav-icon"><HomeIcon /></ListItemIcon>
              <ListItemText className="sidenav-text" primary={"Dashboard"} />
            </ListItem>
          </NavLink>




          {/* {checkAuthorization() === true ?
            (<NavLink className="sidenav-link" to="/zapq">
              <ListItem className="sidenav-item" button key={"ZapQ"}>
                <ListItemIcon className="sidenav-icon"><FlashOnIcon /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"ZapQ"} />
              </ListItem>
            </NavLink>) : (<NavLink className="sidenav-link" to="/login">
              <ListItem className="sidenav-item" button key={"ZapQ"}>
                <ListItemIcon className="sidenav-icon"><FlashOnIcon /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"ZapQ"} />
              </ListItem>
            </NavLink>)} */}



          {/* <NavLink className="sidenav-link" to="/queue">
            <ListItem className="sidenav-item" button key={"My Queue"}>
              <ListItemIcon className="sidenav-icon"><AccessibilityIcon /></ListItemIcon>
              <ListItemText className="sidenav-text" primary={"My Queue"} />
            </ListItem>
          </NavLink> */}
          {/* <NavLink className="sidenav-link" to="/favorite">
            <ListItem className="sidenav-item" button key={"Favorites"}>
              <ListItemIcon className="sidenav-icon"><FavoriteIcon /></ListItemIcon>
              <ListItemText className="sidenav-text" primary={"Favorites"} />
            </ListItem>
          </NavLink> */}

          {checkAuthorization() === true ?
            (<NavLink className="sidenav-link" to="/qr/scan">
              <ListItem className="sidenav-item shop-qr" button key={"Scan QR C"}>
                <ListItemIcon className="sidenav-icon"><AspectRatioIcon /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Scan QR C"} />
              </ListItem>
            </NavLink>) : (<NavLink className="sidenav-link" to="/login">
              <ListItem className="sidenav-item shop-qr" button key={"Scan QR C"}>
                <ListItemIcon className="sidenav-icon"><AspectRatioIcon /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"Scan QR C"} />
              </ListItem>
            </NavLink>)}


          {checkAuthorization() === true ?
            (<NavLink className="sidenav-link" to="/qr/generate">
              {/* <ListItem className="sidenav-item" button key={"My Shop's QR C"}> */}
              <ListItem className="sidenav-item" button key={"My QR Code"}>
                <ListItemIcon className="sidenav-icon"><VpnKeyIcon /></ListItemIcon>
                {/* <ListItemText className="sidenav-text" primary={"My Shop's QR C"} /> */}
                <ListItemText className="sidenav-text" primary={"My QR Code"} />
              </ListItem>
            </NavLink>) : (<NavLink className="sidenav-link" to="/login">
              {/* <ListItem className="sidenav-item" button key={"My Shop's QR C"}> */}
              <ListItem className="sidenav-item" button key={"My QR Code"}>
                <ListItemIcon className="sidenav-icon"><VpnKeyIcon /></ListItemIcon>
                {/* <ListItemText className="sidenav-text" primary={"My Shop's QR C"} /> */}
                <ListItemText className="sidenav-text" primary={"My QR Code"} />
              </ListItem>
            </NavLink>)}




          {checkAuthorization() === true ?
            (<NavLink className="sidenav-link" to="/setup-shop">
              <ListItem className="sidenav-item shop-setting" button key={"My Shop's Settings"}>
                <ListItemIcon className="sidenav-icon"><StorefrontIcon /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"My Shop's Settings"} />
              </ListItem>
            </NavLink>) : (<NavLink className="sidenav-link" to="/login">
              <ListItem className="sidenav-item shop-setting" button key={"My Shop's Settings"}>
                <ListItemIcon className="sidenav-icon"><StorefrontIcon /></ListItemIcon>
                <ListItemText className="sidenav-text" primary={"My Shop's Settings"} />
              </ListItem>
            </NavLink>)}

          {/* {checkAuthorization() === true ? (<NavLink className="sidenav-link" to="/shopDashboard">
            <ListItem className="sidenav-item" button key={"Shop Dashboard"}>
              <ListItemIcon className="sidenav-icon"><AccountCircleIcon /></ListItemIcon>
              <ListItemText className="sidenav-text" primary={"Shop Dashboard"} />
            </ListItem>
          </NavLink>) : (<NavLink className="sidenav-link" to="/shopDashboard">
            <ListItem className="sidenav-item" button key={"Shop Dashboard"}>
              <ListItemIcon className="sidenav-icon"><AccountCircleIcon /></ListItemIcon>
              <ListItemText className="sidenav-text" primary={"Shop Dashboard"} />
            </ListItem>
          </NavLink>)} */}


          {checkAuthorization() === true ? (<NavLink className="sidenav-link" to="/account">
            <ListItem className="sidenav-item" button key={"My Account"}>
              <ListItemIcon className="sidenav-icon"><AccountCircleIcon /></ListItemIcon>
              <ListItemText className="sidenav-text" primary={"My Account"} />
            </ListItem>
          </NavLink>) : (<NavLink className="sidenav-link" to="/login">
            <ListItem className="sidenav-item" button key={"Signin/Signup"}>
              <ListItemIcon className="sidenav-icon"><AccountCircleIcon /></ListItemIcon>
              <ListItemText className="sidenav-text" primary={"Signin/Signup"} />
            </ListItem>
          </NavLink>)}



          {checkAuthorization() === true ? (<NavLink className="sidenav-link" to="/logout">
            <ListItem className="sidenav-item" button key={"Logout"}>
              <ListItemIcon className="sidenav-icon"><ExitToAppIcon /></ListItemIcon>
              <ListItemText className="sidenav-text" primary={"Logout"} />
            </ListItem>
          </NavLink>) : (null)}



        </List>
        <Divider />
        {/* <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List> */}
      </Drawer>
    </div>
  );
}

export default withRouter(GoBack);
