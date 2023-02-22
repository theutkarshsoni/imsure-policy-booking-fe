/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route, Redirect } from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';
import FeaturePage from 'containers/FeaturePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'components/Header';
// import Footer from 'components/Footer';

// imports
import TPALogin from 'containers/TPALogin';
import TPAExplanation from 'containers/TPAExplanation';
import GlobalStyle from '../../global-styles';

import AuthRoute from "../../helpers/authRoutes"; // Auth Routes, Will only accessible before login.
import PrivateRoute from "../../helpers/privateRoutes"; //Routes that will be accessible only after login


// import EOB from '../EOB';


import Dashboard from '../Dashboard';





import './app.css';
import { browserRedirect, checkAuthorization } from '../../helpers/helpers';

import Login from '../Login';


// import TPAList from '../TPAList';
// import HospitalList from '../HospitalList';
// import Hospital from '../Hospital';
// import InsurerList from '../InsurerList';
// import Insurer from '../Insurer';
// import IncidentList from '../IncidentList';


import RuleList from '../RuleList';
import RuleDetails from '../RuleDetails';
import SubscriptionList from '../SubscriptionList';
import GMCCreateSubscription from '../GMCCreateSubscription';
import RetailCreateSubscription from '../RetailCreateSubscription';
import LossRatioAnalytics from '../LossRatioAnalytics';



const cz_logo = require("../../images/cz.png");








const AppWrapper = styled.div`
  max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  flex-direction: column;
`;

// const createGuest = require('cross-domain-storage/guest');
// const TPAURL = 'http://localhost:3004/';
// // const TPAURL = 'https://tpa.imsure.in/';
// const TPALocalStorage = createGuest(TPAURL);

// // const { error, value } = await TPALocalStorage.get('token');

// TPALocalStorage.get('token', function (error, value) {
//   console.log("Inside the callback");
//   if (error) {
//     console.log("error: ", error);
//   }
//   console.log("token: ", value);

// })

export default function App() {
  return (
    <AppWrapper>
      <Helmet titleTemplate="%s - ClaimZippy" defaultTitle="ClaimZippy">
        <meta name="description" content="" />
      </Helmet>
      {/* <Header /> */}

      <img src={cz_logo} alt=""
        style={{ width: "175px" }}
        onClick={() => browserRedirect("/")}
      />

      <Switch>

        <AuthRoute exact path="/sessions" component={Login} />



        <PrivateRoute exact path="/" component={Dashboard} />

        {/* <PrivateRoute exact path="/tpas" component={TPAList} />

        <PrivateRoute exact path="/hospitals" component={HospitalList} />
        <PrivateRoute exact path="/hospitals/:hospital_id" component={Hospital} />

        <PrivateRoute exact path="/insurers" component={InsurerList} />
        <PrivateRoute exact path="/insurers/:insurer_id" component={Insurer} />

        <PrivateRoute exact path="/incidents" component={IncidentList} /> */}



        <PrivateRoute exact path="/rules" component={RuleList} />
        <PrivateRoute exact path="/rules/:rule_id" component={RuleDetails} />

        <PrivateRoute exact path="/gmc/subscriptions" component={SubscriptionList} />
        <PrivateRoute exact path="/gmc/subscriptions/:subscription_id" component={GMCCreateSubscription} />

        <PrivateRoute exact path="/retail/subscriptions" component={SubscriptionList} />
        <PrivateRoute exact path="/retail/subscriptions/:subscription_id" component={RetailCreateSubscription} />

        <PrivateRoute exact path="/gmc/lra" component={LossRatioAnalytics} />





        <PrivateRoute exact path="/" component={Dashboard} />


        {/* <PrivateRoute exact path="/performance" component={Dashboard} />
        <PrivateRoute exact path="/" component={PendingAdjudications} />
        <PrivateRoute exact path="/incidents/:incident_id/claims/:claim_id/preauth" component={ClaimPreauth} />
        <PrivateRoute exact path="/incidents/:incident_id/claims/:claim_id/ieob/" component={ClaimInterimEOB} />
        <PrivateRoute exact path="/incidents/:incident_id/claims/:claim_id/discharge/" component={ClaimDischarge} />
        <PrivateRoute exact path="/incidents/:incident_id/claims/:claim_id/documents/" component={ClaimDocuments} />
        <PrivateRoute exact path="/eob/:id" component={EOB} /> */}
        {/* <AuthRoute exact path="/tpa/login" component={TPALogin} /> */}
        {/* <PrivateRoute exact path="/tpa/explanation" component={TPAExplanation} /> */}
        <Route path="/features" component={FeaturePage} />
        <Route path="" component={NotFoundPage} />
      </Switch>


      {/* <Footer /> */}
      <GlobalStyle />
    </AppWrapper>
  );
}
