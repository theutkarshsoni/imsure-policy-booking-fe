import React, { useState, useEffect } from 'react';
const faker = require('faker');

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, Grid, Dialog, DialogTitle, List, ListItem, ListItemText, Checkbox, DialogContent, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import axios from 'axios';
import { urls } from '../../config/urls';

import { browserRedirect } from '../../helpers/helpers';
import Switch from 'react-switch';
import request from '../../utils/request';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { useParams } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";

const useStyles = makeStyles({
    root: {
        "& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
            display: "none",
            margin: 80
        },
    },
    input: {
        '&::placeholder': {
            fontFamily: "Open Sans",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "14px",
            lineHeight: "19px",
            color: "rgba(0, 0, 0, 0.4);",
            opacity: "0.6",
        },
    },
});

function BookPolicy({
    history
}) {

    const classes = useStyles();

    const [policies, setPolicies] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);

    const [policyText, setPolicyText] = useState("");

    const [hasMoreP, setHasMoreP] = useState(true);
    const [itemPerPageP, setItemPerPageP] = useState(20);
    const [pageNoP, setPageNoP] = useState(0);

    const [hasMoreS, setHasMoreS] = useState(true);
    const [itemPerPageS, setItemPerPageS] = useState(20);
    const [pageNoS, setPageNoS] = useState(0);


    const [policyZones, setPolicyZones] = useState([]);
    console.log("policyZones: ", policyZones);


    const [policyRiderOptions, setPolicyRiderOptions] = useState([]);
    console.log("policyRiderOptions: ", policyRiderOptions);

    const [policyCriticalParams, setPolicyCriticalParams] = useState({});
    console.log("policyCriticalParams", policyCriticalParams);


    const [RFQsList, setRFQsList] = useState([
        {
            _id: "632b05e05de4ee2a18c3b864",
            name: "RFQ1"
        },
        {
            _id: "632b05e05de4ee2a18c3b865",
            name: "RFQ2"
        },
        {
            _id: "632b05e05de4ee2a18c3b866",
            name: "RFQ3"
        },
        {
            _id: "632b05e05de4ee2a18c3b867",
            name: "RFQ4"
        },
        {
            _id: "632b05e05de4ee2a18c3b868",
            name: "RFQ4"
        },
    ]);

    const [RFQText, setRFQText] = useState("");

    const routeParams = useParams();
    console.log("routeParams: ", routeParams);

    const { booking_id } = routeParams;
    console.log("booking_id: ", booking_id);

    function getRFQListCall(value="") {
        request('get', urls.PREFIX + `/pbs/RFQList`)
            .then(function (response) {
                console.log("Response", response);
                console.log("Data", response && response.data);
                setRFQsList(response && response.data && response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }


    useEffect(() => {
        // getRFQListCall();



        if (booking_id != "new") {

            request('get', urls.PREFIX + "/pbs/" + booking_id)
                .then(function (response) {
                    console.log("Response", response);
                    console.log("Data", response.data);
                    // setOptions(response.data.data.policies);
                    // setOptions(response.data.data);
                    if (response && response.data && response.data.data) {
                        setState({
                            ...response.data.data,
                        });
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })

        }



    }, []);

    const insurers = [
        {}
    ]

    // insurer: "",
    // product: "",
    // variant: "",
    // scheme: "",
    // policy_number: faker.random.alphaNumeric(16).toUpperCase(),
    // inception_date: "",


    const [state, setState] = useState({
        RFQ_id: "",
        // policy_number: faker.random.alphaNumeric(16).toUpperCase(),
        inception_date: new Date(new Date().setMonth(new Date().getMonth() - 6)),
        expiry_date: new Date(new Date().setMonth(new Date().getMonth() + 6)),
        renewal_date: new Date(new Date().setMonth(new Date().getMonth() + 5)),
        IAPN: "",

        payment_details: {
            payment_demanded: "",
            payment_demanded_on: "",
            payment_received: "",
            payment_received_on: "",
            payment_from_bank: "",
            payment_from_ac_number: "",
            received_in_our_bank: "",
            received_in_our_bank_ac_number: "",
            remarks: "",
        }
    })

    console.log("state: ", state);

    // const relationships = ["self", "spouse", "child", "parent", "dependent"];

    const relationships = [
        "Father",
        "Mother",
        "Father-in-law",
        "Mother-in-law",
        "Spouse",
        "Live-in-partner",
        "Ex-Spouse",
        "Biological children",
        "Legally adopted children",
        "Disabled children",
        "Other dependents",
    ];



    const marital_statuses = ["Unmarried", "Married", "Divorced without children", "Divorced with children"];

    const [loadFromTemplateOpen, setLoadFromTemplateOpen] = useState(false);

    return (
        <div>

            <ToastContainer />


            <button
                className="primary-button"
                style={{ width: "20%" }}
                onClick={() => {
                    history.goBack();
                }}
            >
                Back
            </button>

            {/* <button className="primary-button">
                Back
            </button> */}

            <h1
                style={{ textAlign: "center" }}
            >
                {/* Create */}
                Policy Booking
            </h1>

            <br />
            <br />

            <Grid container >
                <Grid xs={8} >
                    <Autocomplete
                        options={RFQsList}
                        getOptionLabel={option => option.name}
                        className="claim-inputs"
                        value={state.RFQ_id ? RFQsList.find(x => x._id === state.RFQ_id) : { _id: "", name: RFQText }}
                        onChange={(event, value) => {
                            console.log("value: ", value);
                            // console.log(value.id);

                            value && setState({ ...state, RFQ_id: value._id});

                            if (value) {
                                // console.log("value._id: ", value.id);
                                // request('get', urls.PC_PREFIX + "/policyconfig/" + value.id + "/zones")
                                //     .then(function (response) {
                                //         console.log("Response", response);
                                //         console.log("Data", response.data);
                                //         const response_zones = response.data.data;
                                //         const checked_zones = response_zones.filter(item => item.checkbox.indexOf("TRUE") !== -1);
                                //         setPolicyZones(checked_zones);
                                //     })
                                //     .catch(function (error) {
                                //         console.log(error);
                                //     })
                                // getPolicyCriticalParamsCall(value.id);
                            }
                        }}
                        renderInput={params => (
                            <TextField
                                {...params}
                                variant="outlined"
                                placeholder="Select Quotaion"
                                label="Quotation"
                                onChange={(event) => {
                                    setRFQText(event.target.value);
                                }}
                            />
                        )}
                    />
                </Grid>
                <Grid xs={4} >
                    <TextField
                        style={{ width: "100%" }}
                        disabled
                        label="Quotation ID"
                        variant="outlined"
                        value={state.RFQ_id}
                    />
                </Grid>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid xs={3} >
                        <KeyboardDatePicker
                            margin="normal"
                            id="date-picker-dialog"
                            label="Inception Date"
                            style={{ width: "90%", marginLeft: "5%" }}
                            format="dd MMM yyyy"
                            value={state.inception_date}
                            onChange={(date) => {
                                let expiry_date = new Date(date);
                                expiry_date.setDate(date.getDate() + 365);
                                let renewal_date = new Date(expiry_date);
                                renewal_date.setDate(expiry_date.getDate() - 30);
                                setState({ ...state, 
                                    inception_date: date, 
                                    expiry_date: expiry_date, 
                                    renewal_date: renewal_date
                                })}}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </Grid>
                    <Grid xs={3} >
                        <KeyboardDatePicker
                            margin="normal"
                            style={{ width: "90%", marginLeft: "5%" }}
                            id="date-picker-dialog"
                            label="Expiry Date"
                            format="dd MMM yyyy"
                            value={state.expiry_date}
                            onChange={(date) => setState({ ...state, expiry_date: date })}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </Grid>
                    <Grid xs={3} >
                        <KeyboardDatePicker
                            margin="normal"
                            style={{ width: "90%", marginLeft: "5%" }}
                            id="date-picker-dialog"
                            label="Renewal Date"
                            format="dd MMM yyyy"
                            value={state.renewal_date}
                            onChange={(date) => setState({ ...state, renewal_date: date })}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </Grid>
                    <Grid xs={3}>
                        <TextField
                            style={{ width: "100%", marginTop: "10px" }}
                            label="Grace Period (days)"
                            variant="outlined"
                            value={state.grace_period || ""}
                            onChange={(event) => setState({ ...state, grace_period: event.target.value })}
                        />
                    </Grid>

                </MuiPickersUtilsProvider>
            </Grid>

            <br />
            <br />

            <h3>Payment Details: </h3>

            <Grid container>
                <Grid xs={3} style={{padding:"10px"}}>
                <TextField
                        style={{ width: "100%" }}
                        label="Payment Demanded"
                        variant="outlined"
                        value={state.payment_details.payment_demanded}
                        onChange={(event) => {
                            let temp = {...state.payment_details};
                            temp.payment_demanded = event.target.value;
                            setState({ ...state, payment_details: temp })
                        }}
                    />
                </Grid>
                <Grid xs={3} style={{padding:"0 10px"}}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                            margin="normal"
                            style={{ width: "90%", marginLeft: "5%" }}
                            id="date-picker-dialog"
                            label="Payment Demanded On"
                            format="dd MMM yyyy"
                            value={state.payment_details.payment_demanded_on || new Date()}
                            onChange={(date) => {
                                let temp = {...state.payment_details};
                                temp.payment_demanded_on = date;
                                setState({ ...state, payment_details: temp })
                            }}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                        </MuiPickersUtilsProvider>
                </Grid>

                <Grid xs={3} style={{padding:"10px"}}>
                <TextField
                        style={{ width: "100%" }}
                        label="Payment Received"
                        variant="outlined"
                        value={state.payment_details.payment_received}
                        onChange={(event) => {
                            let temp = {...state.payment_details};
                            temp.payment_received = event.target.value;
                            setState({ ...state, payment_details: temp })
                        }}
                    />
                </Grid>
                <Grid xs={3} style={{padding:"0 10px"}}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                            margin="normal"
                            style={{ width: "90%", marginLeft: "5%" }}
                            id="date-picker-dialog"
                            label="Payment Received On"
                            format="dd MMM yyyy"
                            value={state.payment_details.payment_received_on || new Date()}
                            onChange={(date) => {
                                let temp = {...state.payment_details};
                                temp.payment_received_on = date;
                                setState({ ...state, payment_details: temp })
                            }}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                        </MuiPickersUtilsProvider>
                </Grid>

                <Grid xs={3} style={{padding:"10px"}}>
                <TextField
                        style={{ width: "100%" }}
                        label="Payment From Bank"
                        variant="outlined"
                        value={state.payment_details.payment_from_bank}
                        onChange={(event) => {
                            let temp = {...state.payment_details};
                            temp.payment_from_bank = event.target.value;
                            setState({ ...state, payment_details: temp })
                        }}
                    />
                </Grid>
                <Grid xs={3} style={{padding:"10px"}}>
                <TextField
                        style={{ width: "100%" }}
                        label="Payment From A/C"
                        variant="outlined"
                        value={state.payment_details.payment_from_ac_number}
                        onChange={(event) => {
                            let temp = {...state.payment_details};
                            temp.payment_from_ac_number = event.target.value;
                            setState({ ...state, payment_details: temp })
                        }}
                    />
                </Grid>

                <Grid xs={3} style={{padding:"10px"}}>
                <TextField
                        style={{ width: "100%" }}
                        label="Received in Bank"
                        variant="outlined"
                        value={state.payment_details.received_in_our_bank}
                        onChange={(event) => {
                            let temp = {...state.payment_details};
                            temp.received_in_our_bank = event.target.value;
                            setState({ ...state, payment_details: temp })
                        }}
                    />
                </Grid>
                <Grid xs={3} style={{padding:"10px"}}>
                <TextField
                        style={{ width: "100%" }}
                        label="Received in A/C"
                        variant="outlined"
                        value={state.payment_details.received_in_our_bank_ac_number}
                        onChange={(event) => {
                            let temp = {...state.payment_details};
                            temp.received_in_our_bank_ac_number = event.target.value;
                            setState({ ...state, payment_details: temp })
                        }}
                    />
                </Grid>

                <Grid xs={6} style={{padding:"10px"}}>
                <TextField
                        style={{ width: "100%" }}
                        label="Enter Payment Remarks"
                        variant="outlined"
                        multiline
                        value={state.payment_details.remarks}
                        onChange={(event) => {
                            let temp = {...state.payment_details};
                            temp.remarks = event.target.value;
                            setState({ ...state, payment_details: temp })
                        }}
                    />
                </Grid>


                {/*  */}
            </Grid>





            <div>
                {!state.IAPN ? 
                <button
                onClick={() => setState({
                    ...state, IAPN: faker.random.alphaNumeric(16).toUpperCase()
                    })}
                >
                    Generate IAPN
                </button>
                :
                <h3>IAPN: {state.IAPN}</h3>}
            </div>
            <div>
                {booking_id == "new" && 
                <button
                    className="primary-button"
                    disabled={!state.IAPN}
                    onClick={() => {
                        // axios.post(urls.PREFIX + "subscription/new", state)
                        request('post', urls.PREFIX + "/pbs/new", state)
                            .then(function (response) {
                                console.log("Response", response);
                                console.log("Data", response.data);
                                browserRedirect("/");
                            })
                            .catch(function (error) {
                                console.log(error);
                            })
                    }}
                >
                    Confirm Policy Booking (IAPN: {state.IAPN})
                </button>}



                {
                    booking_id != "new"
                        ?
                        <button
                            className="primary-button"
                            style={{
                                background: "#F90"
                            }}
                            onClick={() => {
                                confirmAlert({
                                    title: 'Confirm Overwrite',
                                    message: 'Are you sure you want to overwrite this policy booking.',
                                    buttons: [
                                        {
                                            label: 'Yes',
                                            onClick: () => {
                                                {
                                                    request('put', urls.PREFIX + "/pbs/" + booking_id,
                                                        state
                                                    )
                                                        .then(response => {
                                                            toast.success(response.data.message, { autoClose: 4000 });
                                                            browserRedirect("/");

                                                        })
                                                        .catch(error => console.log(error))
                                                }
                                            }
                                        },
                                        {
                                            label: 'No',
                                            // onClick: () => alert('Click No')
                                        }
                                    ]
                                });
                            }}
                        >
                            Overwrite Existing Policy Booking (IAPN: {state.IAPN})
                        </button>

                        :
                        null
                }


            </div>

        </div>
    );
}

export default BookPolicy;








{/* <Grid container >
                <Grid xs={3} >
                    <Autocomplete
                        options={options}
                        getOptionLabel={option => option.name}
                        className="claim-inputs"
                        value={options.find(x => x.name === state.insurer)}
                        onChange={(event, value) => {
                            console.log(value.name)
                            value && setState({ ...state, insurer: value.name })
                        }}
                        renderInput={params => (
                            <TextField
                                {...params}
                                variant="outlined"
                                placeholder="Select Insurer"
                                label="Insurer"
                            />
                        )}
                    />
                </Grid>

                <Grid xs={3} >
                    {
                        state.insurer
                            ?
                            <Autocomplete
                                options={options.find(x => x.name === state.insurer).products}
                                getOptionLabel={option => option.name}
                                className="claim-inputs"
                                value={options.find(x => x.name === state.insurer).products.find(x => x.name === state.name)}
                                onChange={(event, value) => {
                                    console.log(value.name)
                                    value && setState({ ...state, product: value.name, UIN: value.UIN })
                                }}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        placeholder="Select Product"
                                        label="Product"
                                    />
                                )}
                            />
                            :
                            <>Please select an insurer first</>
                    }
                </Grid>

                <Grid xs={3} >
                    <TextField
                        style={{ marginLeft: "5%" }}
                        variant="outlined"
                        label="Variant"
                        value={state.variant}
                        placeholder="Enter Variant"
                        onChange={() => setState({ ...state, variant: event.target.value })}
                    />
                </Grid>

                <Grid xs={3} >
                    <TextField
                        style={{ marginLeft: "5%" }}
                        variant="outlined"
                        label="Scheme"
                        placeholder="Enter Scheme"
                        value={state.scheme}
                        onChange={() => setState({ ...state, scheme: event.target.value })}
                    />
                </Grid>

            </Grid> */}