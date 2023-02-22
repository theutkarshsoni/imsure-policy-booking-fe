import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Grid, TextField, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import Card from '@material-ui/core/Card';
import Switch from 'react-switch';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

// Saga calls
// import saga from './saga';
// import { GetDashboard, DashboardRequest } from './actions';
// import reducer from './reducer';
// import { makeSelectGetDashboard, makeSelectDashboardRequest } from './selectors';

import axios from 'axios';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import { urls } from '../../config/urls';
import { browserRedirect } from '../../helpers/helpers';
import request from '../../utils/request';
import { ToastContainer, toast } from 'react-toastify';

const key = 'dashboard';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(1),
            width: theme.spacing(16),
        },
    },
}));

function TPAList() {
    const [state, setState] = useState([
        {
            title: "",
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ]);
    console.log('state: ', state);


    function getTPAsRequest() {
        axios.get(urls.PREFIX + "/tpas")
            .then(response => {
                setState(response.data.data);
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        getTPAsRequest();
    }, []);


    return (
        <Card className="web_form_container" style={{ marginTop: "2%" }}>

            <ToastContainer />


            <button
                className="primary-button"
                style={{ width: "25%" }}
                onClick={() => {
                    browserRedirect("/");
                }}
            >
                Dashboard
                 </button>
            <div className="head_container title" style={{ marginBottom: '2%' }}>
                TPAs List
      </div>

            <div style={{ marginBottom: "5%" }}>
                <button
                    className="primary-button"
                    style={{ width: "20%" }}
                // onClick={() => }
                >
                    Add TPA
          </button>
            </div>

            {state.map((item, index) => (
                <Grid container style={{ marginLeft: '30px', marginTop: '15px' }}>
                    <Grid item xs={3}>
                        <TextField
                            variant="outlined"
                            label="Enter Title"
                            value={item.title}
                            // name="charge_head"
                            onChange={() => {
                                const temp = [...state];
                                temp[index].gsku_id = event.target.value;
                                setState(temp);
                            }}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        Created At: {item.createdAt.toString()}
                    </Grid>

                    <Grid item xs={3}>
                        Updated At: {item.updatedAt.toString()}
                    </Grid>

                    <Grid item xs={3}>
                        <button
                            className="primary-button"
                            // style={{ width: "25%" }}
                            onClick={() => {
                                browserRedirect("/");
                            }}
                        >
                            DEL
                 </button>
                    </Grid>

                </Grid>
            ))}

            <div
                onClick={() => {
                    const temp = [...state];
                    temp.push({
                        gsku_id: '',
                        gsku_title: '',
                        charge_head: '',
                        is_medical: false,
                        is_admissible: false,
                    });
                    setState(temp);
                }}
            >
                <AddIcon style={{ display: 'inline-block', marginLeft: '30px' }} />
                <p
                    style={{
                        fontWeight: 'bold',
                        fontSize: '13px',
                        display: 'inline-block',
                    }}
                >
                    {' '}
          ADD ROW{' '}
                </p>
            </div>

            {/* <button className="primary-button">Submit</button> */}

            <button
                className="primary-button"
                // style={{ width: "auto", marginLeft: "5%" }}
                disabled={!(state.length > 0)}
                onClick={() => {
                    request("post", urls.PREFIX + "/cgm", state)
                        .then(response => {
                            console.log("response: ", response);
                            console.log("response.data: ", response.data);
                            console.log("response.data.data: ", response.data.data);
                            toast.success("Success", { autoClose: 2000 });
                            setTimeout(() => {
                                browserRedirect("/");
                            }, 1000);
                        })
                        .catch(error => {
                            console.log("error: ", error);
                            // console.log(Object.keys(error.response.data.e));
                            toast.error("error: " + error.response.data.e.sqlMessage, { autoClose: 4000 });
                        })
                }}
            >
                Submit
      </button>

        </Card>
    );
}

export default TPAList;