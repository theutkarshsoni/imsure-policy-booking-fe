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

function RetailCreateSubscription({
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

    // Policy configs not options. Need to rename later


    // const [subscriptions, setSubscriptions] = useState([]);

    const [policyZones, setPolicyZones] = useState([]);
    console.log("policyZones: ", policyZones);


    const [policyRiderOptions, setPolicyRiderOptions] = useState([]);
    console.log("policyRiderOptions: ", policyRiderOptions);

    const [policyCriticalParams, setPolicyCriticalParams] = useState({});
    console.log("policyCriticalParams", policyCriticalParams);


    const routeParams = useParams();
    console.log("routeParams: ", routeParams);

    const { subscription_id } = routeParams;
    console.log("subscription_id: ", subscription_id);

    function getPoliciesCall(value="") {
        request('get', urls.PREFIX + `/subscriptions/gad/policies/${pageNoP}/${itemPerPageP}${value && `/${value}`}`)
            .then(function (response) {
                console.log("Response", response);
                console.log("Data", response && response.data);
                setPolicies(response && response.data && response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    function getSubscriptionsCall() {
        request('get', urls.PREFIX + `/subscriptions/gad/subscriptions/${pageNoS}/${itemPerPageS}`)
            .then(function (response) {
                console.log("Response", response);
                console.log("Data", response && response.data);
                if(response && response.data && response.data.data) {
                    if (Object.keys(response.data.data).length < itemPerPageS) {
                        setHasMoreS(false);
                    }
                    setPageNoS(pageNoS+1);
                    let temp = subscriptions.concat(response.data.data);
                    setSubscriptions(temp);
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }



    useEffect(() => {
        getPoliciesCall();
        getSubscriptionsCall();


        if (subscription_id != "new") {

            request('get', urls.PREFIX + "/subscriptions/" + subscription_id)
                .then(function (response) {
                    console.log("Response", response);
                    console.log("Data", response.data);
                    // setOptions(response.data.data.policies);
                    // setOptions(response.data.data);
                    setState({
                        ...response.data.data,
                        template_id: response.data.data._id,
                        template_policy_number: response.data.data.policy_number,
                    });
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
        policy: "",
        policy_number: faker.random.alphaNumeric(16).toUpperCase(),
        inception_date: new Date(new Date().setMonth(new Date().getMonth() - 18)),
        renewal_date: new Date(new Date().setMonth(new Date().getMonth() + 6)),
        valid_till: new Date(new Date().setMonth(new Date().getMonth() + 6)),
        policy_is_inforce: true,
        sum_insured_original: "",
        sum_insured: "",
        voluntary_deductible: "",
        mobile_no: "",
        designation: "",
        cover_type: "",
        IAPN: "",

        riders_chosen: [],

        insured_marital_status: "",


        lives: [
            {
                name: "Jai Gupta",
                relationship: "self",
                member_id: faker.random.alphaNumeric(16).toUpperCase(),
                gender: "male",
                dob: "1974-02-14",
                PED_ICDs: [],
                PE_ICDs: [],
                WP: [],
                claimed_since_renewal: "",
                IAMI: "",
            },
            {
                name: "Padma Gupta",
                relationship: "Spouse",
                member_id: faker.random.alphaNumeric(16).toUpperCase(),
                gender: "female",
                dob: "1974-02-14",
                PED_ICDs: [],
                PE_ICDs: [],
                WP: [],
                claimed_since_renewal: "",
                IAMI: "",
            },
        ],
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
    useEffect(() => {
        if (state.policy) { getPolicyCriticalParamsCall(state.policy) }
    }, [state.policy])


    function getPolicyZonesCall(policy_id) {
        request('get', urls.PC_PREFIX + "/policyconfig/" + policy_id + "/details/zones")
            .then(function (response) {
                console.log("Response", response);
                console.log("Data", response.data);
                const response_zones = response.data.data.zones;
                const checked_zones = response_zones.filter(item => item.checkbox.indexOf("TRUE") !== -1);
                setPolicyZones(checked_zones);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    function getPolicyRiderOptionsCall(policy_id) {
        request('get', urls.PC_PREFIX + "/policyconfig/" + policy_id + "/details/riders")
            .then(function (response) {
                console.log("Response", response);
                console.log("Data", response.data);
                // const response_zones = response.data.data;
                // const checked_zones = response_zones.filter(item => item.checkbox.indexOf("TRUE") !== -1);
                setPolicyRiderOptions(response.data.data.riders);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    function getPolicyCriticalParamsCall(policy_id) {
        request('get', urls.PC_PREFIX + "/policyconfig/" + policy_id + "/details/cp")
            .then(function (response) {
                console.log("CP Response", response);
                console.log("CP Data", response && response.data && response.data.data);
                setPolicyCriticalParams(response && response.data && response.data.data && response.data.data.cp);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const [parentHierarchy, setParentHierarchy] = useState([]);

    
    const getPolicyDetails = (policy_id, isFirst, parentArry) => {
        let tempParentHierarchy = parentArry;
        console.log("parentHierarchy => ",isFirst,  parentHierarchy);
        request('get', urls.PC_PREFIX + "/policyconfig/" + policy_id + "/details/bd")
            .then(function (response) {
                console.log("Policy details Response => ", response);
                console.log("Policy details", response && response.data && response.data.data);
                let policyDetails = response && response.data && response.data.data;
                
                if(policyDetails) {
                    let tempPolicy = policyDetails;
                    tempPolicy["id"] = policy_id;
                    tempPolicy["pos"] = Object.keys(tempParentHierarchy).length + 1;
                    delete policyDetails.policy_wording;
                    // setParentHierarchy([]);
                    tempParentHierarchy.push(tempPolicy);
                    
                    // tempParentHierarchy = [];
                    if(policyDetails.parent_product_id) {
                        getPolicyDetails(policyDetails.parent_product_id, false, tempParentHierarchy);
                    }
                    else {
                        setParentHierarchy(tempParentHierarchy);
                    }
                    
                }
                console.log("latest policy parentHierarchy => ",isFirst,  tempParentHierarchy);
                // setPolicyCriticalParams(response && response.data && response.data.data && response.data.data.cp);
            })
            .catch(function (error) {
                console.log(error);
            })
    }




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
                Subscription
            </h1>



            <div
                style={{ textAlign: "right" }}
            >

                <span
                    onClick={() => {
                        setLoadFromTemplateOpen(!loadFromTemplateOpen);
                    }}
                    style={{ color: "blue", }}
                >
                    Load From Existing Subscriptions

                </span>

            </div>

            <br />
            <br />

            <Dialog
                onClose={() => setLoadFromTemplateOpen(!loadFromTemplateOpen)}
                aria-labelledby="simple-dialog-title"
                open={loadFromTemplateOpen}
            >
                <DialogTitle
                    id="simple-dialog-title"
                    style={{ textAlign: "center" }}
                >
                    Templates / Existing Subscriptions
                </DialogTitle>

                <DialogContent id="scrollableSubscriptionDiv">
                <InfiniteScroll
                    dataLength={subscriptions.length}
                    next={getSubscriptionsCall}
                    hasMore={hasMoreS}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p style={{ textAlign: "center" }}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                    scrollableTarget="scrollableSubscriptionDiv"
                >
                <List>
                    {subscriptions && Object.keys(subscriptions).length > 0 && subscriptions.map(subscription =>
                        <ListItem
                            button
                            onClick={() => {



                                request('get', urls.PREFIX + "/subscriptions/" + subscription.id)
                                    .then(function (response) {
                                        console.log("Response", response);
                                        console.log("Data", response.data);
                                        let response_data = response.data.data;
                                        const template_id = response_data._id;
                                        delete response_data._id;
                                        setState({
                                            ...state,
                                            ...response_data,
                                            policy_number: state.policy_number,
                                            template_id,
                                            template_policy_number: response_data.policy_number,
                                        })
                                        getPolicyZonesCall(response_data.policy);
                                        getPolicyRiderOptionsCall(response_data.policy);
                                        setLoadFromTemplateOpen(!loadFromTemplateOpen);
                                        toast.success("Succesfully Applied The Template");
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    })

                                // axios.get(urls.PREFIX + policy._id + step)
                                //     .then(function (response) {
                                //         console.log("Response", response);
                                //         console.log("Data", response.data);
                                //         console.log("response.data.data: ", response.data.data);
                                //         onTemplateSelect(response.data.data);
                                //         setOpen(!open);
                                //         toast.success("Succesfully Applied The Template");
                                //     })
                                //     .catch(function (error) {
                                //         console.log(error);
                                //     })
                            }}
                            key={subscription._id}
                        >
                            <ListItemText primary={
                                // // truncate(policy.policy.insurer, 15)
                                // subscription.insurer
                                // + "-"
                                // // + truncate(policy.policy.product, 15)
                                // + subscription.product
                                // + "-"
                                // + subscription.variant
                                // + "-"
                                // + subscription.scheme
                                subscription.label
                            }
                            />
                        </ListItem>
                    )}
                </List>
                </InfiniteScroll>
                </DialogContent>

            </Dialog>



            {/* {console.log({ id: state.policy, label: "" })} */}
            {/* {console.log({ id: options.policies.find(x => x.id === state.policy) })} */}

            <Grid container >
                <Grid xs={8} >
                    <Autocomplete
                        options={policies}
                        getOptionLabel={option => option.label}
                        className="claim-inputs"
                        value={state.policy ? policies.find(x => x.id === state.policy) : { policy: "", label: policyText }}
                        onChange={(event, value) => {
                            console.log("value: ", value);
                            // console.log(value.id);

                            value && setState({ ...state, policy: value.id, product: value.product, variant: value.variant, scheme: value.scheme, insurer_id: value.insurer_id, insurer: value.insurer, sum_insured_original: null, designation: null });

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

                                getPolicyZonesCall(value.id);

                                getPolicyRiderOptionsCall(value.id);
                                setParentHierarchy([]);
                                getPolicyDetails(value.id, true, []);

                                // getPolicyCriticalParamsCall(value.id);
                            }
                        }}
                        renderInput={params => (
                            <TextField
                                {...params}
                                variant="outlined"
                                placeholder="Select Product"
                                label="Product"
                                style={{background: parentHierarchy && Object.keys(parentHierarchy).length > 0 ? "#AFD3FF" : "#FFFFFF"}}
                                onChange={(event) => {
                                    setPolicyText(event.target.value);
                                    getPoliciesCall(event.target.value);
                                }}
                            />
                        )}
                    />
                </Grid>
                <Grid xs={4} >
                    <TextField
                        style={{ width: "100%" }}
                        disabled
                        label="Product ID"
                        variant="outlined"
                        value={state.policy}
                    />
                </Grid>
                {parentHierarchy && Object.keys(parentHierarchy).length > 0 && <Grid xs={8}>
                    <h5>Hierarchy of Parent Products</h5>
                    <div style={{width: "100%", display:"flex", justifyContent:"flex-start", flexDirection:"column"}}>
                        {parentHierarchy.reverse().map((policyObj, i) => 
                            <div 
                                style={{
                                    width:"auto", 
                                    height:"50px", 
                                    marginLeft:`${(i)*50}px`, 
                                    boxShadow:"0px 10px 20px rgba(38, 108, 194, 0.1)",
                                    display:"flex",
                                    alignItems:"center",
                                    padding:"0px 10px",
                                    borderRadius:"4px",
                                    marginBottom:"5px",
                                    background:`${policyObj && policyObj.id == state.policy ? "#AFD3FF" : "#FFFFFF"}`
                                }}
                            >
                                {policyObj && `${policyObj.insurer} - ${policyObj.product} - ${policyObj.variant} - ${policyObj.scheme} - ${policyObj.UIN} - ${policyObj.id}`}
                            </div>
                        )}
                    </div>
                </Grid>}
                {parentHierarchy && Object.keys(parentHierarchy).length > 0 && <Grid xs={4}>

                </Grid>}
                <Grid xs={3} >
                    <h4>
                        Product Subscription Id: {state.policy_number}
                    </h4>
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
                            onChange={(date) => setState({ ...state, inception_date: date })}
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

                    <Grid xs={3} >
                        <KeyboardDatePicker
                            margin="normal"
                            style={{ width: "90%", marginLeft: "5%" }}
                            id="date-picker-dialog"
                            label="Valid Till"
                            format="dd MMM yyyy"
                            value={state.valid_till}
                            onChange={(date) => setState({ ...state, valid_till: date })}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </Grid>
                </MuiPickersUtilsProvider>
            </Grid>

            <div style={{ textAlign: "center", marginBottom: "3%" }} >
                <Grid container >
                    <Grid xs={6}>
                        <Autocomplete
                            options={policyZones}
                            getOptionLabel={option => option.zone_title}
                            className="claim-inputs"
                            value={state.policy_zone ? policyZones.find(x => x._id === state.policy_zone) : { _id: "", zone_title: "" }}
                            onChange={(event, value) => {
                                console.log(value);
                                // console.log(value.id);
                                value && setState({ ...state, policy_zone: value._id });
                            }}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    placeholder="Select Product Zone"
                                    label="Product Zone"
                                />
                            )}
                        />
                    </Grid>
                    <Grid xs={3} >
                        Policy is Inforce {" "}
                        <Switch
                            checked={state.policy_is_inforce}
                            onChange={() => setState({ ...state, policy_is_inforce: !state.policy_is_inforce })}
                            uncheckedIcon={
                                <div className="claim-unchecked-icon" >
                                    NO
                                </div>
                            }
                            checkedIcon={
                                <div className="claim-checked-icon" >
                                    YES
                                </div>
                            }
                            onColor="#266CC2"
                            offColor="#505050"
                            className="react-switch"
                            id="icon-switch"
                        />
                    </Grid>
                    {
                        policyCriticalParams && policyCriticalParams.cover_types ?
                            <Grid xs={3}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Cover Type</FormLabel>
                                    <RadioGroup aria-label="coverType" name="coverType" value={state.cover_type ? state.cover_type : (policyCriticalParams.cover_types.floater ? 'floater' : 'individual')} onChange={(event) => setState({ ...state, cover_type: event.target.value })}>
                                        {policyCriticalParams.cover_types.floater && <FormControlLabel value="floater" control={<Radio color="primary" />} label="Floater" /> }
                                        {policyCriticalParams.cover_types.individual && <FormControlLabel value="individual" control={<Radio color="primary" />} label="Individual" /> }
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        : null
                    }
                    
                </Grid>
            </div>


            {/* <TextField
                type="number"
                variant="outlined"
                label="Sum insured Original"
                value={state.sum_insured_original}
                onChange={() => setState({ ...state, sum_insured_original: event.target.value })}
            /> */}
            <Grid container>

                {(policyCriticalParams && Object.keys(policyCriticalParams).length > 0 && policyCriticalParams.si_values && policyCriticalParams.si_values.length > 0) ?
                    <Autocomplete
                        options={policyCriticalParams && Object.keys(policyCriticalParams).length > 0 && policyCriticalParams.si_values ? policyCriticalParams.si_values : []}
                        // className="claim-inputs"
                        style={{ width: "20%", marginRight: "2%" }}
                        // freeSolo={(policyCriticalParams && Object.keys(policyCriticalParams).length > 0 && policyCriticalParams.si_values && policyCriticalParams.si_values.length > 0) ? false : true}
                        defaultValue={state.sum_insured_original}
                        // defaultValue={state.si_values}
                        onChange={(event, value) => {
                            console.log("SI should be ", value);
                            if (value) {
                                setState({ ...state, sum_insured_original: value })
                            } else {
                                setState({ ...state, sum_insured_original: null })
                            }
                        }}
                        renderInput={(params) => (
                            <TextField {...params} placeholder="SI Original" variant="outlined" InputProps={{ ...params.InputProps }} /> // FIXME: Update the textbox to "" when new options are loaded
                        )}
                    />
                    :
                    <TextField
                        type="number"
                        variant="outlined"
                        label="Sum insured Original"
                        style={{ marginRight: "2%" }}
                        value={state.sum_insured_original}
                        onChange={() => setState({ ...state, sum_insured_original: event.target.value })}
                    />
                }

                <TextField
                    // style={{ marginLeft: "5%" }}
                    type="number"
                    variant="outlined"
                    label="Sum insured"
                    style={{ marginRight: "2%" }}
                    value={state.sum_insured}
                    onChange={() => setState({ ...state, sum_insured: event.target.value })}
                />

                <TextField
                    // style={{ marginLeft: "5%" }}
                    type="number"
                    variant="outlined"
                    label="Voluntary Deductible"
                    style={{ marginRight: "2%" }}
                    value={state.voluntary_deductible}
                    onChange={() => setState({ ...state, voluntary_deductible: event.target.value })}
                />

                <TextField
                    // style={{ marginLeft: "5%" }}
                    type="number"
                    variant="outlined"
                    label="Mobile"
                    style={{ marginRight: "2%" }}
                    value={state.mobile_no}
                    onChange={() => setState({ ...state, mobile_no: event.target.value })}
                />

                <TextField
                    // style={{ marginLeft: "5%" }}
                    type="text"
                    variant="outlined"
                    label="IAPN"
                    style={{ marginRight: "2%" }}
                    value={state.IAPN}
                    onChange={() => setState({ ...state, IAPN: event.target.value })}
                    helperText="Insurer Alotted Policy Number"
                />

                {((policyCriticalParams && Object.keys(policyCriticalParams).length > 0 && policyCriticalParams.designations_added && policyCriticalParams.designations_added.length > 0) || (state.designation)) &&
                    <Autocomplete
                        options={policyCriticalParams && Object.keys(policyCriticalParams).length > 0 && policyCriticalParams.designations_added ? policyCriticalParams.designations_added : []}
                        style={{ width: "20%" }}
                        defaultValue={state.designation}
                        // defaultValue={state.si_values}
                        onChange={(event, value) => {
                            console.log("Designation should be ", value);
                            if (value) {
                                setState({ ...state, designation: value })
                            } else {
                                setState({ ...state, designation: null })
                            }
                        }}
                        renderInput={(params) => (
                            <TextField {...params} placeholder="Choose Designation" variant="outlined" InputProps={{ ...params.InputProps }} /> // FIXME: Update the textbox to "" when new options are loaded
                        )}
                    />}
            </Grid>



            <br />
            <br />

            <h3>Riders: </h3>
            {
                state.riders_chosen && state.riders_chosen.map((item, index) =>

                    <div
                        style={{
                            // border: "1px solid red",
                            padding: "1%",
                            marginBottom: "5%"
                        }}
                    >

                        <Grid container >


                            <Grid xs={8} >
                                <Autocomplete
                                    required
                                    options={policyRiderOptions}
                                    getOptionLabel={option => option.name ? option.name : ""}
                                    onChange={(event, value) => {
                                        let temp = { ...state };
                                        state.riders_chosen[index].rule_id = value.rule_id;
                                        state.riders_chosen[index].name = value.name;
                                        setState(temp);
                                    }}
                                    style={{ width: "90%" }}

                                    value={policyRiderOptions.find(x => x.rule_id === item.rule_id) ? policyRiderOptions.find(x => x.rule_id === item.rule_id) : { rule_id: "new", }}

                                    renderInput={params => (
                                        <TextField {...params} variant="outlined" placeholder="Enter Rider Name" InputProps={{ ...params.InputProps }} />
                                    )}
                                />

                            </Grid>

                            <Grid xs={2} >
                                <button
                                    onClick={() => {
                                        let temp = { ...state };
                                        temp.riders_chosen.splice(index, 1);
                                        setState(temp);
                                    }}
                                >
                                    DEL
                                </button>
                            </Grid>


                        </Grid>





                    </div>

                )
            }

            <button
                onClick={() => {
                    setState({
                        ...state, riders_chosen: [...state.riders_chosen, {

                        }]
                    })
                }}
            >
                +
            </button>




            <Autocomplete
                options={marital_statuses}
                getOptionLabel={option => option}
                className="claim-inputs"
                value={state.insured_marital_status}
                onChange={(event, value) => {
                    console.log(value);
                    // console.log(value.id);
                    value && setState({ ...state, insured_marital_status: value });
                }}
                style={{ marginTop: "5%" }}
                renderInput={params => (
                    <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Select Marital Status"
                        label="Insured Marital Status"
                    />
                )}
            />




            <h2>Lives</h2>

            {state.lives.map((life, index) =>
                <Grid
                    container
                    style={{
                        // marginLeft: "5%",
                        padding: "1%",
                        border: "1px solid red",
                        marginTop: "2%"
                    }}
                >
                    <Grid xs={2} >
                        <TextField
                            variant="outlined"
                            label="Name"
                            value={life.name}
                            onChange={() => {
                                let temp = [...state.lives];
                                temp[index].name = event.target.value;
                                setState({ ...state, lives: temp })
                            }}
                        />
                    </Grid>
                    <Grid xs={2} >
                        {
                            index === 0
                                ?
                                <div className="">Relationship <br /> Self </div>
                                :
                                <Autocomplete
                                    options={relationships}
                                    getOptionLabel={option => option}
                                    className="claim-inputs"
                                    value={life.relationship}
                                    onChange={(event, value) => {
                                        let temp = [...state.lives];
                                        temp[index].relationship = value;
                                        setState({ ...state, lives: temp })
                                    }}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Relationship"
                                        />
                                    )}
                                />
                        }
                    </Grid>
                    <Grid xs={3} >
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                margin="normal"
                                style={{ width: "100%" }}
                                id="date-picker-dialog"
                                label="Date of birth"
                                className="full-size-input-field"
                                format="dd MMM yyyy"
                                value={life.dob}
                                onChange={(date) => {
                                    let temp = [...state.lives];
                                    temp[index].dob = date;
                                    setState({ ...state, lives: temp })
                                }}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>

                    <Grid xs={2} style={{ marginTop: "3%" }} >
                        Gender: {" "}
                        <button
                            style={{ backgroundColor: life.gender === "male" && "#266CC2" }}
                            onClick={() => {
                                let temp = [...state.lives];
                                temp[index].gender = "male";
                                setState({ ...state, lives: temp });
                            }}
                        >
                            M
                        </button>
                        <button
                            style={{ backgroundColor: life.gender === "female" && "#266CC2" }}
                            onClick={() => {
                                let temp = [...state.lives];
                                temp[index].gender = "female";
                                setState({ ...state, lives: temp });
                            }}
                        >
                            F
                        </button>
                    </Grid>
                    <Grid xs={2} >
                        Member ID:
                        {" "}
                        <b>
                            {life.member_id}
                        </b>
                    </Grid>
                    {
                        index != 0
                            ?
                            <DeleteIcon
                                style={{ marginLeft: "5%", marginTop: "3%" }}
                                onClick={() => {
                                    let temp = [...state.lives];
                                    temp.splice(index, 1);
                                    setState({ ...state, lives: temp });
                                }}
                            />
                            :
                            <span style={{ marginLeft: "5%" }} ></span>
                    }
                    <Grid xs={2} >
                        <TextField
                            variant="outlined"
                            label="Add PEDs"
                            onKeyDown={(event) => {
                                if (event.key == "Enter" && event.target.value.length === 3 && !life.PED_ICDs.includes(event.target.value.toUpperCase())) {
                                    let temp = [...state.lives];
                                    temp[index].PED_ICDs.push(event.target.value.toUpperCase());
                                    setState({ ...state, lives: temp });
                                }
                            }}
                        />
                    </Grid>


                    <Grid xs={2} >
                        <h4 style={{ margin: 0, padding: 0, textAlign: "center" }} >PEDs</h4>
                        {life.PED_ICDs && life.PED_ICDs.join(", ")}
                    </Grid>

                    <Grid xs={2} >
                        <TextField
                            variant="outlined"
                            label="Add PE"
                            onKeyDown={(event) => {
                                if (event.key == "Enter" && event.target.value.length === 3 && !life.PE_ICDs.includes(event.target.value.toUpperCase())) {
                                    let temp = [...state.lives];
                                    temp[index].PE_ICDs.push(event.target.value.toUpperCase());
                                    setState({ ...state, lives: temp });
                                }
                            }}
                        />
                    </Grid>
                    <Grid xs={2} >
                        <h4 style={{ margin: 0, padding: 0, textAlign: "center" }} >PE</h4>
                        {life.PE_ICDs && life.PE_ICDs.join(", ")}
                    </Grid>


                    <Grid xs={2} >
                        <TextField
                            variant="outlined"
                            label="Add WP"
                            onKeyDown={(event) => {
                                if (event.key == "Enter" && event.target.value.length === 3 && !life.PE_ICDs.includes(event.target.value.toUpperCase())) {
                                    let temp = [...state.lives];
                                    temp[index].WP.push(event.target.value.toUpperCase());
                                    setState({ ...state, lives: temp });
                                }
                            }}
                        />
                    </Grid>
                    <Grid xs={2} >
                        <h4 style={{ margin: 0, padding: 0, textAlign: "center" }} >WP</h4>
                        {life.WP && life.WP.join(", ")}
                    </Grid>

                    <Grid xs={4} style={{ marginTop: "2%" }} >
                        <TextField
                            style={{ width: "100%" }}
                            variant="outlined"
                            label="Claimed Since Renewal"
                            value={life.claimed_since_renewal}
                            onChange={() => {
                                let temp = [...state.lives];
                                temp[index].claimed_since_renewal = event.target.value;
                                setState({ ...state, lives: temp });
                            }}
                        />
                    </Grid>

                    <Grid xs={4} style={{ marginTop: "2%" }} >
                        <TextField
                            style={{ width: "100%" }}
                            variant="outlined"
                            label="IAMI"
                            value={life.IAMI}
                            onChange={() => {
                                let temp = [...state.lives];
                                temp[index].IAMI = event.target.value;
                                setState({ ...state, lives: temp });
                            }}
                            helperText="Insurer Alotted Member ID"
                        />
                    </Grid>


                </Grid>
            )}

            <AddIcon
                onClick={() => setState({
                    ...state, lives: [...state.lives, {
                        name: "",
                        relationship: "",
                        member_id: faker.random.alphaNumeric(16).toUpperCase(),
                        gender: "",
                        dob: null,
                        PED_ICDs: [],
                        PE_ICDs: [],
                        WP: [],
                        claimed_since_renewal: "",
                        IAMI: "",
                    }]
                })}
            />
            <div>
                <button
                    className="primary-button"
                    onClick={() => {
                        // axios.post(urls.PREFIX + "subscription/new", state)
                        request('post', urls.PREFIX + "/subscriptions/new", state)
                            .then(function (response) {
                                console.log("Response", response);
                                console.log("Data", response.data);
                                browserRedirect("/retail/subscriptions");
                            })
                            .catch(function (error) {
                                console.log(error);
                            })
                    }}
                >
                    Create New Subscription (PN: {state.policy_number})
                </button>



                {
                    state.template_id
                        ?
                        <button
                            className="primary-button"
                            style={{
                                background: "#F90"
                            }}
                            onClick={() => {
                                confirmAlert({
                                    title: 'Confirm Overwrite',
                                    message: 'Are you sure you want to overwrite this enrollment.',
                                    buttons: [
                                        {
                                            label: 'Yes',
                                            onClick: () => {
                                                {
                                                    request('put', urls.PREFIX + "/subscriptions/" + state.template_id,
                                                        {
                                                            ...state,
                                                            _id: state.template_id,
                                                            policy_number: state.template_policy_number,
                                                        }
                                                    )
                                                        .then(response => {
                                                            toast.success(response.data.message, { autoClose: 4000 });
                                                            browserRedirect("/retail/subscriptions");

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
                            Overwrite Existing Subscription (_id: {state.template_id}, PN: {state.template_policy_number})
                        </button>

                        :
                        null
                }


            </div>

        </div>
    );
}

export default RetailCreateSubscription;








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