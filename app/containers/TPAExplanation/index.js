/*
 * TPA Explanation of Benefits
 */

import React, { useEffect, memo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { withRouter } from 'react-router-dom';

import { makeSelectLoading, makeSelectError } from 'containers/App/selectors';

import Grid from '@material-ui/core/Grid';
import { TextField, Popover } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from '@material-ui/core/InputAdornment';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';

import { diff } from 'json-diff';

import { UserDetails } from '../../helpers/helpers';

//Saga calls
import reducer from './reducer';
import saga from './saga';
import { tpaExplanationRequest, tpaClaimStatusRequest } from './actions';
import { makeSelectTPAExplanation } from './selectors';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';

import './tpaExplanation.css';

const key = 'tpaExplanation';

const useStyles = makeStyles((theme) => ({
  // paper: {
  //   maxHeight: '100%',
  //   overflowY: 'auto',
  //   backgroundColor: '#FFF',
  //   outline: 'none',
  //   marginTop: '20px',
  //   marginBottom: '20px',
  //   boxShadow: '0px 10px 60px rgba(0, 0, 0, 0.3)',
  // },
  // h2: {
  //   paddingBottom: '10px',
  //   borderBottom: '1px solid #E6E6E6'
  // },
  // button: {
  //   fontFamily: "'Poppins','Helvetica Neue',Helvetica,Arial,sans-serif"
  // },
  input: {
    textAlign: 'right',
    // backgroundColor: "white"
  },
  popover_content: {
    padding: theme.spacing(2),
  },
  // typography: {
  //   padding: theme.spacing(2),
  // },
}));

function indianNumberCommaSeperation(number) {
  var lastThree = number.substring(number.length - 3);
  var otherNumbers = number.substring(0, number.length - 3);
  if (otherNumbers != '')
    lastThree = ',' + lastThree;
  var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  return res
}


function TPAExplanation({
  loading,
  onTPAExplanation,
  onHandleClaimStatus,
  tpaExplanation,
  error
}) {

  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });



  useEffect(() => {
    onTPAExplanation({ email: UserDetails() && UserDetails().email });
  }, []);

  const handleClaimStatus = (id, status) => {
    var obj = {};
    obj.email = UserDetails() && UserDetails().email;
    if (status === 'override') {
      if (data["_id"]) {
        delete data["_id"];
      }
      obj.eob = data;
      obj.eob.claim_req_id = id;
    }
    else {
      obj.claim_req_id = id;
    }
    obj.status = status;
    onHandleClaimStatus(obj);
  }

  const classes = useStyles();

  let original_data = {
    "chargeheads": {
      "name": "Chargeheads",
      "room_nursing": {
        "name": "Room & Nursing",
        "hospitalCharges": 3400,
        "explanation": "Room Rent covers the expenses of room-rent, nursing charges and boarding charges.",
        "insuranceCoverAmount": 3400,
        "insuranceCover": 100,
        "insuredCoverAmount": 0,
        "insuredCover": 0
      },
      "ICU_charges": {
        "name": "ICU",
        "hospitalCharges": 5000,
        "explanation": "ICU covers the expenses of ICU stay charges, monitoring cost, food and doctor's attendance.",
        "insuranceCoverAmount": 5000,
        "insuranceCover": 100,
        "insuredCoverAmount": 0,
        "insuredCover": 0
      },
      "medicine_consumable": {
        "name": "Medicine & Consumable",
        "hospitalCharges": 2400,
        "explanation": "Pharmacy covers the charges incurred due to medicines consumed during the procedure and/or during the stay in hospital",
        "insuranceCoverAmount": 2400,
        "insuranceCover": 100,
        "insuredCoverAmount": 0,
        "insuredCover": 0
      },
      "professional_charges": {
        "name": "Professional",
        "hospitalCharges": 3000,
        "explanation": "Professional charges covers Surgeon fee, Anesthesiologist fee and other specialist doctor fee",
        "insuranceCoverAmount": 3000,
        "insuranceCover": 100,
        "insuredCoverAmount": 0,
        "insuredCover": 0
      },
      "investigation_charges": {
        "name": "Investigation",
        "hospitalCharges": 1000,
        "explanation": "Investigation charges covers the investigation charges like scans, Xray, blood test etc..",
        "insuranceCoverAmount": 1000,
        "insuranceCover": 100,
        "insuredCoverAmount": 0,
        "insuredCover": 0
      },
      "misc_charges": {
        "name": "Misc",
        "hospitalCharges": 0,
        "explanation": "Misc covers other non medical charges like admission charge, etc..",
        "insuranceCoverAmount": 0,
        "insuranceCover": null,
        "insuredCoverAmount": 0,
        "insuredCover": null
      },
      "package_charges": {
        "name": "Package",
        "hospitalCharges": 18300,
        "explanation": "Package referd to the package charge for a procedure which is an all inclusive price for the procedure in that particular hospital",
        "insuranceCoverAmount": 18300,
        "insuranceCover": 100,
        "insuredCoverAmount": 0,
        "insuredCover": 0
      },
      "ambulance_charges": {
        "name": "Ambulance",
        "hospitalCharges": 0,
        "explanation": "Ambulance Covers the ambulance fee if utlised for moving the patient to / from the hospital",
        "insuranceCoverAmount": 0,
        "insuranceCover": null,
        "insuredCoverAmount": 0,
        "insuredCover": null
      },
      "total_treatment_charges": {
        "name": "Total Treatment Charges",
        "hospitalCharges": 33100,
        "insuranceCoverAmount": 33100,
        "insuranceCover": 100,
        "insuredCoverAmount": 0,
        "insuredCover": 0,
        "explanation": "This is the total charge payable to the hospital for your treatment"
      }
    },
    "deductions": {
      "name": "Deductions",
      "deductible_mandatory": {
        "name": "Deductible - Mandatory",
        "insuredCoverAmount": 2000,
        "insuranceCoverAmount": -2000,
        "explanation": "Mandatory Deductible is the minimum amount deducted from every claim as per the insurance policy terms and condition"
      },
      "deductible_voluntary": {
        "name": "Deductible - Voluntary",
        "insuredCoverAmount": 0,
        "insuranceCoverAmount": 0,
        "explanation": "Voluntary Deductible is the amount that you have agreed to forgo in every claim while signing up for the insurance policy"
      },
      "charges_post_deductions": {
        "name": "Charges Post Deductions",
        "hospitalCharges": 33100,
        "insuranceCoverAmount": 31100,
        "insuranceCover": 93.95770392749245,
        "insuredCoverAmount": 2000,
        "insuredCover": 6.042296072507554,
        "explanation": "Th is the total amount admissible after deducting the policy deductions"
      }
    },
    "copay": {
      "name": "Copay",
      "mandatory": {
        "name": "Copay - Mandatory",
        "insuredCoverAmount": 0,
        "insuranceCoverAmount": 100,
        "explanation": "Mandatory copay refers to the percentage of treatment cost that the insured have agreed to share on every claim while signing up for the policy"
      },
      "zonal": {
        "name": "Copay - Zonal",
        "insuredCoverAmount": 0,
        "insuranceCoverAmount": 100,
        "explanation": "Zonal co[ay refers to the percentage of cost to be shared by the insured if the patient is treated in a zone different from the zone where the policy was bought"
      },
      "intimation_delay": {
        "name": "Copay - Intimation Delay",
        "insuredCoverAmount": 0,
        "insuranceCoverAmount": 100,
        "explanation": ""
      },
      "submission_delay": {
        "name": "Copay - Submission Delay",
        "insuredCoverAmount": 0,
        "insuranceCoverAmount": 100,
        "explanation": ""
      },
      "parental": {
        "name": "Copay - Parental",
        "insuredCoverAmount": 0,
        "insuranceCoverAmount": 100,
        "explanation": "Parental copay refers to the percentage of treatment cost to be bourne by the insured for treatment of his/her parent"
      },
      "age": {
        "name": "Copay - Age",
        "insuredCoverAmount": 0,
        "insuranceCoverAmount": 100,
        "explanation": "Age related copay is the percentage of treatment cost to be bourne by the insured if the patient's age is greater than 65 years"
      },
      "ailment": {
        "name": "Copay - Ailment",
        "insuredCoverAmount": 0,
        "insuranceCoverAmount": 100,
        "explanation": "Ailment copay refers to the percentage of cost to be bourne by the insured if there are claims for specific illness listed in the policy at the time of inception"
      },
      "total_copay_share": {
        "name": "Total Co-pay Share",
        "insuranceCoverAmount": 100,
        "insuredCoverAmount": 0,
        "explanation": "This row shows the nett impact of all applicable copay deductions on this claim"
      },
      "post_applying_copay": {
        "name": "Post applying Co-pay",
        "hospitalCharges": 33100,
        "insuranceCoverAmount": 31100,
        "insuranceCover": 93.95770392749245,
        "insuredCoverAmount": 2000,
        "insuredCover": 6.042296072507554,
        "explanation": "This row gives the total amount admissible after deduction of copay from Charges post Deductions"
      }
    },
    "sublimits": {
      "name": "Sublimits",
      "ailment": {
        "name": "Sublimits - Ailment",
        "insuredCoverAmount": 0,
        "insuranceCoverAmount": 0,
        "explanation": "Ailment sublimit refers to the maximum amount payable for a given ailment type under the insurance policy"
      },
      "procedure": {
        "name": "Sublimits - Procedure",
        "insuredCoverAmount": 0,
        "insuranceCoverAmount": 200000,
        "explanation": "Procedure sublimit refers to the maximum amount payable for a given procedure under the insurance policy"
      },
      "total_post_sublimits": {
        "name": "Total Post Sublimits",
        "hospitalCharges": 33100,
        "insuranceCoverAmount": 31100,
        "insuranceCover": 93.95770392749245,
        "insuredCoverAmount": 2000,
        "insuredCover": 6.042296072507554,
        "explanation": "This row gives the total amount admissible after deduction of sublimits from Post applying copay"
      }
    },
    "SI_balance": {
      "name": "Sum Insured Balance",
      "insuranceCoverAmount": 10000,
      "explanation": "SI Balance refers to the balance sum insured available for covering the admissible amount calculate till this point in the claim"
    },
    "payable": {
      "name": "Payable",
      "hospitalCharges": 33100,
      "insuranceCoverAmount": 10000,
      "insuredCoverAmount": 23100,
      "explanation": "This is the nett amount payable for this claim",
      "insuranceCover": 30.211480362537763,
      "insuredCover": 69.78851963746223
    }
  }

  const [data, setData] = useState(tpaExplanation);

  const [state, setState] = useState({
    labels: [{ name: 'Category' }, { name: 'Justification' }, { name: 'Hospital Charges' }, { name: '% Cover by insurance' }, { name: 'Amount covered by insurance' }, { name: '% Burden on insured' }, { name: 'Amount to be paid by insured' }],
  })

  function EOBSubCatRow(item, index, useCase, useCase1) {

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    if (
      // (
      //   (useCase === "copay" && item.insuranceCoverAmount != 100)
      //   ||
      //   (useCase != "copay" && useCase1 != "total_treatment_charges" && item.insuranceCoverAmount)
      //   ||
      //   (useCase1 === "total_treatment_charges" && data[useCase].package_charges.insuranceCoverAmount === 0)
      // )
      // &&
      // JSON.stringify(data) === JSON.stringify(tpaExplanation)
      // ||
      true
    )
      return (
        <>
          {
            (data[useCase].override || (data[useCase][useCase1] && data[useCase][useCase1].override))
              ?
              <>
                <tr
                  className={
                    (index % 2 === 1
                      ? "bill_table_content_row_odd zone-table-row"
                      : 'bill_table_content_row_even zone-table-row')
                    + " "
                    // + (useCase === "SI_balance" || useCase === "payable" ? "seperation-tr" : (parseInt(item.hospitalCharges) === 0 ? "not-applicable" : (parseInt(item.insuranceCover) === 100 ? "full-insurance" : (parseInt(item.insuredCover) === 100 ? "full-insured" : (parseInt(item.insuredCover) > 0 && parseInt(item.insuranceCover) > 0 ? "split-insurance-insured" : null)))))
                    + "change-explanation"
                  }
                  onClick={handleClick}
                >
                  <td className="td-explanation-android">
                    {item.name}
                  </td>
                  <td className="td-explanation-android">
                    <TextField
                      required
                      placeholder='Enter Justification'
                      onChange={(event) => {
                        data[useCase][useCase1] ? data[useCase][useCase1].justification = event.target.value : null
                        console.log(data[useCase][useCase1])
                      }}
                      InputProps={{ disableUnderline: true, classes }}
                    />
                  </td>
                  <td className="td-explanation-android">
                    {
                      item.hospitalCharges != null
                        ?
                        <TextField
                          required
                          type='number'
                          placeholder='Enter Hospital Charges'
                          defaultValue={data[useCase][useCase1] ? data[useCase][useCase1].hospitalCharges : data[useCase].hospitalCharges}
                          onChange={(event) => {
                            let currentSubCat = {
                              hospitalCharges: parseInt(event.target.value) ? parseInt(event.target.value) : 0,
                            }
                            currentSubCat.insuranceCover = data.chargeheads[useCase1].insuranceCoverAmount / currentSubCat.hospitalCharges * 100
                            currentSubCat.insuredCoverAmount = currentSubCat.hospitalCharges - data.chargeheads[useCase1].insuranceCoverAmount
                            currentSubCat.insuredCover = 100 - currentSubCat.insuranceCover
                            let total_treatment_charges = {
                              hospitalCharges: data.chargeheads.total_treatment_charges.hospitalCharges,
                              insuranceCoverAmount: data.chargeheads.total_treatment_charges.insuranceCoverAmount
                            }
                            console.log(total_treatment_charges)
                            total_treatment_charges.hospitalCharges -= data.chargeheads[useCase1].hospitalCharges
                            console.log(total_treatment_charges)
                            total_treatment_charges.hospitalCharges += currentSubCat.hospitalCharges
                            console.log(total_treatment_charges)
                            total_treatment_charges.insuranceCover = total_treatment_charges.insuranceCoverAmount / total_treatment_charges.hospitalCharges * 100
                            total_treatment_charges.insuredCoverAmount = total_treatment_charges.hospitalCharges - total_treatment_charges.insuranceCoverAmount
                            total_treatment_charges.insuredCover = 100 - total_treatment_charges.insuranceCover
                            let charges_post_deductions = {
                              hospitalCharges: total_treatment_charges.hospitalCharges,
                              insuranceCoverAmount: total_treatment_charges.insuranceCoverAmount + (data.deductions.deductible_mandatory.insuranceCoverAmount + data.deductions.deductible_voluntary.insuranceCoverAmount)
                            }
                            charges_post_deductions.insuranceCover = charges_post_deductions.insuranceCoverAmount / charges_post_deductions.hospitalCharges * 100
                            charges_post_deductions.insuredCoverAmount = charges_post_deductions.hospitalCharges - charges_post_deductions.insuranceCoverAmount
                            charges_post_deductions.insuredCover = 100 - charges_post_deductions.insuranceCover
                            let post_applying_copay = {
                              hospitalCharges: total_treatment_charges.hospitalCharges,
                              insuranceCoverAmount: charges_post_deductions.insuranceCoverAmount * (data.copay.total_copay_share.insuranceCoverAmount / 100),
                            }
                            post_applying_copay.insuranceCover = post_applying_copay.insuranceCoverAmount / post_applying_copay.hospitalCharges * 100
                            post_applying_copay.insuredCoverAmount = post_applying_copay.hospitalCharges - post_applying_copay.insuranceCoverAmount
                            post_applying_copay.insuredCover = 100 - post_applying_copay.insuranceCover
                            let total_post_sublimits = {
                              hospitalCharges: total_treatment_charges.hospitalCharges,
                              insuranceCoverAmount:
                                data.sublimits.procedure.insuranceCoverAmount < post_applying_copay.insuranceCoverAmount
                                  ? data.sublimits.procedure.insuranceCoverAmount
                                  : post_applying_copay.insuranceCoverAmount
                            }
                            total_post_sublimits.insuranceCover = total_post_sublimits.insuranceCoverAmount / total_post_sublimits.hospitalCharges * 100
                            total_post_sublimits.insuredCoverAmount = total_post_sublimits.hospitalCharges - total_post_sublimits.insuranceCoverAmount
                            total_post_sublimits.insuredCover = 100 - total_post_sublimits.insuranceCover
                            let payable = {
                              hospitalCharges: total_treatment_charges.hospitalCharges,
                              insuranceCoverAmount:
                                data.SI_balance.insuranceCoverAmount < total_post_sublimits.insuranceCoverAmount
                                  ? data.SI_balance.insuranceCoverAmount
                                  : total_post_sublimits.insuranceCoverAmount
                            }
                            payable.insuranceCover = payable.insuranceCoverAmount / payable.hospitalCharges * 100
                            payable.insuredCoverAmount = payable.hospitalCharges - payable.insuranceCoverAmount
                            payable.insuredCover = 100 - payable.insuranceCover
                            setData({
                              ...data,
                              chargeheads: {
                                ...data.chargeheads,
                                [useCase1]: {
                                  ...data.chargeheads[useCase1],
                                  hospitalCharges: currentSubCat.hospitalCharges,
                                  insuranceCover: currentSubCat.insuranceCover,
                                  insuredCoverAmount: currentSubCat.insuredCoverAmount,
                                  insuredCover: currentSubCat.insuredCover,
                                },
                                total_treatment_charges: {
                                  ...data.chargeheads.total_treatment_charges,
                                  hospitalCharges: total_treatment_charges.hospitalCharges,
                                  insuranceCover: total_treatment_charges.insuranceCover,
                                  insuredCoverAmount: total_treatment_charges.insuredCoverAmount,
                                  insuredCover: total_treatment_charges.insuredCover,
                                }
                              },
                              deductions: {
                                ...data.deductions,
                                charges_post_deductions: {
                                  ...data.deductions.charges_post_deductions,
                                  hospitalCharges: charges_post_deductions.hospitalCharges,
                                  insuranceCover: charges_post_deductions.insuranceCover,
                                  insuredCoverAmount: charges_post_deductions.insuredCoverAmount,
                                  insuredCover: charges_post_deductions.insuredCover,
                                }
                              },
                              copay: {
                                ...data.copay,
                                post_applying_copay: {
                                  ...data.copay.post_applying_copay,
                                  hospitalCharges: post_applying_copay.hospitalCharges,
                                  insuranceCover: post_applying_copay.insuranceCover,
                                  insuredCoverAmount: post_applying_copay.insuredCoverAmount,
                                  insuredCover: post_applying_copay.insuredCover,
                                }
                              },
                              sublimits: {
                                ...data.sublimits,
                                total_post_sublimits: {
                                  ...data.sublimits.total_post_sublimits,
                                  hospitalCharges: total_post_sublimits.hospitalCharges,
                                  insuranceCover: total_post_sublimits.insuranceCover,
                                  insuredCoverAmount: total_post_sublimits.insuredCoverAmount,
                                  insuredCover: total_post_sublimits.insuredCover,
                                }
                              },
                              payable: {
                                ...data.payable,
                                hospitalCharges: payable.hospitalCharges,
                                insuranceCover: payable.insuranceCover,
                                insuredCoverAmount: payable.insuredCoverAmount,
                                insuredCover: payable.insuredCover,
                              }
                            })
                          }}
                          InputProps={{
                            inputProps: { min: 0 },
                            disableUnderline: true, classes,
                            startAdornment: (
                              <InputAdornment position="end">
                                &#x20B9;
                              </InputAdornment>
                            )
                          }
                          }
                        />
                        : "-"
                    }
                  </td>
                  <td className="td-explanation-android">
                    {
                      (data[useCase][useCase1] && (data[useCase][useCase1].insuranceCover != null || item.insuranceCover != undefined))
                        ? <>{data[useCase][useCase1].insuranceCover.toFixed(item.insuranceCover % 1 === 0 ? 0 : 2)}%</>
                        : "-"
                    }
                  </td>
                  <td className="td-explanation-android">
                    <TextField
                      required
                      type='number'
                      placeholder='Enter Insurance Cover Amount'
                      defaultValue={data[useCase][useCase1] ? data[useCase][useCase1].insuranceCoverAmount : data[useCase].insuranceCoverAmount}
                      onChange={(event) => {
                        if (useCase === "chargeheads") {
                          let currentSubCat = {
                            hospitalCharges: item.hospitalCharges,
                            insuranceCoverAmount: parseInt(event.target.value) && event.target.value != "-" ? parseInt(event.target.value) : 0,
                          }
                          currentSubCat.insuranceCover = currentSubCat.insuranceCoverAmount / currentSubCat.hospitalCharges * 100
                          currentSubCat.insuredCoverAmount = currentSubCat.hospitalCharges - currentSubCat.insuranceCoverAmount
                          currentSubCat.insuredCover = 100 - currentSubCat.insuranceCover
                          let total_treatment_charges = {
                            hospitalCharges: parseInt(data.chargeheads.total_treatment_charges.hospitalCharges),
                            insuranceCoverAmount: parseInt(data.chargeheads.total_treatment_charges.insuranceCoverAmount),
                          }
                          total_treatment_charges.insuranceCoverAmount -= data.chargeheads[useCase1].insuranceCoverAmount
                          total_treatment_charges.insuranceCoverAmount += currentSubCat.insuranceCoverAmount
                          total_treatment_charges.insuranceCover = total_treatment_charges.insuranceCoverAmount / total_treatment_charges.hospitalCharges * 100
                          total_treatment_charges.insuredCoverAmount = total_treatment_charges.hospitalCharges - total_treatment_charges.insuranceCoverAmount
                          total_treatment_charges.insuredCover = 100 - total_treatment_charges.insuranceCover
                          let charges_post_deductions = {
                            hospitalCharges: total_treatment_charges.hospitalCharges,
                            insuranceCoverAmount: total_treatment_charges.insuranceCoverAmount + (data.deductions.deductible_mandatory.insuranceCoverAmount + data.deductions.deductible_voluntary.insuranceCoverAmount)
                          }
                          charges_post_deductions.insuranceCover = charges_post_deductions.insuranceCoverAmount / charges_post_deductions.hospitalCharges * 100
                          charges_post_deductions.insuredCoverAmount = charges_post_deductions.hospitalCharges - charges_post_deductions.insuranceCoverAmount
                          charges_post_deductions.insuredCover = 100 - charges_post_deductions.insuranceCover
                          let post_applying_copay = {
                            hospitalCharges: total_treatment_charges.hospitalCharges,
                            insuranceCoverAmount: charges_post_deductions.insuranceCoverAmount * (data.copay.total_copay_share.insuranceCoverAmount / 100),
                          }
                          post_applying_copay.insuranceCover = post_applying_copay.insuranceCoverAmount / post_applying_copay.hospitalCharges * 100
                          post_applying_copay.insuredCoverAmount = post_applying_copay.hospitalCharges - post_applying_copay.insuranceCoverAmount
                          post_applying_copay.insuredCover = 100 - post_applying_copay.insuranceCover
                          let total_post_sublimits = {
                            hospitalCharges: total_treatment_charges.hospitalCharges,
                            insuranceCoverAmount:
                              Math.min.apply(null, [data.sublimits.ailment.insuranceCoverAmount, data.sublimits.procedure.insuranceCoverAmount, data.copay.post_applying_copay.insuranceCoverAmount].filter(Boolean))
                          }
                          total_post_sublimits.insuranceCover = total_post_sublimits.insuranceCoverAmount / total_post_sublimits.hospitalCharges * 100
                          total_post_sublimits.insuredCoverAmount = total_post_sublimits.hospitalCharges - total_post_sublimits.insuranceCoverAmount
                          total_post_sublimits.insuredCover = 100 - total_post_sublimits.insuranceCover
                          let payable = {
                            hospitalCharges: total_treatment_charges.hospitalCharges,
                            insuranceCoverAmount:
                              data.SI_balance.insuranceCoverAmount < total_post_sublimits.insuranceCoverAmount
                                ? data.SI_balance.insuranceCoverAmount
                                : total_post_sublimits.insuranceCoverAmount
                          }
                          payable.insuranceCover = payable.insuranceCoverAmount / payable.hospitalCharges * 100
                          payable.insuredCoverAmount = payable.hospitalCharges - payable.insuranceCoverAmount
                          payable.insuredCover = 100 - payable.insuranceCover
                          setData({
                            ...data,
                            chargeheads: {
                              ...data.chargeheads,
                              [useCase1]: {
                                ...data.chargeheads[useCase1],
                                insuranceCoverAmount: currentSubCat.insuranceCoverAmount,
                                insuranceCover: currentSubCat.insuranceCover,
                                insuredCoverAmount: currentSubCat.insuredCoverAmount,
                                insuredCover: currentSubCat.insuredCover,
                              },
                              total_treatment_charges: {
                                ...data.chargeheads.total_treatment_charges,
                                insuranceCoverAmount: total_treatment_charges.insuranceCoverAmount,
                                insuranceCover: total_treatment_charges.insuranceCover,
                                insuredCoverAmount: total_treatment_charges.insuredCoverAmount,
                                insuredCover: total_treatment_charges.insuredCover,
                              }
                            },
                            deductions: {
                              ...data.deductions,
                              charges_post_deductions: {
                                ...data.deductions.charges_post_deductions,
                                insuranceCoverAmount: charges_post_deductions.insuranceCoverAmount,
                                insuranceCover: charges_post_deductions.insuranceCover,
                                insuredCoverAmount: charges_post_deductions.insuredCoverAmount,
                                insuredCover: charges_post_deductions.insuredCover,
                              }
                            },
                            copay: {
                              ...data.copay,
                              post_applying_copay: {
                                ...data.copay.post_applying_copay,
                                insuranceCoverAmount: post_applying_copay.insuranceCoverAmount,
                                insuranceCover: post_applying_copay.insuranceCover,
                                insuredCoverAmount: post_applying_copay.insuredCoverAmount,
                                insuredCover: post_applying_copay.insuredCover,
                              }
                            },
                            sublimits: {
                              ...data.sublimits,
                              total_post_sublimits: {
                                ...data.sublimits.total_post_sublimits,
                                insuranceCoverAmount: total_post_sublimits.insuranceCoverAmount,
                                insuranceCover: total_post_sublimits.insuranceCover,
                                insuredCoverAmount: total_post_sublimits.insuredCoverAmount,
                                insuredCover: total_post_sublimits.insuredCover,
                              }
                            },
                            payable: {
                              ...data.payable,
                              insuranceCoverAmount: payable.insuranceCoverAmount,
                              insuranceCover: payable.insuranceCover,
                              insuredCoverAmount: payable.insuredCoverAmount,
                              insuredCover: payable.insuredCover,
                            }
                          })
                        }
                        if (useCase === "deductions") {
                          let currentSubCat = {
                            insuranceCoverAmount: parseInt(event.target.value) && event.target.value != "-" ? parseInt(event.target.value) : 0,
                          }
                          currentSubCat.insuredCoverAmount = - currentSubCat.insuranceCoverAmount
                          let charges_post_deductions = {
                            hospitalCharges: data.chargeheads.total_treatment_charges.hospitalCharges,
                            insuranceCoverAmount:
                              data.chargeheads.total_treatment_charges.insuranceCoverAmount
                          }
                          charges_post_deductions.insuranceCoverAmount -= (data.deductions[useCase1].insuranceCoverAmount && currentSubCat.insuranceCoverAmount != "0" ? data.deductions[useCase1].insuranceCoverAmount : 0)
                          charges_post_deductions.insuranceCoverAmount += currentSubCat.insuranceCoverAmount
                          charges_post_deductions.insuranceCover = charges_post_deductions.insuranceCoverAmount / charges_post_deductions.hospitalCharges * 100
                          charges_post_deductions.insuredCoverAmount = charges_post_deductions.hospitalCharges - charges_post_deductions.insuranceCoverAmount
                          charges_post_deductions.insuredCover = 100 - charges_post_deductions.insuranceCover
                          let post_applying_copay = {
                            hospitalCharges: data.chargeheads.total_treatment_charges.hospitalCharges,
                            insuranceCoverAmount: charges_post_deductions.insuranceCoverAmount * (data.copay.total_copay_share.insuranceCoverAmount / 100),
                          }
                          post_applying_copay.insuranceCover = post_applying_copay.insuranceCoverAmount / post_applying_copay.hospitalCharges * 100
                          post_applying_copay.insuredCoverAmount = post_applying_copay.hospitalCharges - post_applying_copay.insuranceCoverAmount
                          post_applying_copay.insuredCover = 100 - post_applying_copay.insuranceCover
                          let total_post_sublimits = {
                            hospitalCharges: data.chargeheads.total_treatment_charges.hospitalCharges,
                            insuranceCoverAmount:
                              Math.min.apply(null, [data.sublimits.ailment.insuranceCoverAmount, data.sublimits.procedure.insuranceCoverAmount, data.copay.post_applying_copay.insuranceCoverAmount].filter(Boolean))
                          }
                          total_post_sublimits.insuranceCover = total_post_sublimits.insuranceCoverAmount / total_post_sublimits.hospitalCharges * 100
                          total_post_sublimits.insuredCoverAmount = total_post_sublimits.hospitalCharges - total_post_sublimits.insuranceCoverAmount
                          total_post_sublimits.insuredCover = 100 - total_post_sublimits.insuranceCover
                          let payable = {
                            hospitalCharges: data.chargeheads.total_treatment_charges.hospitalCharges,
                            insuranceCoverAmount:
                              data.SI_balance.insuranceCoverAmount < total_post_sublimits.insuranceCoverAmount
                                ? data.SI_balance.insuranceCoverAmount
                                : total_post_sublimits.insuranceCoverAmount
                          }
                          payable.insuranceCover = payable.insuranceCoverAmount / payable.hospitalCharges * 100
                          payable.insuredCoverAmount = payable.hospitalCharges - payable.insuranceCoverAmount
                          payable.insuredCover = 100 - payable.insuranceCover
                          setData({
                            ...data,
                            deductions: {
                              ...data.deductions,
                              [useCase1]: {
                                ...data.deductions[useCase1],
                                insuranceCoverAmount: currentSubCat.insuranceCoverAmount,
                                insuredCoverAmount: currentSubCat.insuredCoverAmount,
                              },
                              charges_post_deductions: {
                                ...data.deductions.charges_post_deductions,
                                insuranceCoverAmount: charges_post_deductions.insuranceCoverAmount,
                                insuranceCover: charges_post_deductions.insuranceCover,
                                insuredCoverAmount: charges_post_deductions.insuredCoverAmount,
                                insuredCover: charges_post_deductions.insuredCover,
                              }
                            },
                            copay: {
                              ...data.copay,
                              post_applying_copay: {
                                ...data.copay.post_applying_copay,
                                insuranceCoverAmount: post_applying_copay.insuranceCoverAmount,
                                insuranceCover: post_applying_copay.insuranceCover,
                                insuredCoverAmount: post_applying_copay.insuredCoverAmount,
                                insuredCover: post_applying_copay.insuredCover,
                              }
                            },
                            sublimits: {
                              ...data.sublimits,
                              total_post_sublimits: {
                                ...data.sublimits.total_post_sublimits,
                                insuranceCoverAmount: total_post_sublimits.insuranceCoverAmount,
                                insuranceCover: total_post_sublimits.insuranceCover,
                                insuredCoverAmount: total_post_sublimits.insuredCoverAmount,
                                insuredCover: total_post_sublimits.insuredCover,
                              }
                            },
                            payable: {
                              ...data.payable,
                              insuranceCoverAmount: payable.insuranceCoverAmount,
                              insuranceCover: payable.insuranceCover,
                              insuredCoverAmount: payable.insuredCoverAmount,
                              insuredCover: payable.insuredCover,
                            }
                          })
                        }
                        if (useCase === "copay") {
                          let currentSubCat = {
                            insuranceCoverAmount: parseInt(event.target.value) && event.target.value != "-" ? parseInt(event.target.value) : 0,
                          }
                          currentSubCat.insuredCoverAmount = 100 - currentSubCat.insuranceCoverAmount
                          let total_copay_share = {
                            hospitalCharges: data.chargeheads.total_treatment_charges.hospitalCharges,
                            insuranceCoverAmount: data.copay.total_copay_share.insuranceCoverAmount
                          }
                          // console.log(total_copay_share.insuranceCoverAmount)
                          total_copay_share.insuranceCoverAmount /= data.copay[useCase1].insuranceCoverAmount
                          // console.log(total_copay_share.insuranceCoverAmount)
                          total_copay_share.insuranceCoverAmount *= currentSubCat.insuranceCoverAmount
                          // console.log(total_copay_share.insuranceCoverAmount)
                          total_copay_share.insuredCoverAmount = 100 - total_copay_share.insuranceCoverAmount
                          let post_applying_copay = {
                            hospitalCharges: data.chargeheads.total_treatment_charges.hospitalCharges,
                            insuranceCoverAmount: data.deductions.charges_post_deductions.insuranceCoverAmount * (total_copay_share.insuranceCoverAmount / 100),
                          }
                          post_applying_copay.insuranceCover = post_applying_copay.insuranceCoverAmount / post_applying_copay.hospitalCharges * 100
                          post_applying_copay.insuredCoverAmount = post_applying_copay.hospitalCharges - post_applying_copay.insuranceCoverAmount
                          post_applying_copay.insuredCover = 100 - post_applying_copay.insuranceCover
                          let total_post_sublimits = {
                            hospitalCharges: data.chargeheads.total_treatment_charges.hospitalCharges,
                            insuranceCoverAmount:
                              Math.min.apply(null, [data.sublimits.ailment.insuranceCoverAmount, data.sublimits.procedure.insuranceCoverAmount, data.copay.post_applying_copay.insuranceCoverAmount].filter(Boolean))
                          }
                          total_post_sublimits.insuranceCover = total_post_sublimits.insuranceCoverAmount / total_post_sublimits.hospitalCharges * 100
                          total_post_sublimits.insuredCoverAmount = total_post_sublimits.hospitalCharges - total_post_sublimits.insuranceCoverAmount
                          total_post_sublimits.insuredCover = 100 - total_post_sublimits.insuranceCover
                          let payable = {
                            hospitalCharges: data.chargeheads.total_treatment_charges.hospitalCharges,
                            insuranceCoverAmount:
                              data.SI_balance.insuranceCoverAmount < total_post_sublimits.insuranceCoverAmount
                                ? data.SI_balance.insuranceCoverAmount
                                : total_post_sublimits.insuranceCoverAmount
                          }
                          payable.insuranceCover = payable.insuranceCoverAmount / payable.hospitalCharges * 100
                          payable.insuredCoverAmount = payable.hospitalCharges - payable.insuranceCoverAmount
                          payable.insuredCover = 100 - payable.insuranceCover
                          setData({
                            ...data,
                            copay: {
                              ...data.copay,
                              [useCase1]: {
                                ...data.copay[useCase1],
                                insuranceCoverAmount: currentSubCat.insuranceCoverAmount,
                                insuredCoverAmount: currentSubCat.insuredCoverAmount,
                              },
                              total_copay_share: {
                                ...data.copay.total_copay_share,
                                insuranceCoverAmount: total_copay_share.insuranceCoverAmount,
                                insuredCoverAmount: total_copay_share.insuredCoverAmount
                              },
                              post_applying_copay: {
                                ...data.copay.post_applying_copay,
                                insuranceCoverAmount: post_applying_copay.insuranceCoverAmount,
                                insuranceCover: post_applying_copay.insuranceCover,
                                insuredCoverAmount: post_applying_copay.insuredCoverAmount,
                                insuredCover: post_applying_copay.insuredCover,
                              }
                            },
                            sublimits: {
                              ...data.sublimits,
                              total_post_sublimits: {
                                ...data.sublimits.total_post_sublimits,
                                insuranceCoverAmount: total_post_sublimits.insuranceCoverAmount,
                                insuranceCover: total_post_sublimits.insuranceCover,
                                insuredCoverAmount: total_post_sublimits.insuredCoverAmount,
                                insuredCover: total_post_sublimits.insuredCover,
                              }
                            },
                            payable: {
                              ...data.payable,
                              insuranceCoverAmount: payable.insuranceCoverAmount,
                              insuranceCover: payable.insuranceCover,
                              insuredCoverAmount: payable.insuredCoverAmount,
                              insuredCover: payable.insuredCover,
                            }
                          })
                        }
                        if (useCase === "sublimits") {
                          let currentSubCat = {
                            insuranceCoverAmount: parseInt(event.target.value) && event.target.value != "-" ? parseInt(event.target.value) : 0,
                          }
                          let total_post_sublimits = {
                            hospitalCharges: data.chargeheads.total_treatment_charges.hospitalCharges,
                            insuranceCoverAmount:
                              useCase1 === "ailment"
                                ?
                                Math.min.apply(null, [currentSubCat.insuranceCoverAmount, data.sublimits.procedure.insuranceCoverAmount, data.copay.post_applying_copay.insuranceCoverAmount].filter(Boolean))
                                :
                                useCase1 === "procedure"
                                &&
                                Math.min.apply(null, [data.sublimits.ailment.insuranceCoverAmount, currentSubCat.insuranceCoverAmount, data.copay.post_applying_copay.insuranceCoverAmount].filter(Boolean))
                          }
                          total_post_sublimits.insuranceCover = total_post_sublimits.insuranceCoverAmount / total_post_sublimits.hospitalCharges * 100
                          total_post_sublimits.insuredCoverAmount = total_post_sublimits.hospitalCharges - total_post_sublimits.insuranceCoverAmount
                          total_post_sublimits.insuredCover = 100 - total_post_sublimits.insuranceCover
                          let payable = {
                            hospitalCharges: data.chargeheads.total_treatment_charges.hospitalCharges,
                            insuranceCoverAmount:
                              data.SI_balance.insuranceCoverAmount < total_post_sublimits.insuranceCoverAmount
                                ? data.SI_balance.insuranceCoverAmount
                                : total_post_sublimits.insuranceCoverAmount
                          }
                          payable.insuranceCover = payable.insuranceCoverAmount / payable.hospitalCharges * 100
                          payable.insuredCoverAmount = payable.hospitalCharges - payable.insuranceCoverAmount
                          payable.insuredCover = 100 - payable.insuranceCover
                          setData({
                            ...data,
                            sublimits: {
                              ...data.sublimits,
                              [useCase1]: {
                                ...data.sublimits[useCase1],
                                insuranceCoverAmount: currentSubCat.insuredCoverAmount
                              },
                              total_post_sublimits: {
                                ...data.sublimits.total_post_sublimits,
                                insuranceCoverAmount: total_post_sublimits.insuranceCoverAmount,
                                insuranceCover: total_post_sublimits.insuranceCover,
                                insuredCoverAmount: total_post_sublimits.insuredCoverAmount,
                                insuredCover: total_post_sublimits.insuredCover,
                              }
                            },
                            payable: {
                              ...data.payable,
                              insuranceCoverAmount: payable.insuranceCoverAmount,
                              insuranceCover: payable.insuranceCover,
                              insuredCoverAmount: payable.insuredCoverAmount,
                              insuredCover: payable.insuredCover,
                            }
                          })
                        }
                        if (useCase === "SI_balance") {
                          let currentSubCat = {
                            insuranceCoverAmount: parseInt(event.target.value) && event.target.value != "-" ? parseInt(event.target.value) : 0,
                          }
                          let payable = {
                            hospitalCharges: data.chargeheads.total_treatment_charges.hospitalCharges,
                            insuranceCoverAmount:
                              currentSubCat.insuredCoverAmount < data.sublimits.total_post_sublimits.insuranceCoverAmount
                                ? currentSubCat.insuredCoverAmount
                                : data.sublimits.total_post_sublimits.insuranceCoverAmount
                          }
                          payable.insuranceCover = payable.insuranceCoverAmount / payable.hospitalCharges * 100
                          payable.insuredCoverAmount = payable.hospitalCharges - payable.insuranceCoverAmount
                          payable.insuredCover = 100 - payable.insuranceCover
                          setData({
                            ...data,
                            SI_balance: {
                              ...data.SI_balance,
                              insuranceCoverAmount: currentSubCat.insuredCoverAmount
                            },
                            payable: {
                              ...data.payable,
                              insuranceCoverAmount: payable.insuranceCoverAmount,
                              insuranceCover: payable.insuranceCover,
                              insuredCoverAmount: payable.insuredCoverAmount,
                              insuredCover: payable.insuredCover,
                            }
                          })
                        }
                      }}
                      InputProps={
                        useCase === "copay"
                          ?
                          {
                            disableUnderline: true, classes,
                            // inputProps: { min: 0, max: data[useCase][useCase1].hospitalCharges },
                            endAdornment: (
                              <InputAdornment position="start">
                                %
                              </InputAdornment>
                            )
                          }
                          :
                          {
                            disableUnderline: true, classes,
                            // inputProps: { min: 0, max: data[useCase][useCase1].hospitalCharges },
                            startAdornment: (
                              <InputAdornment position="end">
                                &#x20B9;
                              </InputAdornment>
                            )
                          }
                      }
                    />
                  </td>
                  <td className="td-explanation-android">
                    {
                      item.insuredCover != null
                        ? <>{item.insuredCover.toFixed(item.insuranceCover % 1 === 0 ? 0 : 2)}%</>
                        : "-"
                    }
                  </td>
                  <td className="td-explanation-android">
                    {
                      item.insuredCoverAmount != null
                        || item.insuredCoverAmount != undefined
                        ?
                        useCase === "copay" && useCase1 != "post_applying_copay"
                          ? <>{item.insuredCoverAmount}%</>
                          : <>₹ {indianNumberCommaSeperation(item.insuredCoverAmount.toString())}</>
                        : "-"
                    }
                  </td>
                </tr>
              </>
              :
              <>
                <tr
                  className={
                    (index % 2 === 1
                      ? "bill_table_content_row_odd zone-table-row"
                      : 'bill_table_content_row_even zone-table-row')
                    + " "
                    + (useCase === "SI_balance" || useCase === "payable" ? "seperation-tr" : (parseInt(item.hospitalCharges) === 0 ? "not-applicable" : (parseInt(item.insuranceCover) === 100 ? "full-insurance" : (parseInt(item.insuredCover) === 100 ? "full-insured" : (parseInt(item.insuredCover) > 0 && parseInt(item.insuranceCover) > 0 ? "split-insurance-insured" : null)))))
                  }
                  onClick={handleClick}
                >
                  <td className="td-explanation-android">
                    {item.name}
                  </td>
                  <td className="td-explanation-android">
                    -
                  </td>
                  <td className="td-explanation-android">
                    {
                      item.hospitalCharges != null
                        ? <>₹ {indianNumberCommaSeperation(item.hospitalCharges.toString())}</>
                        : "-"
                    }
                  </td>
                  <td className="td-explanation-android">
                    {
                      item.insuranceCover != null
                        || item.insuranceCover != undefined
                        ? <>{item.insuranceCover.toFixed(item.insuranceCover % 1 === 0 ? 0 : 2)}%</>
                        : "-"
                    }
                  </td>
                  <td className="td-explanation-android">
                    {
                      item.insuranceCoverAmount != null
                        || item.insuranceCoverAmount != undefined
                        ?
                        useCase === "copay" && useCase1 != "post_applying_copay"
                          ? <>{item.insuranceCoverAmount}%</>
                          : <>₹ {indianNumberCommaSeperation(item.insuranceCoverAmount.toString())}</>
                        : "-"
                    }
                  </td>
                  <td className="td-explanation-android">
                    {
                      item.insuredCover != null
                        ? <>{item.insuredCover.toFixed(item.insuranceCover % 1 === 0 ? 0 : 2)}%</>
                        : "-"
                    }
                  </td>
                  <td className="td-explanation-android">
                    {
                      item.insuredCoverAmount != null
                        || item.insuredCoverAmount != undefined
                        ?
                        useCase === "copay" && useCase1 != "post_applying_copay"
                          ? <>{item.insuredCoverAmount}%</>
                          : <>₹ {indianNumberCommaSeperation(item.insuredCoverAmount.toString())}</>
                        : "-"
                    }
                  </td>
                </tr>
                {
                  useCase1 != "total_treatment_charges" && useCase1 != "charges_post_deductions" && useCase1 != "total_copay_share" && useCase1 != "post_applying_copay" && useCase1 != "total_post_sublimits" && useCase != "payable"
                    // && useCase != "SI_balance"
                    ?
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      style={{ width: "100%" }}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                    >
                      <div
                        className={classes.popover_content}
                      // style={{ paddingRight: "1px", paddingBottom: "1px" }}
                      >
                        <button className="primary-button back-btn" onClick={handleClose} >Cancel</button>
                        <button className="primary-button next-btn" onClick={() => {
                          // setGlobalOverride(true)
                          data[useCase][useCase1]
                            ?
                            setData({
                              ...data,
                              [useCase]: {
                                ...data[useCase],
                                [useCase1]: {
                                  ...data[useCase][useCase1],
                                  override: true
                                }
                              }
                            })
                            :
                            setData({
                              ...data,
                              [useCase]: {
                                ...data[useCase],
                                override: true,
                              }
                            })
                          console.log(data)
                        }} >Override</button>
                      </div>
                    </Popover>
                    :
                    null
                }
              </>
          }
          {
            state.unfoldMore ?
              <tr>
                <td colSpan={12} className="pd">
                  <div className="popup-content-div">
                    {item.explanation}
                  </div>
                </td>
              </tr> : null
          }
        </>
      )
  }

  return (
    <>
      <Grid container style={{ marginTop: '20px' }}>
        <Grid item xs={2} />
        <Grid item xs={8} className={"head_container title"}>
          <span>Explanation of Benefits</span>
        </Grid>
        <Grid item xs={2} className="sub-head-container">
        </Grid>
      </Grid>
      <div>
        {
          data != null || data != "" || data != undefined
            // ? typeof data === "object"
            ? <>
              {
                state && state.unfoldMore && state.unfoldMore ?
                  <span className="unfold-icon"><UnfoldLessIcon style={{ fontSize: '30px' }} onClick={() => { setState({ ...state, unfoldMore: false }) }} /></span> :
                  <span className="unfold-icon"><UnfoldMoreIcon style={{ fontSize: '30px' }} onClick={() => { setState({ ...state, unfoldMore: true }) }} /></span>

              }
              <table className={"table_web"} style={{ border: "none" }} >
                <tr className="bill_header_row">
                  {
                    state && state.labels && state.labels.map((label) => {
                      return (
                        <th className={
                          // label.name === 'Category'
                          //   ?
                          //   "bill_table_head th_width_chargehead td-explanation-android"
                          //   :
                          //   label.name === 'Hospital Charges'
                          //     ?
                          //     "bill_table_head th_width_hospital td-explanation-android"
                          //     :
                          "bill_table_head td-explanation-android"}>
                          {label.name}
                        </th>
                      );
                    })}
                </tr>
                {Object.keys(data).map((key, index) =>
                  <>
                    {
                      key === "_id" ? null :
                        key === "payable" || key === "SI_balance"
                          ?
                          <>
                            {EOBSubCatRow(data[key], index, key)}
                          </>
                          :
                          (
                            // (
                            // index === 0
                            //   ||
                            //   (
                            //     key === "deductions" && data.deductions.charges_post_deductions.insuranceCoverAmount != data.chargeheads.total_treatment_charges.insuranceCoverAmount
                            //     ||
                            //     key === "copay" && data.copay.post_applying_copay.insuranceCoverAmount != data.deductions.charges_post_deductions.insuranceCoverAmount
                            //     ||
                            //     key === "sublimits" && data.sublimits.total_post_sublimits.insuranceCoverAmount != data.copay.post_applying_copay.insuranceCoverAmount
                            //   )
                            // )
                            // &&
                            // JSON.stringify(data) === JSON.stringify(tpaExplanation)
                            true
                              ?
                              <>
                                {data[key].name ?
                                  <tr>
                                    <td colSpan="12" className="seperation-tr" >{data[key].name}</td>
                                  </tr>
                                  : null}
                                {
                                  Object.keys(data[key]).map((key1, index1) =>
                                    <>
                                      {key1 != "name" && EOBSubCatRow(data[key][key1], index1, key, key1)}
                                    </>
                                  )
                                }
                              </>
                              : null)
                    }
                  </>
                )}
              </table>
            </>
            // : <h3 style={{ textAlign: "center", marginTop: "10%" }}>There is something wrong with the claim details submitted:<br /><div style={{ color: "red" }}>{data}</div></h3>
            : "Loading"
        }
      </div>
      {
        JSON.stringify(data) === JSON.stringify(tpaExplanation)
          ?
          <div style={{ textAlign: 'center', margin: '25px 0px' }}>
            <button
              type="button"
              className='back-btn primary-button'
              onClick={() => handleClaimStatus('123', 'reject')}
            >
              Reject
            </button>
            <button
              type="button"
              className="next-btn primary-button"
              onClick={() => handleClaimStatus('456', 'approve')}
            >
              Approve
            </button>
          </div>
          :
          <div style={{ textAlign: 'center', margin: '25px 0px' }}>
            <button
              type="button"
              className='back-btn primary-button'
              onClick={() => handleClaimStatus('123', 'reject')}
            >
              Reject
            </button>
            <button
              type="button"
              className='back-btn primary-button'
              onClick={() => {
                setData(tpaExplanation)
              }}
            >
              Reset To Original
            </button>
            <button
              type="button"
              className="next-btn primary-button"
              onClick={() => handleClaimStatus('456', 'override')}
            >
              Approve with changes
            </button>
          </div>
      }
    </>
  )
}

TPAExplanation.propTypes = {
  loading: PropTypes.bool,
  onTPAExplanation: PropTypes.func,
  onHandleClaimStatus: PropTypes.func,
  tpaExplanation: PropTypes.object,
  error: PropTypes.object
};

const mapStateToProps = createStructuredSelector({
  tpaExplanation: makeSelectTPAExplanation(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onTPAExplanation: evt => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      console.log('event called', evt);
      dispatch(tpaExplanationRequest(evt));
    },
    onHandleClaimStatus: evt => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      console.log('handle event called', evt);
      dispatch(tpaClaimStatusRequest(evt));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withRouter,
  withConnect,
  memo,
)(withRouter(TPAExplanation));