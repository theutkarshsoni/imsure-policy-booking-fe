import React, { useEffect, memo, useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
/** */
import { Link, withRouter } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Chip from '@material-ui/core/Chip';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import Countdown from 'react-countdown';
import './list-establishments.css';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
// ////
import PropTypes from "prop-types";

/////
import { makeSelectLoading, makeSelectError } from "containers/App/selectors";

/* saga calls */
import saga from "./saga";
import { aQ, qUp, inQ, spQC } from "./actions";
import reducer from "./reducer";
import {
  makeSelectAddToQueue,
  makeSelectRemoveFromQueue,
  makeSelectActiveQ,
  makeSelectSpQC,
} from "./selectors";
import { useInjectSaga } from "../../../utils/injectSaga";
import { useInjectReducer } from "../../../utils/injectReducer";

import { browserRedirect, UserDetails } from "../../../helpers/helpers";

//////

import { urls } from "../../../config/urls";

import request from "../../../utils/request";

//Token import
import tokenData from "../../../config/token.json";

//Import contentLoader
import ContentLoader from "react-content-loader";

const ListLoader = () => (
  <ContentLoader>
    <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
    <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
    <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
  </ContentLoader>
);

const key = "establishment";

function ListEstablishments(props) {
  const {
    title,
    currentPosition,
    servingtime,
    maxconcurrency,
    avatar,
    distance,
    isOnline,
    isFav,
    shopId,
    inQueue,
    waitingtime,
    hideCurrQ,
  } = props;

  console.log("this is for real", props);

  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const [addedQ, setAddedtoQ] = useState(false);
  const [tokenNo, settokenNo] = useState(null);
  const [Cardcolor, setCardColor] = useState("red-bg");
  const [showTimer, setShowTimer] = useState(true);
  const [currQ, setcurrQ] = useState(0);
  const [currSp, setcurrSp] = useState(0);

  useEffect(() => {
    {
      console.log("List establishment called for shopId", shopId);
    }

    let current = new Date().getTime();
    let localQCount = JSON.parse(localStorage.getItem(`/qz/${shopId}`));

    let localSpDetail = JSON.parse(localStorage.getItem(`/sd/${shopId}`));

    if (localQCount && current < localQCount.expiry) {
      setcurrQ(localQCount);

      //No background syncing required in this cse

    }else{

      request("post", urls.QUEUE_COUNT_URL, { sp_id: shopId }).then(
        (response) => {
          setcurrQ(response);

          localStorage.setItem(
            `/qz/${shopId}`,
            JSON.stringify(response)
          );

        }
      );

    }

    if (localSpDetail && current < localSpDetail.expiry) {
      // Check for expiry
      setcurrSp(localSpDetail.data[0]);

      //Set background Sync from localObj
      let backgroundSyncObj = {};
      backgroundSyncObj.expiry = localSpDetail.expiry;
      backgroundSyncObj.requested_on = new Date().toISOString();
      // backgroundSyncObj.min_retry_count = 5;
      // backgroundSyncObj.max_retry_count = 10;
      backgroundSyncObj.status = "BACKGROUND_SYNC";
      backgroundSyncObj.method = "GET";
      backgroundSyncObj.data = {};
      backgroundSyncObj.headers = {};
      // backgroundSyncObj.object_to_override = "spList";
      // backgroundSyncObj.callback_handler = "spList()";
      backgroundSyncObj.url = urls.SHOP_DETAIL_URL + "/" + shopId;
      localStorage.setItem(`/spd/${shopId}`, JSON.stringify(backgroundSyncObj));
    } else {
      request("get", urls.SHOP_DETAIL_URL + "/" + shopId).then((response) => {
        console.log("now i got the details after lazy loading", response);
        if (response && response.data && response.data.data[0]) {
          setcurrSp(response.data.data[0]);

          localStorage.setItem(
            `/sd/${response.data.data[0]._id}`,
            JSON.stringify(response.data)
          );

          //Background sync call for updating sp details

          // let backgroundSyncObj = {};
          // backgroundSyncObj.expiry = response.data.expiry;
          // backgroundSyncObj.requested_on = new Date().toISOString();
          // backgroundSyncObj.min_retry_count = 5;
          // backgroundSyncObj.max_retry_count = 10;
          // backgroundSyncObj.status = "BACKGROUND_SYNC";
          // backgroundSyncObj.method = "GET";
          // backgroundSyncObj.data = {};
          // backgroundSyncObj.headers = {};
          // // backgroundSyncObj.object_to_override = "spList";
          // // backgroundSyncObj.callback_handler = "spList()";
          // backgroundSyncObj.url = urls.SHOP_DETAIL_URL + "/" + shopId;
          // localStorage.setItem(
          //   `/spd/${shopId}`,
          //   JSON.stringify(backgroundSyncObj)
          // );
        }
      });
    }

    // if(shopId){
    //   {console.log("Calling get count for shopId", shopId)}

    //   props.getQueueCount(shopId);
    // }

    // const { shopId } = match.params;
    // When initial state username is not null, submit the form to load repos
    // if (username && username.trim().length > 0) onSubmitForm();

    // Fetch SP List
    // onSubmitForm(shopId);
    // getSpQueueCount(shopId);

    if (UserDetails() && UserDetails().id) {
      console.log("ready to call add to queue api ");

      props.getActiveQueue(UserDetails().id, props.shopId);
    }





    if (props.activeQ && Object.keys(props.activeQ).length > 0) {
      // console.log("active Q state", props.activeQ);
      // console.log("active Q length", Object.keys(props.activeQ).length);

      setAddedtoQ(true);
    }
  }, []);

  const addMeToQueue = (shopId) => {
    if (UserDetails() && UserDetails().id) {
      // const { shopId } = match.params;
      console.log("Add me to queue called", shopId);
      //Randomly assigntoken number;
      var tokenNo = tokenData[Math.floor(Math.random() * tokenData.length)];
      settokenNo(tokenNo);
      props.addToQueue(UserDetails().id, shopId, tokenNo);
      setAddedtoQ(true);
      // setPosCard(true);
      // setCountdown(true);
    } else {
      alert("Login/Signup to add yourself to the queue");
    }
  };

  const remFromQueue = () => {
    console.log("remove me from queue called", props);

    if (props.isactiveQ && Object.keys(props.isactiveQ).length > 0) {
      if (UserDetails() && UserDetails().id && props.isactiveQ[0]._id) {
        console.log("ready to call remove to queue api");

        props.removeToQueue(props.isactiveQ[0]._id, UserDetails().id);

        setAddedtoQ(false);
        // setPosCard(false);
        // setCountdown(false);
      }
    }
  };

  let returnCountdownTimer = (time) => {
    // console.log("time in iso", time);
    let timeinms = new Date(time).getTime();
    // console.log("time in ms", timeinms);
    if (timeinms > 0) {
      return <Countdown date={timeinms} renderer={renderer} zeroPadTime={2} />;
    }
  };

  let milisecondtomin = (time) => {
    // console.log("time in milisecond", time);
    let timeinms = new Date(time).getTime();

    let timeinmin = parseInt(timeinms / 60000);

    return timeinmin + " min";
  };

  let renderer = ({ hours, minutes, seconds, completed }) => {
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    // console.log("request reached here");

    if (completed) {
      setCardColor("green-bg");
      // Render a completed state
      return <span>Its your time</span>;
    } else {
      if (minutes < 10 && minutes > 2) {
        setCardColor("orange-bg");
        setShowTimer(false);
      }
      if (minutes <= 2) {
        setCardColor("green-bg");
        setShowTimer(false);
      }

      // Render a countdown
      return <span className={"account-counter" + " " + Cardcolor}>{hours}:{minutes}:{seconds}</span>;
    }

  }
  if (!currSp) {
    console.log("aint got curr sp", currSp);
    return <ListLoader />;
  } else {
    console.log("currSp", currSp);
    return (
      <ListItem alignItems="flex-start" className={"list-item"}>
        {/* {props.getQueueCount(shopId)} */}
        <Link
          to={{ pathname: `/sp/${shopId}`, aboutProps: props.item }}
          style={{ textDecoration: "none" }}
        >
          <ListItemAvatar>
            <Avatar
              variant="rounded"
              className="avatar-image"
              src={currSp.profile_pic}
            />
          </ListItemAvatar>
        </Link>
        <ListItemText
          primary={
            <React.Fragment>
              <Link
                to={{
                  pathname: `/sp/${shopId}`,
                  aboutProps: props.item,
                }}
                style={{ textDecoration: "none" }}
              >
                <Typography
                  component="span"
                  variant="body2"
                  className="list-head"
                  color="textPrimary"
                >
                  {" "}
                  {currSp.sp_name &&
                  currSp.sp_name.length &&
                  currSp.sp_name.length > 20
                    ? `${currSp.sp_name.substring(0, 20 - 3)}...`
                    : currSp.sp_name}
                  {/* ({distance}) */}
                </Typography>
              </Link>
              <Typography
                component="span"
                variant="body2"
                className="list-head-rating"
                color="textPrimary"
              >
                {/* <Chip className="list-rating" color="primary" size="small" icon={<StarBorderIcon />} label="5" /> */}
                {/* {this.state.FavSelected ? (<FavoriteIcon className="add-to-favorite" onClick={this.remToFav.bind(this, shopId)} />) :
                  (<FavoriteBorderOutlinedIcon className="add-to-favorite-outline" onClick={this.addToFav.bind(this, shopId)} />)} */}
              </Typography>
            </React.Fragment>
          }
          secondary={
            <React.Fragment>
              <div className="list-details-container">
                <Typography
                  component="div"
                  variant="body2"
                  className="list-details"
                  color="textPrimary"
                >
                  {" "}
                  {console.log("currQ", currQ)}
                  {/* {console.log("queue count in dashboard", props.queueCount, props && props.queueCount && props.queueCount.queue_count, shopId == props.queueCount.sp_id)} */}
                  {/* {props && props.queueCount && props.queueCount.sp_id == props.shopId && props.queueCount.queue_count > 0 ? props.queueCount.queue_count : 'Walk In'} */}
                  {hideCurrQ == true
                    ? ""
                    : currQ &&
                      currQ.data &&
                      currQ.data.data &&
                      currQ.data.data.sp_id == props.shopId &&
                      currQ.data.data.queue_count > 0
                    ? "Current queue size: " + currQ.data.data.queue_count
                    : "Current queue size: Walk In"}
                </Typography>
                {/* {console.log("waitingtime1", new Date(waitingtime).getMinutes() - new Date().getMinutes())} */}
                {waitingtime ? (
                  showTimer === true ? (
                    <Typography
                      component="div"
                      variant="body2"
                      className="list-details"
                      color="textPrimary"
                    >
                      {" "}
                      {/* My Waiting time: */}
                      {returnCountdownTimer(waitingtime)}
                    </Typography>
                  ) : (
                    <Typography
                      component="h5"
                      variant="h1"
                      className="list-details-time"
                      color={Cardcolor}
                      style={{
                        // color: Cardcolor
                        fontSize: "15px",
                      }}
                    >
                      {" "}
                      {/* My Waiting time: */}
                      {/* {returnCountdownTimer(waitingtime)} */}
                      It's your turn! Go scan the QR.
                    </Typography>
                  )
                ) : (
                  <Typography
                    component="div"
                    variant="body2"
                    className="list-details"
                    color="textPrimary"
                  >
                    {" "}
                    {console.log(
                      "serving duration",
                      currSp.sp_details.servingDuration
                    )}
                    {/* {props && props.queueCount && props.queueCount.sp_id == props.shopId && props.queueCount.queue_count > 0 ?  */}
                    {currQ &&
                    currQ.data &&
                    currQ.data.data &&
                    currQ.data.data.sp_id == props.shopId &&
                    currQ.data.data.queue_count >= 0 &&
                    currSp &&
                    currSp.sp_details &&
                    currSp.sp_details.servingDuration &&
                    currSp.sp_details.maxConcurrency
                      ? `Expected wait time :  ${milisecondtomin(
                          (currSp.sp_details.servingDuration *
                            currQ.data.data.queue_count) /
                            currSp.sp_details.maxConcurrency
                        )}`
                      : `Serves per customer in : ${milisecondtomin(
                          currSp &&
                            currSp.sp_details &&
                            currSp.sp_details.servingDuration
                        )}`}
                  </Typography>
                )}
              </div>
              {console.log(
                props.isactiveQ && Object.keys(props.isactiveQ).length > 0
              )}
              {/* {(props.isactiveQ && Object.keys(props.isactiveQ).length > 0) ? (<div className="list-queue-add-container"> <Chip className="list-rating online" size="small" icon={<AddCircleIcon />} label="InQ" onClick={() => remFromQueue(shopId)}/></div>):
             (<div className="list-queue-add-container"> <Chip className="list-rating online" size="small" icon={<AddCircleIcon />} label="Qup" onClick={() => addMeToQueue(shopId)} /></div>)
            }  */}
              {/* {this.state.OnlineSelected ? (
                this.state.QueueSelected ? (<div className="list-queue-add-container"> <Chip className="list-rating online" size="small" icon={<AddCircleIcon />} label="InQ" /></div>
                ) : (<div className="list-queue-add-container"> <Chip className="list-rating online" size="small" icon={<AddCircleIcon />} label="Qup" onClick={this.addToQ.bind(this, shopId)} /></div>
                  )
              ) :
                (<div className="list-queue-add-container"> <Chip className="list-rating offline" color="secondary" size="small" icon={<AddCircleIcon />} label="Closed" /></div>)} */}
            </React.Fragment>
          }
        />
        {/* <ListItemSecondaryAction>
              </ListItemSecondaryAction> */}
      </ListItem>
    );
  }
}

ListEstablishments.propTypes = {
  item: PropTypes.any,
  activeQ: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  queueCount: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  // addToQueue: PropTypes.func,
  removeToQueue: PropTypes.func,
  getQueueCount: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  // repos: makeSelectRepos(),
  // username: makeSelectUsername(),
  // spDetails: makeSelectSPDetails(),
  // isaddedQ: makeSelectAddToQueue(),
  isactiveQ: makeSelectActiveQ(),
  queueCount: makeSelectSpQC(),
  // isremQ: makeSelectRemoveFromQueue(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

export function mapDispatchToProps(dispatch) {
  return {
    // onChangeUsername: evt => dispatch(changeUsername(evt.target.value)),
    // onSubmitForm: (evt, sp_id) => {
    //     console.log('event called', evt, sp_id);
    //     if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    //     dispatch(spDetailsInit(evt, sp_id));
    // },
    addToQueue: (evt, ownerId, sp_id, tokenNo) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(qUp(evt, ownerId, sp_id, tokenNo));
    },
    // getSpQueueCount: (evt, sp_id) => {
    //     if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    //     dispatch(spQueueCount(evt, sp_id));
    // },
    getActiveQueue: (evt, ownerId, sp_id) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(aQ(evt, ownerId, sp_id));
    },
    getQueueCount: (sp_id) => {
      console.log("Called dispatch to get queue count for ", sp_id);
      // if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(spQC(sp_id));
    },
    removeToQueue: (evt, queueId, ownerId) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(inQ(evt, queueId, ownerId));
    },

    // getActiveQueue: (id, establishment_id) => dispatch(activeQueue(id, establishment_id)),
    // removeToQueue: (id, owner_id) => dispatch(removeMeQueue(id, owner_id)),
    // getCurrQCount: (id) => dispatch(spQueueCount(id)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(
  withConnect,
  memo
)(ListEstablishments);
