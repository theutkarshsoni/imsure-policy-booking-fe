/*
 * TPA Login
 */

import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import { makeSelectLoading, makeSelectError } from 'containers/App/selectors';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Saga calls
import reducer from './reducer';
import saga from './saga';
import { tpaLoginRequest, tpaLoginPageInit } from './actions';
import { makeSelectTPALogin } from './selectors';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';

const key = 'tpaLogin';

import './tpaLogin.css';

export function TPALogin({
    loading,
    tpaLogin,
    error,
    onTPALogin,
    onPageInit
}) {

    useInjectReducer({ key, reducer });
    useInjectSaga({ key, saga });

    const onSubmit = (data) => {
        console.log('submitted data', data);
        onTPALogin(data);
    }

    return (
        <>
            <ToastContainer />
            <div className='tpa_login_container'>
                <div className='head_container title'>Login</div>
                <h6 className='large-bold-font'>Welcome to Imsure</h6>
                <br />
                <Formik
                    initialValues={{ email: '', password: '' }}
                    onSubmit={onSubmit}
                    validationSchema={
                        Yup.object().shape({
                            email: Yup.string()
                                .email('Enter a valid email address')
                                .required('Email address is required.'),
                            password: Yup.string()
                                .required('Password is required.'),
                        })
                    }
                >
                    {props => {
                        const {
                            values,
                            touched,
                            errors,
                            isValid,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                        } = props;
                        return (
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <TextField
                                        id="email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        variant="outlined"
                                        placeholder="Enter your email address"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <PersonOutlineIcon style={{ color: '#CDCDCD' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {errors.email && touched.email && (
                                        <div className="input-feedback">
                                            {errors.email}
                                        </div>
                                    )}
                                </div>
                                <br />
                                <div className="form-group">
                                    <TextField
                                        id="password"
                                        type='password'
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        variant="outlined"
                                        placeholder="Enter your Password"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <VisibilityOffIcon style={{ color: '#CDCDCD' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {errors.password && touched.password && (
                                        <div className="input-feedback">
                                            {errors.password}
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="primary-button"
                                    style={{ marginTop: '50px', width: '150px' }}
                                >
                                    LOGIN
                                </button>
                            </form>
                        );
                    }}
                </Formik>
            </div>
        </>
    );
}

TPALogin.propTypes = {
    loading: PropTypes.bool,
    onTPALogin: PropTypes.func,
    onPageInit: PropTypes.func,
    tpaLogin: PropTypes.object,
    error: PropTypes.object
};

const mapStateToProps = createStructuredSelector({
    tpaLogin: makeSelectTPALogin(),
    loading: makeSelectLoading(),
    error: makeSelectError(),
});

export function mapDispatchToProps(dispatch) {
    return {
        onTPALogin: evt => {
            if (evt !== undefined && evt.preventDefault) evt.preventDefault();
            console.log('event called', evt);
            dispatch(tpaLoginRequest(evt));
        },
        onPageInit: dispatch(tpaLoginPageInit()),
    };
}

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
);

export default compose(
    withConnect,
    memo,
)(withRouter(TPALogin));