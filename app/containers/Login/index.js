/*
 * Login
 */

import React, { useState, useEffect, memo } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import './login.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { urls } from '../../config/urls';

import { browserRedirect } from '../../helpers/helpers';

import sha256 from 'sha256'

export function Login() {

    const [state, setState] = useState({
        email: "",
        password: "",
    })

    const [showPassword, setShowPassword] = useState(false);

    // useEffect(() => {
    //     let person = prompt("Please enter password to access this page:");
    //     if (person !== "dev@cz") {
    //         browserRedirect("/");
    //     }
    // }, []);

    function loginCall() {
        const payload = { email: state.email, password: sha256(state.password) };
        console.log("payload: ", payload);
        axios.post(urls.TPA_COMMON + "/sessions", payload)
            .then(response => {
                localStorage.setItem("token", response.data.data);
                browserRedirect('/');
            })
            .catch(error => {
                console.log(error);
                console.log(error.response);
                if (error.response.data.e) {
                    toast.error(error.response.data.e);
                }
            })
    }

    return (
        <div
            className='login_container'
        // style={{ marginLeft: "25%" }}
        >
            <ToastContainer />
            <div className='head_container title' style={{ marginBottom: '20px' }}>
                Login
            </div>
            <div className='large-bold-font' style={{ marginBottom: '50px' }}>
                Welcome to ClaimZippy
                <br />
                Policy Booking Console
            </div>
            <div className="form-group">
                <TextField
                    id="username"
                    required
                    // onChange={handleChange}
                    // onBlur={handleBlur}
                    //defaultValue={values.mobile}
                    variant="outlined"
                    placeholder="Enter your Email"
                    onChange={() => setState({ ...state, email: event.target.value })}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <PersonOutlineIcon style={{ color: '#CDCDCD' }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
            <div className="form-group" style={{ marginTop: '20px' }}>
                <TextField
                    id="password"
                    required
                    type={showPassword ? "text" : "password"}
                    onChange={() => setState({ ...state, password: event.target.value })}
                    style={{ margin: '0px' }}
                    // onBlur={handleBlur}
                    //defaultValue={values.mobile}
                    onKeyDown={() => event.key === "Enter" && loginCall()}
                    variant="outlined"
                    placeholder="Enter your Password"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end" onClick={() => setShowPassword(!showPassword)} >
                                {
                                    showPassword
                                        ?
                                        <VisibilityIcon style={{ color: '#CDCDCD' }} />
                                        :
                                        <VisibilityOffIcon style={{ color: '#CDCDCD' }} />
                                }
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
            <button
                disabled={!(state.email && state.password)}
                type="submit"
                className="primary-button"
                onClick={loginCall}
                style={{ marginTop: '50px', width: '150px' }}
            >
                LOGIN
            </button>
        </div>
    );
}

export default Login;






















// /*



//  * Login
//  */

// import React, { useState, useEffect, memo } from 'react';
// import { connect } from 'react-redux';
// import { compose } from 'redux';
// import TextField from '@material-ui/core/TextField';
// import InputAdornment from '@material-ui/core/InputAdornment';
// import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
// import VisibilityIcon from '@material-ui/icons/Visibility';
// import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
// import './adminLogin.css';

// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import axios from 'axios';
// import { urls } from '../../config/urls';

// import { browserRedirect } from '../../helpers/helpers';

// export function AdminLogin() {

//     const [state, setState] = useState({
//         email: "",
//         password: "",
//     })

//     const [showPassword, setShowPassword] = useState(false);

//     return (
//         <div className='login_container' style={{ marginLeft: "25%" }} >
//             <ToastContainer />
//             <div className='head_container title' style={{ marginBottom: '20px' }}>
//                 Login
//             </div>
//             <div className='large-bold-font' style={{ marginBottom: '50px' }}>
//                 Welcome to Imsure
//             </div>
//             <div className="form-group">
//                 <TextField
//                     id="username"
//                     required
//                     // onChange={handleChange}
//                     // onBlur={handleBlur}
//                     //defaultValue={values.mobile}
//                     variant="outlined"
//                     placeholder="Enter your Username"
//                     onChange={() => setState({ ...state, email: event.target.value })}
//                     InputProps={{
//                         endAdornment: (
//                             <InputAdornment position="end">
//                                 <PersonOutlineIcon style={{ color: '#CDCDCD' }} />
//                             </InputAdornment>
//                         ),
//                     }}
//                 />
//             </div>
//             <div className="form-group" style={{ marginTop: '20px' }}>
//                 <TextField
//                     id="password"
//                     required
//                     type={showPassword ? "text" : "password"}
//                     onChange={() => setState({ ...state, password: event.target.value })}
//                     style={{ margin: '0px' }}
//                     // onBlur={handleBlur}
//                     //defaultValue={values.mobile}
//                     variant="outlined"
//                     placeholder="Enter your Password"
//                     InputProps={{
//                         endAdornment: (
//                             <InputAdornment position="end" onClick={() => setShowPassword(!showPassword)} >
//                                 {
//                                     showPassword
//                                         ?
//                                         <VisibilityIcon style={{ color: '#CDCDCD' }} />
//                                         :
//                                         <VisibilityOffIcon style={{ color: '#CDCDCD' }} />
//                                 }
//                             </InputAdornment>
//                         ),
//                     }}
//                 />
//             </div>
//             <button
//                 //  disabled={!isValid}
//                 type="submit"
//                 className="primary-button"
//                 onClick={() => {
//                     axios.post(urls.LOGIN, state)
//                         .then(response => {
//                             localStorage.setItem("token", JSON.stringify(response.data.data));
//                             browserRedirect('/');
//                         })
//                         .catch(error => {
//                             console.log(error);
//                             console.log(error.response);
//                             if (error.response.data.e) {
//                                 toast.error(error.response.data.e);
//                             }
//                         })
//                 }}
//                 style={{ marginTop: '50px', width: '150px' }}
//             >
//                 LOGIN
//             </button>
//         </div>
//     );
// }

// export default AdminLogin;