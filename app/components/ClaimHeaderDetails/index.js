import React from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { browserRedirect } from '../../helpers/helpers';

function ClaimHeaderDetails({ incident, useCase }) {

    const routeParams = useParams();
    const incident_id = routeParams.incident_id;
    const claim_id = routeParams.claim_id;


    const claim = incident && incident.claims.find(x => x._id.toString() === claim_id.toString());

    claim && console.log(claim.stage);


    const headDetails = [
        {
            label: "Insurer",
            value: incident && incident.insurance_details && incident.insurance_details.insurer,
        },
        {
            label: "Product",
            value: incident && incident.insurance_details && incident.insurance_details.product,
        },
        {
            label: "Variant",
            value: incident && incident.insurance_details && incident.insurance_details.variant,
        },
        {
            label: "Scheme",
            value: incident && incident.insurance_details && incident.insurance_details.scheme,
        },
        {
            label: "Policy number",
            value: incident && incident.insurance_details && incident.insurance_details.policy_number,
        },
        {
            label: "Insured name",
            value: incident && incident.subscription && incident.subscription.lives && incident.subscription.lives.find(x => x.relationship.toUpperCase() === "SELF") && incident.subscription.lives.find(x => x.relationship.toUpperCase() === "SELF").name,
        },
        {
            label: "SI",
            value: incident && incident.subscription && incident.subscription.sum_insured,
        },
        {
            label: "SI balance",
            value:
                incident && incident.subscription && incident.subscription.sum_insured
                -
                (
                    incident && incident.claim_history && incident.claim_history.lives &&
                    incident.claim_history.lives.reduce((prev, cur) => {
                        if (Number(cur.claimed_since_renewal)) {
                            return prev + Number(cur.claimed_since_renewal)
                        }
                        return prev + 0;
                    }, 0)
                ),
        },
    ];

    return (
        <>


            <button
                className="primary-button"
                style={{
                    width: "20%",
                    marginTop: "-3%"
                }}
                onClick={() => browserRedirect("/")}
            >
                Dashboard
            </button>

            <div className="table_container_web" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginTop: "2%" }} >
                <table className={"table_web"} >
                    <tr className="bill_header_row">
                        {
                            headDetails.map(item =>
                                <th className={"bill_table_head"} >{item.label}</th>
                            )
                        }
                    </tr>
                    <tr
                        className={"bill_table_content_row_even"}
                    >
                        {
                            headDetails.map(item =>
                                <td
                                    className="dashboard_table_data"
                                >
                                    {item.value}
                                </td>
                            )
                        }
                    </tr>
                </table>
            </div >

            {/*  */}

            <Grid container style={{ textAlign: "center" }} >
                <Grid xs={4} >
                    <button
                        className={

                            (
                                useCase === "preauth"
                                    ?
                                    "primary-button"
                                    :
                                    "primary-button back-btn"
                            )
                        }
                        onClick={() => {
                            browserRedirect("/incidents/" + incident_id + "/claims/" + claim_id + "/preauth");
                        }}
                    >
                        Preauth
                    </button>
                </Grid>
                <Grid xs={4} >
                    <button

                        className={
                            (
                                useCase === "enhancements"
                                    ?
                                    "primary-button"
                                    :
                                    "primary-button back-btn"
                            )
                        }
                        onClick={() => {
                            browserRedirect("/incidents/" + incident_id + "/claims/" + claim_id + "/ieob");
                        }}
                        style={{ opacity: (claim && claim.stage === "preauth") ? "0.6" : "1" }}
                        disabled={claim && claim.stage === "preauth"}
                    >
                        Bills, Reports and Enhancements
                    </button>
                </Grid>
                <Grid xs={4} >
                    <button
                        className={
                            (
                                useCase === "discharge"
                                    ?
                                    "primary-button"
                                    :
                                    "primary-button back-btn"
                            )
                        }
                        onClick={() => {
                            browserRedirect("/incidents/" + incident_id + "/claims/" + claim_id + "/discharge");
                        }}
                        disabled={
                            claim
                            && !(claim.stage === "discharge")
                            && !(claim.enhancements.find(x => x.status === "submitted" || x.status === "data_refined"))
                        }
                        style={{
                            opacity:
                                (
                                    claim
                                    && !(claim.stage === "discharge")
                                    && !(claim.enhancements.find(x => x.status === "submitted" || x.status === "data_refined"))
                                ) ? "0.6" : "1"
                        }}
                    >
                        Finalize / Discharge
                    </button>
                </Grid>


                <Grid xs={4} ></Grid>
                <Grid xs={4}
                    style={{ textAlign: "center" }}
                >
                    <button
                        className={

                            (
                                useCase === "documents"
                                    ?
                                    "primary-button"
                                    :
                                    "primary-button back-btn"
                            )
                        }
                        onClick={() => {
                            browserRedirect("/incidents/" + incident_id + "/claims/" + claim_id + "/documents");
                        }}
                    >
                        Documents
                    </button>
                </Grid>
                <Grid xs={4} ></Grid>

            </Grid >
        </>
    );
}

export default ClaimHeaderDetails;