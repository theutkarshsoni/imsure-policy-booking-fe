import React, { useEffect, memo, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
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
import './list-sps.css';
// ////
import PropTypes from 'prop-types';


/////
import { makeSelectLoading, makeSelectError } from 'containers/App/selectors';

/* saga calls */
import saga from './saga';
import { aQ, qUp, inQ, spQC } from './actions';
import reducer from './reducer';
import { makeSelectAddToQueue, makeSelectRemoveFromQueue, makeSelectActiveQ, makeSelectSpQC } from './selectors';
import { useInjectSaga } from '../../../utils/injectSaga';
import { useInjectReducer } from '../../../utils/injectReducer';

import { browserRedirect, UserDetails } from "../../../helpers/helpers";

//////

import { urls } from '../../../config/urls';

import request from "../../../utils/request";

//Token import
import tokenData from "../../../config/token.json";

const key = 'sc';

function ListSPs(props) {
  const {
    title,
    currentPosition,
    servingtime,
    maxconcurrency,
    avatar,
    distance,
    isOnline,
    isFav,
    sp_id,
    inQueue,
    waitingtime,
    hideCurrQ,
  } = props;



  console.log("this is for real", props);


  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const [addedQ, setAddedtoQ] = useState(false);
  const [tokenNo, settokenNo] = useState(null);
  const [Cardcolor, setCardColor] = useState('red-bg');
  const [showTimer, setShowTimer] = useState(true);
  const [currQ, setcurrQ] = useState(0);


  useEffect(() => {
    {console.log("List sc called for sp_id", sp_id)}


    request('post', urls.QUEUE_COUNT_URL, {sc_id: sp_id}).then((result)=>{

      setcurrQ(result);
    })


    // if(sp_id){
    //   {console.log("Calling get count for sp_id", sp_id)}

    //   props.getQueueCount(sp_id);
    // }
    
    // const { sp_id } = match.params;
    // When initial state username is not null, submit the form to load repos
    // if (username && username.trim().length > 0) onSubmitForm();

    // Fetch SP List
    // onSubmitForm(sp_id);
    // getSpQueueCount(sp_id);

    if (UserDetails() && UserDetails().id) {
      console.log("ready to call add to queue api ");

      props.getActiveQueue(UserDetails().id, props.sp_id);

    }
   




    if (props.activeQ && Object.keys(props.activeQ).length > 0) {

      // console.log("active Q state", props.activeQ);
      // console.log("active Q length", Object.keys(props.activeQ).length);

      setAddedtoQ(true);

    }
  }, []);



  const addMeToQueue = (sp_id) => {

    if (UserDetails() && UserDetails().id) {
      // const { sp_id } = match.params;
      console.log("Add me to queue called", sp_id);
      //Randomly assigntoken number;
      var tokenNo = tokenData[Math.floor(Math.random() * tokenData.length)];
      settokenNo(tokenNo);
      props.addToQueue(UserDetails().id, sp_id, tokenNo);
      setAddedtoQ(true);
      // setPosCard(true);
      // setCountdown(true);

    }
    else {

      alert('Login/Signup to add yourself to the queue');
    }

  }

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


  }



  let returnCountdownTimer = (time) => {
    // console.log("time in iso", time);
    let timeinms = new Date(time).getTime();
    // console.log("time in ms", timeinms);
    if (timeinms > 0) {

      return <Countdown date={timeinms} renderer={renderer} zeroPadTime={2} />

    }


  }


  let milisecondtomin = (time) => {
    console.log("time in milisecond", time);
    let timeinms = new Date(time).getTime();

    let timeinmin = parseInt(timeinms/60000);

    return timeinmin+ " min";

  }

  let renderer = ({ hours, minutes, seconds, completed }) => {

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    // console.log("request reached here");

    if (completed) {
      setCardColor('green-bg');
      // Render a completed state
      return <span>Its your time</span>;
    } else {

      if(minutes < 10 && minutes > 2) {
        setCardColor('orange-bg');
        setShowTimer(false);
      }
      if(minutes <= 2) {
        setCardColor('green-bg');
        setShowTimer(false);
      }      

      // Render a countdown
      return <span className={"account-counter"+ " " +Cardcolor}>{hours}:{minutes}:{seconds}</span>;
    }

  }

  

  return (
    <ListItem alignItems="flex-start" className={"list-item"}>
      {/* {props.getQueueCount(sp_id)} */}
      <Link
        to={{ pathname: `/sp/${sp_id}`, aboutProps: props.item }}
        style={{ textDecoration: 'none' }}
      >
        <ListItemAvatar>
          <Avatar variant="rounded" className="avatar-image" src={avatar} />
        </ListItemAvatar>
      </Link>
      <ListItemText
        primary={
          <React.Fragment>
            <Link
              to={{
                pathname: `/sp/${sp_id}`,
                aboutProps: props.item,
              }}
              style={{ textDecoration: 'none' }}
            >
              <Typography
                component="span"
                variant="body2"
                className="list-head"
                color="textPrimary"
              >
                {' '}
                {title && title.length && title.length > 20
                  ? `${title.substring(0, 20 - 3)}...`
                  : title}
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

              {/* {this.state.FavSelected ? (<FavoriteIcon className="add-to-favorite" onClick={this.remToFav.bind(this, sp_id)} />) :
                (<FavoriteBorderOutlinedIcon className="add-to-favorite-outline" onClick={this.addToFav.bind(this, sp_id)} />)} */}
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
                {' '}
     
                {console.log("currQ", currQ)}
                
                {/* {console.log("queue count in dashboard", props.queueCount, props && props.queueCount && props.queueCount.queue_count, sp_id == props.queueCount.sp_id)} */}
                
                {/* {props && props.queueCount && props.queueCount.sp_id == props.sp_id && props.queueCount.queue_count > 0 ? props.queueCount.queue_count : 'Walk In'} */}

                {hideCurrQ == true ? ('') : (currQ && currQ.data && currQ.data.data && currQ.data.data.sp_id == props.sp_id && currQ.data.data.queue_count > 0 ? 'Current queue size: '+currQ.data.data.queue_count : 'Current queue size: Walk In')}


              </Typography>
              {/* {console.log("waitingtime1", new Date(waitingtime).getMinutes() - new Date().getMinutes())} */}

              {waitingtime ? (
                  showTimer=== true ? (
                <Typography
                  component="div"
                  variant="body2"
                  className="list-details"
                  color="textPrimary"
                >
                  {' '}
                  {/* My Waiting time: */}
                  {returnCountdownTimer(waitingtime)}
                </Typography>
              ) : (
                <Typography
                  component="h5"
                  variant="h1"
                  className="list-details-time"
                  color={Cardcolor}
                  style = {{
                    // color: Cardcolor
                    fontSize: "15px"
                  }}
                >
                  {' '}
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
                    {' '}
                    {/* {props && props.queueCount && props.queueCount.sp_id == props.sp_id && props.queueCount.queue_count > 0 ?  */}
                    {currQ && currQ.data && currQ.data.data && currQ.data.data.sp_id == props.sp_id && currQ.data.data.queue_count >= 0 ? 
                    
                    (`Expected wait time :  ${milisecondtomin((servingtime * currQ.data.data.queue_count ? currQ.data.data.queue_count : 0)/maxconcurrency)}`) 
                    : 
                    (`Serves per customer in : ${milisecondtomin(servingtime)}`)}

                 

                  </Typography>
                )}
            </div>
            {console.log(props.isactiveQ && Object.keys(props.isactiveQ).length > 0)}
           {/* {(props.isactiveQ && Object.keys(props.isactiveQ).length > 0) ? (<div className="list-queue-add-container"> <Chip className="list-rating online" size="small" icon={<AddCircleIcon />} label="InQ" onClick={() => remFromQueue(sp_id)}/></div>):

           (<div className="list-queue-add-container"> <Chip className="list-rating online" size="small" icon={<AddCircleIcon />} label="Qup" onClick={() => addMeToQueue(sp_id)} /></div>)
          }  */}
            {/* {this.state.OnlineSelected ? (


              this.state.QueueSelected ? (<div className="list-queue-add-container"> <Chip className="list-rating online" size="small" icon={<AddCircleIcon />} label="InQ" /></div>
              ) : (<div className="list-queue-add-container"> <Chip className="list-rating online" size="small" icon={<AddCircleIcon />} label="Qup" onClick={this.addToQ.bind(this, sp_id)} /></div>
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

ListSPs.propTypes = {
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
  error: makeSelectError()
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




    // getActiveQueue: (id, sc_id) => dispatch(activeQueue(id, sc_id)),
    // removeToQueue: (id, sc_id) => dispatch(removeMeQueue(id, sc_id)),
    // getCurrQCount: (id) => dispatch(spQueueCount(id)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);



export default compose(
  withConnect,
  memo,
)(ListSPs);

