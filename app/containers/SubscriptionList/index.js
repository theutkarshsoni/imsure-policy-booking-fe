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
import InfiniteScroll from "react-infinite-scroll-component";
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

function SubscriptionList({
    history,
    error,
    onSubmitForm,
    onInitialize,
    data,
    verificationResponse
}) {

    const [choice, setChoice] = React.useState('');


    const [state, setState] = useState([]);

    const [hasMore, setHasMore] = useState(true);

    const [itemPerPage, setItemPerPage] = useState(20);

    const [pageNo, setPageNo] = useState(0);

    function getSubscriptionsCall() {
        request('get', urls.PREFIX + `/subscriptions/list/${pageNo}/${itemPerPage}`)
            .then(function (response) {
                console.log("Response", response);
                console.log("Data", response && response.data);
                if(response && response.data && response.data.data) {
                    if (Object.keys(response.data.data).length < itemPerPage) {
                        setHasMore(false);
                    }
                    setPageNo(pageNo+1);
                    let temp = state.concat(response.data.data);
                    setState(temp);
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    useEffect(() => {

        getSubscriptionsCall();

    }, []);

    const classes = useStyles();


    // const labels = [
    //     "",
    //     "Code",
    //     "Type",
    //     "Description"
    // ]

    const enrolment_props = [
        // "Date of Issue", "Date of Inception", "Activation Date", "Expiry Date", "Corporate Name", "Policy number", "Number of employees", "Number of lives", "Base Product", "Key modifications", "VIP rating", "Premium", "GST", "Total Amount", "Amount received", "Amount utilized", "Amount balance", "Credit available", "Credit utilized", "Credit balance", "Amount + Credit balance", "Contact person's name", "Contact person's mobile", "Contact person's email", "Underwritten by",

        {
            label: "Date of Issue",
            key: ""
        },
        {
            label: "Date of Inception",
            key: ""
        },
        {
            label: "Activation Date",
            key: ""
        },
        {
            label: "Expiry Date",
            key: ""
        },
        {
            label: "Insured's Name",
            key: ""
        },
        {
            label: "Policy number",
            key: ""
        },
        // {
        //     label: "Number of employees",
        //     key: ""
        // },
        {
            label: "Number of lives",
            key: ""
        },
        {
            label: "Product",
            key: ""
        },
        // {
        //     label: "Key modifications",
        //     key: ""
        // },
        // {
        //     label: "VIP rating",
        //     key: ""
        // },
        {
            label: "Sum Insured",
            key: ""
        },
        {
            label: "Premium",
            key: ""
        },
        {
            label: "GST",
            key: ""
        },
        // {
        //     label: "Total Amount",
        //     key: ""
        // },
        // {
        //     label: "Amount received",
        //     key: ""
        // },
        // {
        //     label: "Amount utilized",
        //     key: ""
        // },
        // {
        //     label: "Amount balance",
        //     key: ""
        // },
        // {
        //     label: "Credit available",
        //     key: ""
        // },
        // {
        //     label: "Credit utilized",
        //     key: ""
        // },
        // {
        //     label: "Credit balance",
        //     key: ""
        // },
        // {
        //     label: "Amount + Credit balance",
        //     key: ""
        // },
        {
            label: "Contact person's name",
            key: ""
        },
        {
            label: "Contact person's mobile",
            key: ""
        },
        {
            label: "Contact person's email",
            key: ""
        },
        {
            // label: "Underwritten by - Most likely 'System'",
            label: "Underwritten by",
            key: ""
        },
    ];


    const labels = enrolment_props.map(x => x.label);


    function truncate(str, n) {
        return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
    };


    const dateFormatter = (date) => {
        let newDate = new Date(date);
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];
        let formattedDate = newDate.getDate() + " " + months[newDate.getMonth()] + " " + newDate.getUTCFullYear();
        return formattedDate;
    }

    const timeFormatter = (date) => {
        let newDate = new Date(date);
        let formattedTime = newDate.getHours() + ":" + newDate.getMinutes();
        return formattedTime;
    }

    return (

        <Card className='web_form_container' style={{ marginTop: "2%" }} >


            {/* <button
                className="primary-button"
                style={{ width: "20%" }}
                onClick={() => browserRedirect("/")}
            >
                Dashboard
            </button> */}

            <button
                className="primary-button"
                style={{ width: "20%" }}
                onClick={() => {
                    browserRedirect("/retail/subscriptions/new")
                }}
            >
                Create New Subscription
            </button>


            <div
                className="head_container title"
            // style={{ marginTop: "2%" }}
            >
                Subscriptions List

            </div>




            <InfiniteScroll
                dataLength={state.length}
                next={getSubscriptionsCall}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={
                    <p style={{ textAlign: "center" }}>
                        <b>Yay! You have seen it all</b>
                    </p>
                }
            >

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
                                    onClick={() => browserRedirect("/retail/subscriptions/" + item._id)}
                                >


                                    <td
                                        className="dashboard_table_data"
                                    >
                                        {item.inception_date && dateFormatter(item.inception_date)}
                                    </td>

                                    <td
                                        className="dashboard_table_data"
                                    >
                                        {item.inception_date && dateFormatter(item.inception_date)}
                                    </td>

                                    <td
                                        className="dashboard_table_data"
                                    >
                                        {item.inception_date && dateFormatter(item.inception_date)}
                                    </td>

                                    <td
                                        className="dashboard_table_data"
                                    >
                                        {item.valid_till && dateFormatter(item.valid_till)}
                                    </td>

                                    <td
                                        className="dashboard_table_data"
                                    >
                                        {item.insured_name}
                                    </td>

                                    <td
                                        className="dashboard_table_data"
                                    >
                                        {item.policy_number}
                                    </td>

                                    <td
                                        className="dashboard_table_data"
                                    >
                                        {item.lives_count}
                                    </td>

                                    <td
                                        className="dashboard_table_data"
                                    >
                                        {truncate(item.product + item.variant + item.scheme, 25)}
                                        {/* {item.product} {item.variant} */}
                                    </td>

                                    <td
                                        className="dashboard_table_data"
                                    >
                                        {item.sum_insured}
                                    </td>

                                    <td
                                        className="dashboard_table_data"
                                    >
                                        Premium
                                    </td>

                                    <td
                                        className="dashboard_table_data"
                                    >
                                        GST
                                    </td>

                                    <td
                                        className="dashboard_table_data"
                                    >
                                        CPN
                                    </td>

                                    <td
                                        className="dashboard_table_data"
                                    >
                                        CPM
                                    </td>

                                    <td
                                        className="dashboard_table_data"
                                    >
                                        CPE
                                    </td>

                                    <td
                                        className="dashboard_table_data"
                                    >
                                        System
                                    </td>


                                </tr>
                            )
                        })}
                </table>

            </div>
            </InfiniteScroll>
        </Card>
    );
}

export default SubscriptionList;