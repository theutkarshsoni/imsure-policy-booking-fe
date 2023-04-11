import React, { useState, useEffect } from 'react';
const faker = require('faker');

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, Grid, Select, MenuItem, InputLabel, Dialog, DialogTitle, List, ListItem, ListItemText, Checkbox, DialogContent, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@material-ui/core';

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
import ImageUploading from 'react-images-uploading';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { useParams } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";

const add_page = require("../../images/add_page.svg");
const remove_ic = require("../../images/remove_ic.svg");
const gallery_ic = require("../../images/gallery_ic.svg");

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

    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState({
        shown: false,
        itemKey: "",
        itemType: ""
    });
    const [keyType, setKeyType] = useState("");
    const [docType, setDocType] = useState("");

    const [policyZones, setPolicyZones] = useState([]);
    console.log("policyZones: ", policyZones);


    const [policyRiderOptions, setPolicyRiderOptions] = useState([]);
    console.log("policyRiderOptions: ", policyRiderOptions);

    const [policyCriticalParams, setPolicyCriticalParams] = useState({});
    console.log("policyCriticalParams", policyCriticalParams);


    const [RFQsList, setRFQsList] = useState([
        // {
        //     _id: "632b05e05de4ee2a18c3b864",
        //     name: "RFQ1"
        // },
        // {
        //     _id: "632b05e05de4ee2a18c3b865",
        //     name: "RFQ2"
        // },
        // {
        //     _id: "632b05e05de4ee2a18c3b866",
        //     name: "RFQ3"
        // },
        // {
        //     _id: "632b05e05de4ee2a18c3b867",
        //     name: "RFQ4"
        // },
        // {
        //     _id: "632b05e05de4ee2a18c3b868",
        //     name: "RFQ4"
        // },
    ]);

    const [RFQText, setRFQText] = useState("");

    const [policyRequiredDocuments, setPolicyRequiredDocuments] = useState([]);

    const routeParams = useParams();
    console.log("routeParams: ", routeParams);

    const { booking_id } = routeParams;
    console.log("booking_id: ", booking_id);
    
    function arraysAreEqual(array1, array2) {
        if (array1.length === array2.length) {
            return array1.every(element => {
                if (array2.includes(element)) {
                    return true;
                }
                return false;
            });
        }
        return false;
    }

    function getRFQListCall(value="") {
        request('get', urls.RFQ_URL_prefix + `/rfqs/`)
            .then(function (response) {
                console.log("Response", response);
                console.log("Data", response && response.data);
                setRFQsList(response && response.data && response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    function getPolicyDefinitionsCall(value = "") {
        request('get', urls.RFQ_URL_prefix + `/rfqs/${value}`)
            .then(function (response) {
                console.log("Response", response);
                console.log("Data", response && response.data);
                let policy_id = response && response.data && response.data.data && response.data.data.policy;
                console.log("policy_id", policy_id);
                request('get', urls.PC_PREFIX + `/policyconfig/${policy_id}/details/definitions`)
                    .then(function (response) {
                        console.log("Response", response);
                        console.log("Data", response && response.data);
                        setPolicyDefinitions(response && response.data && response.data.data["definitions"] && response.data.data["definitions"].legal_definitions || []);
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    function getPolicyBasicDetailsCall(value = "") {
        request('get', urls.RFQ_URL_prefix + `/rfqs/${value}`)
            .then(function (response) {
                console.log("RFQ Policy Response", response);
                console.log("RFQ Policy Data", response && response.data);
                let policy_id = response && response.data && response.data.data && response.data.data.policy;
                console.log("policy_id", policy_id);
                request('get', urls.PC_PREFIX + `/policyconfig/${policy_id}/details/bd`)
                    .then(function (response) {
                        console.log("BD Response", response);
                        console.log("BD Data", response && response.data);
                        if (response && response.data && response.data.data && response.data.data.required_documents_for_policy_booking) {
                            setPolicyRequiredDocuments(response.data.data.required_documents_for_policy_booking);
                            // if (!(state && state.required_documents && Object.keys(state.required_documents).length > 0)) {
                            //     let tempObj = {};
                            //     response.data.data.required_documents_for_policy_booking.forEach(element => {
                            //         tempObj[element] = "";
                            //     });
                            //     setState({ ...state, required_documents: tempObj});
                            // }
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const handleClose = () => {
        setOpen(false);
    };

    const onGalleryPick = (imageList) => {
        // function to add image
        imageList.map((image, i) => {
            let temp = { ...state[docType] };
            temp[keyType] = image['data_url'];
            setState({...state, [docType]: temp});
        })
        handleClose();
    };


    useEffect(() => {
        getRFQListCall();



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
                        getPolicyDefinitionsCall(response.data.data && response.data.data.RFQ_id);
                        getPolicyBasicDetailsCall(response.data.data && response.data.data.RFQ_id);
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
        inception_date: new Date(),
        expiry_date: new Date(new Date().setMonth(new Date().getMonth() + 12)),
        renewal_date: new Date(new Date().setMonth(new Date().getMonth() + 11)),
        IAPN: "",
        stage: "",
        hr_details: [],
        logo: {
            company: "https://dev-pb.claimzippy.com/a0d7bcab19794dcf3eba0171b97ffef2.png",
            insurer: "https://dev-pb.claimzippy.com/a0d7bcab19794dcf3eba0171b97ffef2.png",
            TPA: "https://dev-pb.claimzippy.com/a0d7bcab19794dcf3eba0171b97ffef2.png",
        },  // Default is CZ logo
        required_documents: {},

        payment_details: {
            payment_demanded: "2443781",
            payment_demanded_on: new Date(),
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

    const [policyDefinitions, setPolicyDefinitions] = useState([]);

    console.log("policyDefinitions", policyDefinitions);

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

    useEffect(() => {
        if (policyRequiredDocuments && Object.keys(policyRequiredDocuments).length > 0) {
            if (!(state && state.required_documents && Object.keys(state.required_documents).length > 0)) {
                // empty required_documents case
                let tempObj = {};
                policyRequiredDocuments.forEach(element => {
                    tempObj[element] = "";
                });
                setState({ ...state, required_documents: tempObj });
                console.log("policy required documents changed");
            } else {
                // non-mepty required_documents case
                // compare if policyRequiredDocuments & Object.keys(state.required_documents) is same
                if (state.required_documents && Object.keys(state.required_documents).length > 0) {
                    if (!(arraysAreEqual(policyRequiredDocuments, Object.keys(state.required_documents)))) {
                        // if not, update required_documents with new keys
                        let tempObj = {};
                        policyRequiredDocuments.forEach(element => {
                            tempObj[element] = "";
                        });
                        setState({ ...state, required_documents: tempObj });
                        console.log("policy required documents changed as different docs required");
                    }
                    // if yes, leave as it is
                }
            }
        }
    }, [policyRequiredDocuments]);



    const marital_statuses = ["Unmarried", "Married", "Divorced without children", "Divorced with children"];

    const [loadFromTemplateOpen, setLoadFromTemplateOpen] = useState(false);

    const stageList = [{ key: 1, name: "Confirmed" }, { key: 2, name: "Payment awaited" }, { key: 3, name: "Payment received" }, { key: 4, name: "Policy generated" }, { key: 5, name: "Enrollment open" }, { key: 6, name: "Enrollment started" }, { key: 7, name: "Enrollment in progress" }, { key: 8, name: "Enrollment closed" }, { key: 9, name: "Endorsement payment awaited" }, { key: 10, name: "New endorsements received and awaiting" }, { key: 11, name: "New endorsements processed" }, { key: 12, name: "Endorsement refund to be processed" }, { key: 13, name: "Endorsement refund processed" }];

    return (
        <div>

            <ToastContainer />

            {
                preview.shown ?

                    <>
                        <Dialog
                            open={preview.shown}
                            className="modal"
                            onClose={() => {
                                setPreview({
                                    shown: false,
                                    itemKey: "",
                                    itemType: ""
                                });
                            }}
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description">

                            <img src={state[preview.itemType][preview.itemKey]}></img>

                        </Dialog>
                    </> : null

            }

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
                        getOptionLabel={option => option.client_name}
                        className="claim-inputs"
                        value={state.RFQ_id ? RFQsList.find(x => x._id === state.RFQ_id) : { _id: "", client_name: RFQText }}
                        onChange={(event, value) => {
                            console.log("value: ", value);
                            // console.log(value.id);

                            if (value) {
                                let temp = {...state.payment_details};
                                temp.payment_demanded_on = new Date(value && value.updatedAt);
                                temp.payment_demanded = value && value.premium && value.premium.total_payable;
                                setState({ ...state, RFQ_id: value._id, payment_details: temp});
                                getPolicyDefinitionsCall(value._id);
                                getPolicyBasicDetailsCall(value._id);
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


                <table border={"1px solid #EEEEEE"}>
                    <tr>
                        <th > Date </th>
                        <th > Particulars </th>
                        <th > Amount </th>
                    </tr>
                    <tr>
                            <td style={{padding:"10px 10px 10px 25px"}}> {state.payment_details.payment_demanded_on && dateFormatter(state.payment_details.payment_demanded_on)} </td>
                            <td style={{padding:"10px"}}> Invoice Amount (from RFQ) </td>
                    <td align="right" style={{ padding: "10px" }}> {Number(state.payment_details.payment_demanded).toLocaleString('en-IN', {
                        maximumFractionDigits: 2,
                        style: 'currency',
                        currency: 'INR'
                    })} </td>
                    </tr>
                    <tr>
                        <td style={{padding:"10px"}}> 
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                margin="normal"
                                style={{ width: "90%", marginLeft: "5%" }}
                                id="date-picker-dialog"
                                // label="Payment Received On"
                                format="dd MMM yyyy"
                                value={state.payment_details.payment_received_on || new Date()}
                                onChange={(date) => {
                                    let temp = { ...state.payment_details };
                                    temp.payment_received_on = date;
                                    setState({ ...state, payment_details: temp })
                                }}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>    
                        </td>
                        <td style={{padding:"10px"}}> Total received amount </td>
                    <td align="right" style={{padding:"10px"}}>
                        <TextField
                            style={{ width: "100%" }}
                            // label="Payment Received"
                            // variant="outlined"
                            inputProps={{ style: { textAlign: 'right' }}}
                            value={state.payment_details.payment_received}
                            onChange={(event) => {
                                let temp = { ...state.payment_details };
                                temp.payment_received = event.target.value;
                                setState({ ...state, payment_details: temp })
                            }}
                        />
                    </td>
                    </tr>
                    {/*<tr>
                        <td> __24-Feb-2023__ </td>
                        <td> Total rreceived amount </td>
                        <td> <input /> </td>
                    </tr>
                    <tr>
                        <td> __24-Feb-2023__ </td>
                        <td> Total rreceived amount </td>
                        <td> <input /> </td>
                    </tr> */}
                </table>

            <Grid container>
                {/* <Grid xs={3} style={{padding:"10px"}}>
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
                </Grid> */}

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


            <FormControl variant="outlined" style={{ width: "30%", margin: "25px 0px" }}>
                <InputLabel id="demo-simple-select-outlined-label">Stage</InputLabel>
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="stage-select-outlined"
                    value={state.stage}
                    onChange={(event) => setState({ ...state, stage: event.target.value })}
                    label="Stage"
                >
                    {stageList && Object.keys(stageList).length > 0 && stageList.map((sl) => (
                        <MenuItem value={sl.key}>{sl.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <h3>Contact Details:</h3>

            {
                state && Object.keys(state).length > 0 && state.hr_details && Object.keys(state.hr_details).length > 0 &&
                state.hr_details.map((hr_obj, hr_idx) =>
                    <Grid container>
                        {["name", "email", "mobile", "designation"].map(hr_obj_key =>
                            <Grid xs={hr_obj_key == "designation" ? 2 : 3} style={{ padding: "10px" }}>
                                <TextField
                                    style={{ width: "100%" }}
                                    label={`Enter ${hr_obj_key}`}
                                    variant="outlined"
                                    required={(hr_obj_key == "email") || (hr_obj_key == "mobile")}
                                    value={hr_obj[hr_obj_key]}
                                    onChange={(event) => {
                                        let temp = [...state.hr_details];
                                        temp[hr_idx][hr_obj_key] = event.target.value;
                                        setState({ ...state, hr_details: temp });
                                    }}
                                />
                            </Grid>
                        )}
                        <Grid xs={1} style={{ padding: "10px" }}>
                            <button
                                className="grey-button"
                                onClick={() => {
                                    let temp = [...state.hr_details];
                                    temp.splice(hr_idx, 1);
                                    setState({ ...state, hr_details: temp });
                                }}
                            >
                                <b>DEL</b>
                            </button>
                        </Grid>
                    </Grid>
                )
            }
            <div>
                <button
                    className="grey-button"
                    onClick={() => {
                        let temp = [...state.hr_details];
                        temp.push({
                            "designation": "",
                            "email": "",
                            "mobile": "",
                            "name": ""
                        })
                        setState({ ...state, hr_details: temp });
                    }}>
                    <b>Add contact</b>
                </button>
            </div>

            <h3>Update Images:</h3>
            <Grid container>
                {
                    ["company", "insurer", "TPA"].map(logoKey =>
                        <>
                            <Grid xs={3} style={{ padding: "10px" }}>
                                <div style={{ display: "inline-block" }}>{logoKey.charAt(0).toUpperCase() + logoKey.slice(1)} logo:</div>
                                <br />
                                <br />
                                {
                                    state && state.logo && Object.keys(state.logo).length > 0 && state.logo[logoKey]
                                        ?
                                        <div style={{ display: "inline-block" }} className="content">
                                            <img src={state.logo[logoKey]} className="bill-image" onClick={() => {
                                                // function to preview attachment
                                                setPreview({
                                                    shown: true,
                                                    itemKey: logoKey,
                                                    itemType: "logo"
                                                })
                                            }} />


                                            <img src={remove_ic} className="remove_media_icon" onClick={() => {
                                                // function to remove image
                                                let temp = { ...state.logo };
                                                temp[logoKey] = "";
                                                setState({ ...state, logo: temp });
                                            }} />

                                        </div>
                                        :
                                        <>
                                            <input type="image" src={add_page} height="50px" onClick={() => {
                                                setOpen(true);
                                                setKeyType(logoKey);
                                                setDocType("logo");
                                            }} />
                                            <br />
                                        </>
                                }
                            </Grid>
                            <Dialog
                                open={open}
                                className="modal"
                                onClose={handleClose}
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description"
                            >
                                <DialogTitle className="modal-title">
                                    Add logo
                                </DialogTitle>

                                <div className="paper">
                                    <div style={{ marginLeft: '20px', marginTop: "25px" }}>
                                        <ImageUploading
                                            // multiple
                                            // value={images}
                                            onChange={onGalleryPick}
                                            maxNumber={1}
                                            dataURLKey="data_url"
                                        >
                                            {({
                                                imageList,
                                                onImageUpload,
                                                onImageRemoveAll,
                                                onImageUpdate,
                                                onImageRemove,
                                                isDragging,
                                                dragProps
                                            }) => (
                                                // write your building UI
                                                <div className="upload__image-wrapper"
                                                    style={isDragging ? { color: "red" } : null}
                                                    onClick={onImageUpload}
                                                    {...dragProps}>
                                                    <input type="image" src={gallery_ic} />
                                                    <span className="add-from-text">Pick from gallery</span>
                                                </div>
                                            )}
                                        </ImageUploading>
                                    </div>
                                </div>
                            </Dialog>
                        </>
                    )
                }
            </Grid>

            <h3>Required Documents:</h3>
            <Grid container>
                {
                    state && state.required_documents && Object.keys(state.required_documents).length > 0 &&
                    Object.keys(state.required_documents).map(docKey =>
                        <>
                            <Grid xs={3} style={{ padding: "10px" }}>
                                <div style={{ display: "inline-block" }}>{docKey.charAt(0).toUpperCase() + docKey.slice(1)} :</div>
                                <br />
                                <br />
                                {
                                    state && state.required_documents && Object.keys(state.required_documents).length > 0 && state.required_documents[docKey]
                                        ?
                                        <div style={{ display: "inline-block" }} className="content">
                                            <img src={state.required_documents[docKey]} className="bill-image" onClick={() => {
                                                // function to preview attachment
                                                setPreview({
                                                    shown: true,
                                                    itemKey: docKey,
                                                    itemType: "required_documents"
                                                })
                                            }} />


                                            <img src={remove_ic} className="remove_media_icon" onClick={() => {
                                                // function to remove image
                                                let temp = { ...state.required_documents };
                                                temp[docKey] = "";
                                                setState({ ...state, required_documents: temp });
                                            }} />

                                        </div>
                                        :
                                        <>
                                            <input type="image" src={add_page} height="50px" onClick={() => {
                                                setOpen(true);
                                                setKeyType(docKey);
                                                setDocType("required_documents");
                                            }} />
                                            <br />
                                        </>
                                }
                            </Grid>
                            <Dialog
                                open={open}
                                className="modal"
                                onClose={handleClose}
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description"
                            >
                                <DialogTitle className="modal-title">
                                    Upload document
                                </DialogTitle>

                                <div className="paper">
                                    <div style={{ marginLeft: '20px', marginTop: "25px" }}>
                                        <ImageUploading
                                            // multiple
                                            // value={images}
                                            onChange={onGalleryPick}
                                            maxNumber={1}
                                            dataURLKey="data_url"
                                        >
                                            {({
                                                imageList,
                                                onImageUpload,
                                                onImageRemoveAll,
                                                onImageUpdate,
                                                onImageRemove,
                                                isDragging,
                                                dragProps
                                            }) => (
                                                // write your building UI
                                                <div className="upload__image-wrapper"
                                                    style={isDragging ? { color: "red" } : null}
                                                    onClick={onImageUpload}
                                                    {...dragProps}>
                                                    <input type="image" src={gallery_ic} />
                                                    <span className="add-from-text">Pick from gallery</span>
                                                </div>
                                            )}
                                        </ImageUploading>
                                    </div>
                                </div>
                            </Dialog>
                        </>
                    )
                }
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
                    <div>
                        <h3 style={{marginRight: "15px"}}>IAPN: </h3>
                            <TextField
                                // style={{ width: "100%" }}
                                // label="IAPN"
                                // variant="outlined"
                                value={state.IAPN}
                                onChange={(event) => {
                                    // let temp = {...state.payment_details};
                                    // temp.remarks = event.target.value;
                                    setState({ ...state, IAPN: event.target.value })
                                }}
                            />
                    </div>}
            </div>

            <Grid container spacing={3} style={{ position: "relative", marginBottom: "30px" }}>
                {policyDefinitions && Object.keys(policyDefinitions).length > 0 && policyDefinitions.map((pd) => (
                    pd.key.includes("EoB.") ?
                        null
                        :
                        <Grid item xs={3}>
                            <div className="flip-card">
                                <div className="flip-content">
                                    <div class="flip-front">
                                        <p className="flip-front-content">{pd.key}</p>
                                    </div>
                                    <div class="flip-back">
                                        <p className="flip-back-content">{pd.value}</p>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                ))}
            </Grid>

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