/*
 * TPA Explanation of Benefits
 */

import React, { useEffect, memo, useState } from 'react';
import { browserRedirect } from '../../helpers/helpers';
import axios from 'axios';
import { urls } from '../../config/urls';
import { toast } from 'react-toastify';

import { Sparklines, SparklinesLine } from 'react-sparklines';
import request from '../../utils/request';

function Dashboard(props) {

    const [message, setMessage] = useState("");

    const [state, setState] = useState([]);

    const [latestCallDate, setLatestCallDate] = useState(new Date());

    // function getRequest() {
    //     request('get', urls.PREFIX + "/incidents")
    //         .then(response => {
    //             console.log("response: ", response);
    //             console.log("response.data: ", response.data);
    //             console.log("response.data.data: ", response.data.data);
    //             setState(response.data.data);
    //             setLatestCallDate(new Date());
    //         })
    //         .catch(error => console.log(error));
    // }

    // useEffect(() => {
    //     getRequest();
    // }, []);

    console.log("state: ", state);

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

    const tableHeaders = [
        "Insurer",
        "Product",
        "Variant",
        "Scheme",
        "Policy number",
        "Insured name",
        "SI",
        "SI balance",


        "Patient name",
        "Patient age",
        "Patient gender",
        "Primary ailment",
        "Line of treatment",
        "Claimed Amount",
        "Adjud For",
    ]

    return (
        <div style={{ textAlign: "center" }} >


            <button
                style={{ float: "right" }}
                onClick={() => {
                    // localStorage.removeItem("token");
                    // browserRedirect("/sessions");

                    request('post', urls.PREFIX + "/sessions/logout")
                        .then(response => {
                            console.log("response: ", response);
                            console.log("response.data: ", response.data);
                            console.log("response.data.data: ", response.data.data);

                            localStorage.removeItem("token");
                            browserRedirect("/sessions");

                        })
                        .catch(error => console.log(error));

                }}
            >
                Logout
            </button>

            <h1>Dashboard</h1>

            {/* <h2>Hi Super User, What are you going to do today</h2> */}


            <button
                className="primary-button"
                onClick={() => {
                    browserRedirect("/gmc/subscriptions");
                }}
            >
                GMC Endorsements
            </button>

            <br />
            <br />

            <button
                className="primary-button"
                onClick={() => {
                    browserRedirect("/gmc/subscriptions/new");
                }}
            >
                GMC Create Endorsement
            </button>

            <br />
            <br />

            <button
                className="primary-button"
                onClick={() => {
                    browserRedirect("/gmc/lra");
                }}
            >
                GMC Loss Ratio Analytics
            </button>



            <br />
            <br />

            <button
                className="primary-button"
                onClick={() => {
                    browserRedirect("/retail/subscriptions");
                }}
            >
                Retail Endorsements
            </button>

            <br />
            <br />

            <button
                className="primary-button"
                onClick={() => {
                    browserRedirect("/retail/subscriptions/new");
                }}
            >
                Retail Create Endorsements
            </button>




        </div>
    )
}

export default Dashboard;