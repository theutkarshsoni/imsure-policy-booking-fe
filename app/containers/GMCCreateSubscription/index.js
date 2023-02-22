import React, { useState, useEffect } from 'react';
const faker = require('faker');

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, Grid, Dialog, DialogTitle, List, ListItem, ListItemText, Checkbox } from '@material-ui/core';

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

function GMCCreateSubscription(props) {

    const classes = useStyles();

    const [options, setOptions] = useState({
        policies: [],
        subscriptions: [],
    });
    // Policy configs not options. Need to rename later


    // const [subscriptions, setSubscriptions] = useState([]);

    const [policyZones, setPolicyZones] = useState([]);
    console.log("policyZones: ", policyZones);


    const [policyRiderOptions, setPolicyRiderOptions] = useState([]);
    console.log("policyRiderOptions: ", policyRiderOptions);

    const [morbidity, setMorbidity] = useState([]);
    console.log("morbidity: ", morbidity);

    useEffect(() => {
        // axios.get(urls.PREFIX)
        request('get', urls.PREFIX + "/subscriptions/gad")
            .then(function (response) {
                console.log("Response", response);
                console.log("Data", response.data);
                // setOptions(response.data.data.policies);
                setOptions(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            })
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


    function getPolicyZonesCall(policy_id) {
        request('get', urls.PC_PREFIX + "/policyconfig/" + policy_id + "/details/zones")
            .then(function (response) {
                console.log("Response", response);
                console.log("Data", response.data);
                const response_zones = response.data.data;
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
                setPolicyRiderOptions(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    function getPolicyMorbidityCall(policy_id) {
        request('get', urls.PC_PREFIX + "/policyconfig/" + policy_id + "/details/morbidity")
            .then(function (response) {
                console.log("Response", response);
                console.log("Data", response.data);
                // const response_zones = response.data.data;
                // const checked_zones = response_zones.filter(item => item.checkbox.indexOf("TRUE") !== -1);
                // setPolicyOptions(response.data.data);
                setMorbidity(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    return (
        <div>

            <ToastContainer />

            <h1
                style={{ textAlign: "center" }}
            >
                Create Subscription
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

                <List>
                    {options && options.subscriptions && options.subscriptions.map(subscription =>
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
                                        // getPolicyMorbidityCall(response_data.policy);
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

            </Dialog>



            {/* {console.log({ id: state.policy, label: "" })} */}
            {/* {console.log({ id: options.policies.find(x => x.id === state.policy) })} */}

            <Grid container >
                <Grid xs={8} >
                    <Autocomplete
                        options={options.policies}
                        getOptionLabel={option => option.label}
                        className="claim-inputs"
                        value={state.policy ? options.policies.find(x => x.id === state.policy) : { policy: "", label: "" }}
                        onChange={(event, value) => {
                            console.log("value: ", value);
                            // console.log(value.id);

                            value && setState({ ...state, policy: value.id });

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

                                getPolicyMorbidityCall(value.id);

                            }
                        }}
                        renderInput={params => (
                            <TextField
                                {...params}
                                variant="outlined"
                                placeholder="Select Policy"
                                label="Policy"
                            />
                        )}
                    />
                </Grid>
                <Grid xs={4} >
                    <TextField
                        style={{ width: "100%" }}
                        disabled
                        label="Policy ID"
                        variant="outlined"
                        value={state.policy}
                    />
                </Grid>
                <Grid xs={3} >
                    <h4>
                        New Policy Number: {state.policy_number}
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
                                    placeholder="Select Policy Zone"
                                    label="Policy Zone"
                                />
                            )}
                        />
                    </Grid>
                    <Grid xs={6} >
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
                </Grid>
            </div>


            <TextField
                // style={{ marginLeft: "5%" }}
                // type="number"
                style={{ width: "100%" }}
                variant="outlined"
                label="Key Modifications"
                value={state.key_modifications}
                onChange={() => setState({ ...state, key_modifications: event.target.value })}
            />

            <br />

            <TextField
                // style={{ marginLeft: "5%" }}
                // type="number"
                variant="outlined"
                label="Corporate Name"
                style={{ width: "100%" }}
                value={state.corporate_name}
                onChange={() => setState({ ...state, corporate_name: event.target.value })}
            />



            {/* <TextField
                type="number"
                variant="outlined"
                label="Sum insured Original"
                value={state.sum_insured_original}
                onChange={() => setState({ ...state, sum_insured_original: event.target.value })}
            />

            <TextField
                // style={{ marginLeft: "5%" }}
                type="number"
                variant="outlined"
                label="Sum insured"
                value={state.sum_insured}
                onChange={() => setState({ ...state, sum_insured: event.target.value })}
            />

            <TextField
                // style={{ marginLeft: "5%" }}
                type="number"
                variant="outlined"
                label="Voluntary Deductible"
                value={state.voluntary_deductible}
                onChange={() => setState({ ...state, voluntary_deductible: event.target.value })}
            />

            <TextField
                // style={{ marginLeft: "5%" }}
                type="number"
                variant="outlined"
                label="Mobile"
                value={state.mobile_no}
                onChange={() => setState({ ...state, mobile_no: event.target.value })}
            /> */}




            {/* <br /> */}
            {/* <br /> */}


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




            <br />


            <br />


            <div className={"table_container_web"}>
                <div className={"table_div_web"}>
                    <table className={"table_web"} style={{ textAlign: "center" }} >

                        <tr className="bill_header_row">
                            {/* <th rowspan="2" className={"bill_table_head"}>
                                     <Checkbox
                                        checked
                                        name={"table_head"}
                                        color="primary"
                                    /></th> */}

                            <th className={"bill_table_head"}
                            // style={{ width: "25%" }}
                            >
                                Min Age
                            </th>

                            <th className={"bill_table_head"}
                            // style={{ width: "25%" }}
                            >
                                Max Age
                            </th>

                            <th className={"bill_table_head"}
                            // style={{ width: "25%" }}
                            >
                                Male Premium per lakh of SI
                            </th>
                            <th className={"bill_table_head"}
                            // style={{ width: "25%" }}
                            >
                                Male Count
                            </th>


                            <th className={"bill_table_head"}
                            // style={{ width: "25%" }}
                            >
                                Female Premium per lakh of SI
                            </th>

                            <th className={"bill_table_head"}
                            // style={{ width: "25%" }}
                            >
                                Count
                            </th>

                            {/* <th
                                    rowspan="2" className={"bill_table_head"} style={{ width: "25%" }}>Ailment</th>
                                <th
                                    colspan="3" className={"bill_table_head"}> Per Claim </th>
                                <th
                                    colspan="3" className={"bill_table_head"}> Per Life Per Year </th>
                                <th
                                    colspan="3" className={"bill_table_head"}> Per Family Per Year </th>

                                    */}


                            {/* <th
                                // rowspan="2" 
                                className={"bill_table_head"}>

                                <DeleteIcon />
                            </th> */}


                        </tr>
                        {/* <tr className="bill_header_row">
                                <th className={"bill_table_head"}> Absolute </th>
                                <th className={"bill_table_head"}> % of SI </th>
                                <th className={"bill_table_head"}> Lo/Hi </th>
                                <th className={"bill_table_head"}> Absolute </th>
                                <th className={"bill_table_head"}> % of SI </th>
                                <th className={"bill_table_head"}> Lo/Hi </th>
                                <th className={"bill_table_head"}> Absolute </th>
                                <th className={"bill_table_head"}> % of SI </th>
                                <th className={"bill_table_head"}> Lo/Hi </th>
                            </tr> */}



                        {/* <tr className="bill_header_row">
                <th className={"bill_table_head"}>
                  <Checkbox
                    checked
                    name={"table_head"}
                    color="primary"
                  /></th>
                {
                  ailmentLabels.map((item, index) => {
                    return (
                      <th className={"bill_table_head"}>{item}</th>
                    )
                  })}
              </tr> */}



                        {
                            morbidity && morbidity.map((item, index) => {
                                return (
                                    <tr className={index % 2 === 0 ? "bill_table_content_row_even" : 'bill_table_content_row_odd'}>
                                        {/* {isSummary ? null : */}

                                        <td className="td-zones">
                                            {item.min_age}
                                        </td>

                                        <td className="td-zones">
                                            {item.max_age}
                                        </td>

                                        <td className="td-zones">
                                            {item.male_premium}
                                        </td>

                                        <td className="td-zones">
                                            {false ? <><span style={{ color: "red" }} >{item.male_count}</span></> :
                                                // <div className="sublimit-amount-div">
                                                <TextField
                                                    required
                                                    placeholder="Enter Male Count"
                                                    // type='number'
                                                    value={item.male_count}
                                                    // InputProps={{
                                                    //     disableUnderline: true,
                                                    //     classes,
                                                    //     // startAdornment: (
                                                    //     //     <InputAdornment position="end">
                                                    //     //         ₹
                                                    //     //     </InputAdornment>
                                                    //     // ),
                                                    // }}
                                                    onChange={() => {
                                                        let temp = [...morbidity];
                                                        temp[index].male_count = event.target.value;
                                                        setState(temp);
                                                    }}
                                                />
                                                // </div>
                                            }
                                        </td>

                                        <td className="td-zones">
                                            {item.female_premium}
                                        </td>

                                        <td className="td-zones">
                                            {false ? <><span style={{ color: "red" }} >{item.female_count}</span></> :
                                                // <div className="sublimit-amount-div">
                                                <TextField
                                                    required
                                                    placeholder="Enter Female Count"
                                                    // type='number'
                                                    value={item.female_count}
                                                    // InputProps={{
                                                    //     disableUnderline: true,
                                                    //     classes,
                                                    //     // startAdornment: (
                                                    //     //     <InputAdornment position="end">
                                                    //     //         ₹
                                                    //     //     </InputAdornment>
                                                    //     // ),
                                                    // }}
                                                    onChange={() => {
                                                        let temp = [...morbidity];
                                                        temp[index].female_count = event.target.value;
                                                        setState(temp);
                                                    }}
                                                />
                                                // </div>
                                            }
                                        </td>






                                        {/* <td
                                            className="td-zones"
                                        >


                                            <DeleteIcon style={{ cursor: 'pointer', color: "#266CC2" }} onClick={() => {
                                                let temp = [...state];
                                                temp.splice(index, 1);
                                                setState(temp);
                                            }} />

                                        </td> */}




                                    </tr>
                                )
                            })}

                        {/* <tr
                        // style={{ border: "none" }}
                        >
                            <button
                                onClick={() => {
                                    setState([
                                        ...state, {
                                            min_age: "",
                                            max_age: "",
                                            male_premium: "",
                                            female_premium: "",
                                        }
                                    ])
                                }}
                            >
                                +
                            </button>
                        </tr> */}

                    </table>
                </div>
            </div>

            <br />
            <br />




            <Grid container style={{ marginTop: "1%" }} >

                <Grid xs={3} >
                    <TextField
                        // style={{ marginLeft: "5%" }}
                        // type="number"
                        style={{ width: "100%" }}
                        variant="outlined"
                        label="VIP Rating"
                        value={state.VIP_rating}
                        onChange={() => setState({ ...state, VIP_rating: event.target.value })}
                    />
                </Grid>

                <Grid xs={3} >
                    <TextField
                        // style={{ marginLeft: "5%" }}
                        // type="number"
                        style={{ width: "100%" }}
                        variant="outlined"
                        label="Amount Received"
                        value={state.amount_received}
                        onChange={() => setState({ ...state, amount_received: event.target.value })}
                    />
                </Grid>

                <Grid xs={3} >
                    <TextField
                        // style={{ marginLeft: "5%" }}
                        // type="number"
                        style={{ width: "100%" }}
                        variant="outlined"
                        label="Amount Utilized"
                        value={state.amount_utilized}
                        onChange={() => setState({ ...state, amount_utilized: event.target.value })}
                    />
                </Grid>

                <Grid xs={3} >
                    <TextField
                        // style={{ marginLeft: "5%" }}
                        // type="number"
                        style={{ width: "100%" }}
                        variant="outlined"
                        label="Amount Balance"
                        value={state.amount_balance}
                        onChange={() => setState({ ...state, amount_balance: event.target.value })}
                    />
                </Grid>

            </Grid>


            <Grid container style={{ marginTop: "1%" }} >

                <Grid xs={3} >
                    <TextField
                        // style={{ marginLeft: "5%" }}
                        // type="number"
                        style={{ width: "100%" }}
                        variant="outlined"
                        label="Credit Available"
                        value={state.credit_available}
                        onChange={() => setState({ ...state, credit_available: event.target.value })}
                    />
                </Grid>

                <Grid xs={3} >
                    <TextField
                        // style={{ marginLeft: "5%" }}
                        // type="number"
                        style={{ width: "100%" }}
                        variant="outlined"
                        label="Credit Utilized"
                        value={state.credit_utilized}
                        onChange={() => setState({ ...state, credit_utilized: event.target.value })}
                    />
                </Grid>

                <Grid xs={3} >
                    <TextField
                        // style={{ marginLeft: "5%" }}
                        // type="number"
                        style={{ width: "100%" }}
                        variant="outlined"
                        label="Credit Balance"
                        value={state.credit_balance}
                        onChange={() => setState({ ...state, credit_balance: event.target.value })}
                    />
                </Grid>

                <Grid xs={3} >
                    <TextField
                        // style={{ marginLeft: "5%" }}
                        // type="number"
                        style={{ width: "100%" }}
                        variant="outlined"
                        label="Amount + Credit Balance"
                        value={state.amount_plus_credit_balance}
                        onChange={() => setState({ ...state, amount_plus_credit_balance: event.target.value })}
                    />
                </Grid>

            </Grid>



            <Grid container style={{ marginTop: "1%" }} >

                <Grid xs={3} >
                    <TextField
                        // style={{ marginLeft: "5%" }}
                        // type="number"
                        style={{ width: "100%" }}
                        variant="outlined"
                        label="Contact Person's Name"
                        value={state.contact_person_name}
                        onChange={() => setState({ ...state, contact_person_name: event.target.value })}
                    />
                </Grid>

                <Grid xs={3} >
                    <TextField
                        // style={{ marginLeft: "5%" }}
                        // type="number"
                        style={{ width: "100%" }}
                        variant="outlined"
                        label="Contact Person's Mobile"
                        value={state.contact_person_mobile}
                        onChange={() => setState({ ...state, contact_person_mobile: event.target.value })}
                    />
                </Grid>

                <Grid xs={3} >
                    <TextField
                        // style={{ marginLeft: "5%" }}
                        // type="number"
                        style={{ width: "100%" }}
                        variant="outlined"
                        label="Contact Person's Email"
                        value={state.contact_person_email}
                        onChange={() => setState({ ...state, contact_person_email: event.target.value })}
                    />
                </Grid>

                <Grid xs={3} >
                    <TextField
                        // style={{ marginLeft: "5%" }}
                        // type="number"
                        style={{ width: "100%" }}
                        variant="outlined"
                        label="Additional Notes"
                        multiline
                        maxRows={3}
                        value={state.additional_notes}
                        onChange={() => setState({ ...state, additional_notes: event.target.value })}
                    />
                </Grid>

            </Grid>




            {/* <Autocomplete
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
                    }]
                })}
            /> */}



            <div>
                <button
                    className="primary-button"
                    onClick={() => {
                        // axios.post(urls.PREFIX + "subscription/new", state)
                        request('post', urls.PREFIX + "/subscriptions/new", state)
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
                            Overwrite Existing Subscription (_id: {state.template_id}, PN: {state.template_policy_number})
                        </button>

                        :
                        null
                }


            </div>

        </div>
    );
}

export default GMCCreateSubscription;








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