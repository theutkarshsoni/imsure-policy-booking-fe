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

import DeleteIcon from '@material-ui/icons/Delete';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


function IncidentList(props) {

    const [message, setMessage] = useState("");

    const [state, setState] = useState([]);

    const [latestCallDate, setLatestCallDate] = useState(new Date());

    function getRequest() {
        request('get', urls.PREFIX + "/incidents")
            .then(response => {
                console.log("response: ", response);
                console.log("response.data: ", response.data);
                console.log("response.data.data: ", response.data.data);
                setState(response.data.data);
                setLatestCallDate(new Date());
            })
            .catch(error => console.log(error));
    }

    useEffect(() => {
        getRequest();
    }, []);

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
        // "Claimed Amount",
        // "Adjud For",

        "Del Claim",
        "Del Incident"
    ]

    return (
        <div style={{ textAlign: "center" }} >

            <div style={{ textAlign: "left" }} >
                <button
                    style={{ width: "10%" }}
                    className="primary-button"
                    onClick={() => {
                        browserRedirect("/");
                    }}
                >
                    Dashboard
                </button>

            </div>

            <h1>Incidents List</h1>
            <button
                className="primary-button"
                style={{ marginLeft: 0, width: "10%", marginRight: "40%" }}
                onClick={() => {
                    getRequest();
                }}
            >
                Refresh
            </button>
            <span style={{ marginRight: "20%" }} >
                Latest loaded on {dateFormatter(latestCallDate)} {timeFormatter(latestCallDate)} {latestCallDate.getSeconds()}s.
            </span>
            {
                state && state.length > 0 && state.find(x => x.claims.length > 0)
                    ?
                    <>

                        <div className="table_container_web" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }} >

                            <table className={"table_web"} >
                                <tr className="bill_header_row">
                                    {
                                        tableHeaders.map(header =>
                                            <th className={"bill_table_head"} >{header}</th>
                                        )
                                    }
                                </tr>

                                {
                                    state.map((incident, index) =>
                                        incident.claims.map((claim) =>

                                            <tr
                                                className={index % 2 === 0 ? "bill_table_content_row_even" : 'bill_table_content_row_odd'}
                                            >

                                                <td
                                                    className="dashboard_table_data"
                                                >
                                                    {incident.insurance_details.insurer}
                                                </td>
                                                <td
                                                    className="dashboard_table_data"
                                                >
                                                    {incident.insurance_details.product}
                                                </td>
                                                <td
                                                    className="dashboard_table_data"
                                                >
                                                    {incident.insurance_details.variant}
                                                </td>

                                                <td
                                                    className="dashboard_table_data"
                                                >
                                                    {incident.insurance_details.scheme}
                                                </td>

                                                <td
                                                    className="dashboard_table_data"
                                                >
                                                    {incident.insurance_details.policy_number}
                                                </td>

                                                <td
                                                    className="dashboard_table_data"
                                                >
                                                    {incident.subscription.lives.find(x => x.relationship.toUpperCase() === "SELF") && incident.subscription.lives.find(x => x.relationship.toUpperCase() === "SELF").name}
                                                </td>

                                                <td
                                                    className="dashboard_table_data"
                                                >
                                                    {incident.subscription.sum_insured}
                                                </td>

                                                <td
                                                    className="dashboard_table_data"
                                                >
                                                    {
                                                        incident.subscription.sum_insured
                                                        -
                                                        (
                                                            incident.claim_history.lives.reduce((prev, cur) => {
                                                                if (Number(cur.claimed_since_renewal)) {
                                                                    return prev + Number(cur.claimed_since_renewal)
                                                                }
                                                                return prev + 0;
                                                            }, 0)
                                                        )
                                                    }
                                                </td>

                                                <td
                                                    className="dashboard_table_data"
                                                >
                                                    {incident.patient_details.name}
                                                </td>
                                                <td
                                                    className="dashboard_table_data"
                                                >
                                                    {incident.patient_details.dob}
                                                </td>
                                                <td
                                                    className="dashboard_table_data"
                                                >
                                                    {incident.patient_details.gender}
                                                </td>

                                                <td
                                                    className="dashboard_table_data"
                                                >
                                                    {incident.ailment_information && incident.ailment_information.primary_ailment && incident.ailment_information.primary_ailment.name}
                                                    {" "}
                                                    {incident.ailment_information && incident.ailment_information.primary_ailment && incident.ailment_information.primary_ailment.ICD_code}
                                                </td>
                                                <td
                                                    className="dashboard_table_data"
                                                >
                                                    {claim.treatment_information && claim.treatment_information.primary_treatment && claim.treatment_information.primary_treatment.name_of_surgery}
                                                    {" "}
                                                    {claim.treatment_information && claim.treatment_information.primary_treatment && claim.treatment_information.primary_treatment.ICD_PCS_code}
                                                </td>

                                                {/* <td
                                                    className="dashboard_table_data"
                                                >
                                                    {
                                                        claim.adjud_for === "preauth"
                                                            ?
                                                            <>
                                                                {claim.preauth.billing_estimate && claim.preauth.billing_estimate.total}
                                                            </>
                                                            :
                                                            <>
                                                                -
                                                            </>
                                                    }

                                                </td> */}

                                                {/* <td
                                                    className="dashboard_table_data"
                                                >
                                                    {
                                                        claim.preauth.status === "submitted"
                                                            ? "Preauth"
                                                            : (
                                                                claim.enhancements.find(x => x.status === "data_refined")
                                                                    ?
                                                                    "Enhancements"
                                                                    : "Discharge"
                                                            )
                                                    }

                                                </td> */}

                                                <td>

                                                    <DeleteIcon style={{ cursor: 'pointer', color: "#266CC2" }} onClick={() => {

                                                        confirmAlert({
                                                            title: 'Confirm Claim Delete',
                                                            message: 'Are you sure you want to delete this claim.',
                                                            buttons: [
                                                                {
                                                                    label: 'Yes',
                                                                    onClick: () => {
                                                                        request('delete', urls.PREFIX + "/incidents/" + incident._id + "/claims/" + claim._id)
                                                                            .then(function (response) {
                                                                                console.log("Response", response);
                                                                                console.log("Data", response.data);
                                                                                getRequest();
                                                                            })
                                                                            .catch(function (error) {
                                                                                console.log(error);
                                                                            })
                                                                    }
                                                                },
                                                                {
                                                                    label: 'No',
                                                                    // onClick: () => alert('Click No')
                                                                }
                                                            ]
                                                        });

                                                    }} />

                                                </td>

                                                <td>

                                                    <DeleteIcon style={{ cursor: 'pointer', color: "#266CC2" }} onClick={() => {

                                                        confirmAlert({
                                                            title: 'Confirm Incident Delete',
                                                            message: 'Are you sure you want to delete this full incident.',
                                                            buttons: [
                                                                {
                                                                    label: 'Yes',
                                                                    onClick: () => {
                                                                        request('delete', urls.PREFIX + "/incidents/" + incident._id)
                                                                            .then(function (response) {
                                                                                console.log("Response", response);
                                                                                console.log("Data", response.data);
                                                                                getRequest();
                                                                            })
                                                                            .catch(function (error) {
                                                                                console.log(error);
                                                                            })
                                                                    }
                                                                },
                                                                {
                                                                    label: 'No',
                                                                    // onClick: () => alert('Click No')
                                                                }
                                                            ]
                                                        });

                                                    }} />

                                                </td>

                                            </tr>

                                        )
                                    )
                                }


                            </table>
                        </div>
                    </>
                    :
                    <>
                        <h3 style={{ marginTop: "10%" }} >No pending adjudications at the moment. Please click the refresh button to see new claims</h3>
                    </>
            }

        </div>
    )
}

export default IncidentList;