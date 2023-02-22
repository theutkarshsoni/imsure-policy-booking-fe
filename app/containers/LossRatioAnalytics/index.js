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





function LossRatioAnalytics({
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


    function getLossRatioAnalyticsCall() {
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
            getLossRatioAnalyticsCall();
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



            <h1>&nbsp; &nbsp; I'm Hungry. Give me DATA..</h1>


        </Card >
    );
}

export default LossRatioAnalytics;

