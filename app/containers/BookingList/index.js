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

function BookingList({
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

    function getBookingsListCall() {
        request('get', urls.PREFIX + `/pbs/`)
            .then(function (response) {
                console.log("Response", response);
                console.log("Data", response && response.data);
                if (response && response.data && response.data.data) {
                    setState(response.data.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    useEffect(() => {
        getBookingsListCall();
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
            label: "Quotation ID",
            key: ""
        },
        {
            label: "IAPN",
            key: ""
        },
        {
            label: "Inception Date",
            key: ""
        },
        {
            label: "Expiry Date",
            key: ""
        },
        {
            label: "Payment Remarks",
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
                    browserRedirect("/bookings/new")
                }}
            >
                Book New Policy
            </button>


            <div
                className="head_container title"
            // style={{ marginTop: "2%" }}
            >
                Policy Bookings List

            </div>




            {/* <InfiniteScroll
                dataLength={state.length}
                next={getBookingsListCall}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={
                    <p style={{ textAlign: "center" }}>
                        <b>Yay! You have seen it all</b>
                    </p>
                }
            > */}

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
                                    onClick={() => browserRedirect("/bookings/" + item._id)}
                                >

                                    <td
                                        className="dashboard_table_data"
                                    >
                                        {item.RFQ_id}
                                    </td>

                                    <td
                                        className="dashboard_table_data"
                                    >
                                        {item.IAPN}
                                    </td>

                                    <td
                                        className="dashboard_table_data"
                                    >
                                        {item.inception_date && item.inception_date.length > 12 ? dateFormatter(item.inception_date) : item.inception_date}
                                    </td>
                                    <td
                                        className="dashboard_table_data"
                                    >
                                        {/* {item.expiry_date && dateFormatter(item.expiry_date)} */}
                                        {item.expiry_date && item.expiry_date.length > 12 ? dateFormatter(item.expiry_date) : item.expiry_date}
                                    </td>

                                    <td
                                        className="dashboard_table_data"
                                    >
                                        {truncate(item.payment_details && item.payment_details.remarks, 25)}
                                    </td>


                                </tr>
                            )
                        })}
                </table>

            </div>
            {/* </InfiniteScroll> */}
        </Card>
    );
}

export default BookingList;