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
// import './dashboard.css';

import { urls } from '../../config/urls';
import axios from 'axios';
import { browserRedirect } from '../../helpers/helpers';
import request from '../../utils/request';

const key = 'dashboard';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(1),
            width: theme.spacing(16),
        },
    },
}));

import DeleteIcon from '@material-ui/icons/Delete';

// import { confirmAlert } from 'react-confirm-alert'; // Import
// import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

function RuleList({
    history,
    error,
    onSubmitForm,
    onInitialize,
    data,
    verificationResponse
}) {

    const [choice, setChoice] = React.useState('');


    const [state, setState] = useState([]);

    function getRulesCall() {
        request('get', urls.PREFIX + "/rules")
            .then(function (response) {
                console.log("Response", response);
                console.log("Data", response.data);
                setState(response.data.data)
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    useEffect(() => {

        getRulesCall();

    }, []);

    const classes = useStyles();


    const labels = [
        "Rule Name",
        "Code",
        "Type",
        "Description"
    ]

    function truncate(str, n) {
        return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
    };


    return (

        <Card className='web_form_container' style={{ marginTop: "2%" }} >


            <button
                className="primary-button"
                style={{ width: "20%" }}
                onClick={() => browserRedirect("/")}
            >
                Dashboard
            </button>

            <button
                className="primary-button"
                style={{ width: "20%" }}
                onClick={() => {
                    browserRedirect("/rules/new")
                }}
            >
                Create New Rule
            </button>


            <div
                className="head_container title"
            // style={{ marginTop: "2%" }}
            >
                Rules List

            </div>





            <div className="table_container_web" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginTop: "2%" }} >

                <table className={"table_web"} >
                    <tr className="bill_header_row">
                        {
                            labels.map((item, index) => {
                                return (
                                    <th className={"bill_table_head"} >{item}</th>
                                )
                            })}
                    </tr>
                    {
                        state.map((item, index) => {
                            return (
                                <tr
                                    className={index % 2 === 0 ? "bill_table_content_row_even" : 'bill_table_content_row_odd'}
                                    onClick={() => browserRedirect("/rules/" + item._id)}
                                >
                                    <td
                                        className="dashboard_table_data"
                                    >
                                        {item.name}
                                    </td>

                                    <td
                                        className="dashboard_table_data"
                                    >
                                        {item.code}
                                    </td>

                                    <td
                                        className="dashboard_table_data"
                                    >
                                        {item.r_type}
                                    </td>

                                    <td
                                        className="dashboard_table_data"
                                    >
                                        {item.description && truncate(item.description, 100)}
                                    </td>

                                </tr>
                            )
                        })}
                </table>

            </div>
        </Card>
    );
}

export default RuleList;