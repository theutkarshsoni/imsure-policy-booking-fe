import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Grid, TextField, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Link, useParams } from 'react-router-dom';
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


import Switch from 'react-switch';



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

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


// import CancelIcon from '@mui/icons-material/Cancel';

// import DeleteIcon from '@material-ui/icons/Delete';










import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools"














// import Editor from 'react-simple-code-editor';
// import { highlight, languages } from 'prismjs/components/prism-core';
// import 'prismjs/components/prism-clike';
// import 'prismjs/components/prism-javascript';








// import CodeEditor from '@uiw/react-textarea-code-editor';





function RuleDetails({
    history,
    error,
    onSubmitForm,
    onInitialize,
    data,
    verificationResponse
}) {



    const routeParams = useParams();
    const { rule_id } = routeParams;
    console.log("rule_id: ", rule_id);

    const [choice, setChoice] = React.useState('');


    const [state, setState] = useState({

        name: "",
        r_type: "",
        code: "",
        description: "",

        params: [],

        computation_code: `function add(a, b) {
            return a + b;
          }
          `,


    });
    console.log("state: ", state);


    function getRuleDetailsCall() {
        request('get', urls.PREFIX + "/rules/" + rule_id)
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


        if (rule_id != "new") {
            getRuleDetailsCall();
        }


    }, []);

    const classes = useStyles();


    function truncate(str, n) {
        return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
    };


    const property_path_options = [
        "policy_subscription.sum_insured",
        "incident.claim.billing_estimate.total"
    ]


    const r_type_options = [
        {
            label: "Pre Eligibility",
            value: "pre_eligibility",
        },
        {
            label: "Eligibility",
            value: "eligibility",
        },
        {
            label: "Post Eligibility",
            value: "post_eligibility",
        },
        {
            label: "Pre Tarrif Deduction",
            value: "pre_tarrif_deductions",
        },
        {
            label: "Tarrif Deduction",
            value: "tarrif_deductions",
        },
        {
            label: "Post Tarrif Deduction",
            value: "post_tarrif_deductions",
        },
        {
            label: "Pre chargeheads",
            value: "pre_chargeheads",
        },
        {
            label: "chargeheads",
            value: "chargeheads",
        },
        {
            label: "Post chargeheads",
            value: "post_chargeheads",
        },
        {
            label: "Pre Deductions",
            value: "pre_deductions",
        },
        {
            label: "Deductions",
            value: "deductions",
        },
        {
            label: "Post Deductions",
            value: "post_deductions",
        },
        {
            label: "Pre copay",
            value: "pre_copay",
        },
        {
            label: "copay",
            value: "copay",
        },
        {
            label: "Post copay",
            value: "post_copay",
        },
        {
            label: "Pre sublimits",
            value: "pre_sublimits",
        },
        {
            label: "sublimits",
            value: "sublimits",
        },
        {
            label: "Post sublimits",
            value: "post_sublimits",
        },
        {
            label: "Pre SI_balance",
            value: "pre_SI_balance",
        },
        {
            label: "SI_balance",
            value: "SI_balance",
        },
        {
            label: "Post SI_balance",
            value: "post_SI_balance",
        },
    ]

    return (

        <Card className='web_form_container' style={{ marginTop: "2%" }} >


            <div className="head_container title" style={{ marginTop: "2%" }}>Rule: {state.name}</div>


            <Grid container>



                <Grid xs={4}>

                    {

                        <button className="primary-button" style={{ cursor: 'pointer' }} onClick={() => {
                            history.goBack();

                        }} >
                            Back
                        </button>

                    }

                </Grid>


                <Grid xs={4}>

                    {

                        <button className="primary-button" style={{ cursor: 'pointer' }} onClick={() => {

                            confirmAlert({
                                title: 'Confirm Save',
                                message: 'Are you sure you want to save the changes. This is an irreverible change and is very important in the functioning of products.',
                                buttons: [
                                    {
                                        label: 'Yes',
                                        onClick: () => {


                                            if (rule_id === "new") {
                                                request('post', urls.PREFIX + "/rules/", state)
                                                    .then(function (response) {
                                                        console.log("Response", response);
                                                        console.log("Data", response.data);
                                                        browserRedirect("/rules");
                                                    })
                                                    .catch(function (error) {
                                                        console.log(error);
                                                    })
                                            }
                                            else {
                                                request('put', urls.PREFIX + "/rules/" + rule_id, state)
                                                    .then(function (response) {
                                                        console.log("Response", response);
                                                        console.log("Data", response.data);
                                                        browserRedirect("/rules");
                                                    })
                                                    .catch(function (error) {
                                                        console.log(error);
                                                    })
                                            }

                                        }
                                    },
                                    {
                                        label: 'No',
                                        // onClick: () => alert('Click No')
                                    }
                                ]
                            });


                        }} >
                            Save Changes
                        </button>

                    }

                </Grid>

            </Grid>


            <div style={{ textAlign: "center" }} >
                <Grid container style={{ marginTop: "2%" }} >
                    <Grid xs={6}>
                        <TextField
                            variant="outlined"
                            label="Name"
                            value={state.name}
                            onChange={() => setState({ ...state, name: event.target.value })}

                            style={{ width: "90%" }}
                        />
                    </Grid>

                    <Grid xs={3}>
                        <TextField
                            variant="outlined"
                            label="Code"
                            value={state.code}
                            onChange={() => setState({ ...state, code: event.target.value })}

                            style={{ width: "90%" }}
                        />
                    </Grid>


                    <Grid xs={3}>

                        <Autocomplete
                            options={
                                // ["eligibility", "tariff_deduction", "chargeheads", "deductions", "copay", "sublimits", "SI_balance"]
                                r_type_options
                            }
                            getOptionLabel={option =>
                                option.label
                            }
                            className="claim-inputs"
                            onChange={(event, value) => {

                                value && setState({ ...state, r_type: value.value })

                            }}


                            value={r_type_options.find(x => x.value === state.r_type) ? r_type_options.find(x => x.value === state.r_type) : { label: "" }}


                            renderInput={params => (
                                <TextField
                                    {...params}
                                    className="full-size-input-field"
                                    variant="outlined"
                                    label="Enter Type"
                                    placeholder="Enter Type here"
                                    InputProps={{ ...params.InputProps }}
                                />
                            )}
                        />

                    </Grid>





                </Grid>



                <br />

                <Grid container>

                    {/* <Grid xs={} >
                    </Grid> */}


                    <Grid xs={2} >
                        <h3>Is Rider</h3>
                    </Grid>

                    <Grid xs={3}>



                        <button
                            className={
                                state.can_be_rider
                                    ?
                                    "primary-button"
                                    :
                                    "primary-button back-btn"
                            }
                            onClick={() => {
                                setState({ ...state, can_be_rider: true });
                            }}
                        >
                            True
                        </button>
                    </Grid>
                    <Grid xs={3} >

                        <button
                            className={
                                !state.can_be_rider
                                    ?
                                    "primary-button"
                                    :
                                    "primary-button back-btn"
                            }
                            onClick={() => {
                                setState({ ...state, can_be_rider: false })
                            }}
                        >
                            False
                        </button>

                    </Grid>

                </Grid>


                <br />




                <Grid container style={{ marginTop: "2%" }} >

                    <Grid xs={12}>
                        <TextField
                            variant="outlined"
                            label="Description"
                            value={state.description}
                            onChange={() => setState({ ...state, description: event.target.value })}

                            style={{ width: "90%" }}
                        />

                    </Grid>



                    <Grid xs={12}>
                        <TextField
                            variant="outlined"
                            label="Internal Message"
                            value={state.internal_message}
                            onChange={() => setState({ ...state, internal_message: event.target.value })}

                            style={{ width: "90%" }}
                        />

                    </Grid>

                    <Grid xs={12}>
                        <TextField
                            variant="outlined"
                            label="External Message"
                            value={state.external_message}
                            onChange={() => setState({ ...state, external_message: event.target.value })}

                            style={{ width: "90%" }}
                        />

                    </Grid>

                </Grid>


                <br />
                <br />
                <br />





                <h3>Params</h3>

                {
                    state && state.params && state.params.map((item, index) =>

                        <div style={{ marginTop: "2%" }}>


                            <Grid container style={{ border: "1px solid red", padding: "10px" }} >

                                <Grid xs={6} >
                                    <TextField
                                        variant="outlined"
                                        label="Name"
                                        value={item.name}
                                        onChange={() => {
                                            let temp = { ...state };
                                            temp.params[index].name = event.target.value;
                                            setState(temp);
                                        }}

                                        style={{ width: "90%" }}
                                    />
                                </Grid>


                                <Grid xs={6}>
                                    <Autocomplete
                                        options={
                                            ["Number", "String", "Array", "Anything"]
                                        }
                                        getOptionLabel={option =>
                                            option
                                        }
                                        className="claim-inputs"
                                        onChange={(event, value) => {
                                            let temp = { ...state };
                                            temp.params[index].p_type = value;
                                            setState(temp);
                                        }}


                                        value={item.p_type}


                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                className="full-size-input-field"
                                                variant="outlined"
                                                label="Enter Type"
                                                placeholder="Enter Type here"
                                                InputProps={{ ...params.InputProps }}
                                            />
                                        )}
                                    />

                                </Grid>



                            </Grid>

                        </div>
                    )
                }

                <button className="primary-button" onClick={() => setState({
                    ...state, params: [...state.params, {
                        name: "",
                        p_type: "",

                    }]
                })} >
                    +
                </button>


                <br />
                <br />
                <br />


                <h3>Computation Code</h3>


                {/* <AceEditor
                    mode="js"
                    theme="github"
                    onChange={(value) => {

                        value && setState({ ...state, computation_code: value });

                    }}
                    name="computation_code"
                    editorProps={{ $blockScrolling: true }}
                /> */}


                {/* <AceEditor
                    mode="javascript"
                    theme="github"
                    onChange={(value) => {

                        value && setState({ ...state, computation_code: value });

                    }}
                    value={state.computation_code}
                    name="computation_code"
                    editorProps={{ $blockScrolling: true }}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true
                    }}
                /> */}


                <AceEditor
                    // placeholder="Placeholder Text"
                    style={{ width: "100%" }}
                    mode="javascript"
                    theme="monokai"
                    name="blah2"
                    // onLoad={this.onLoad}
                    onChange={(value) => {

                        console.log("value:", value);

                        value && setState({ ...state, computation_code: value });

                    }}
                    fontSize={14}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    value={state.computation_code}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true,
                        showLineNumbers: true,
                        tabSize: 2,
                    }} />





                {/* <Editor
                    value={state.computation_code}
                    onValueChange={code => setState({ ...state, computation_code: code })}
                    highlight={code => highlight(code, languages.js)}
                    padding={10}
                    style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        fontSize: 12,
                    }}
                /> */}






                {/* <CodeEditor
                    value={state.computation_code}
                    language="js"
                    placeholder="Please enter JS code."
                    onChange={(evn) => setState({ ...state, computation_code: evn.target.value })}
                    padding={15}
                    style={{
                        fontSize: 12,
                        backgroundColor: "#f5f5f5",
                        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                    }}
                /> */}





            </div>



        </Card >
    );
}

export default RuleDetails;

