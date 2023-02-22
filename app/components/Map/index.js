import React, { Component } from "react";
import { connect } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  InfoWindow,
  Marker,
} from "react-google-maps";
import Geocode from "react-geocode";
// import Autocomplete from 'react-google-autocomplete';
import Autocomplete from "./Autocomplete";
import Grid from "@material-ui/core/Grid";

import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { Image } from "semantic-ui-react";

import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Modal from "@material-ui/core/Modal";
import CancelIcon from "@material-ui/icons/Cancel";
import Card from "@material-ui/core/Card";

import Slider from "@material-ui/core/Slider";

import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";

import {
  setupShopRequest,
  setupShopPageInit,
  updateShopRequest,
  uploadSpAvatar,
} from "../../containers/SP/RegisterSP/actions";
// import FlashMessage from '../FlashMessage/FlashMessage';
// import Spinner from '../Spinner/Spinner';
import { UserDetails, GetLocation } from "../../helpers/helpers";

//saga elements

import { createStructuredSelector } from "reselect";

import { makeSelectSPRegister } from "../../containers/SP/RegisterSP/selectors";

import StorefrontIcon from "@material-ui/icons/Storefront";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import MyLocationIcon from '@material-ui/icons/MyLocation';

const categories = {
  automotiveandtransport : require("../../images/Automotive_&_Transport.svg"),
  automotiveandtransportSelected : require("../../images/Automotive_&_Transport_select.svg"),
  businessandfinance : require("../../images/Business_&_Finance.svg"),
  businessandfinanceSelected : require("../../images/Business_&_Finance_select.svg"),
  chemicalsandconstructionmaterials : require("../../images/Chemicals_&_Materials.svg"),
  chemicalsandconstructionmaterialsSelected : require("../../images/Chemicals_&_Materials_select.svg"),
  consumergoodsandservices : require("../../images/Consumer_Goods_&_Services.svg"),
  consumergoodsandservicesSelected : require("../../images/Consumer_Goods_&_Services_select.svg"),
  foodandgroceries : require("../../images/Food_&_Groceries.svg"),
  foodandgroceriesSelected : require("../../images/Food_&_Groceries_select.svg"),
  governmentandutilities : require("../../images/Government_&_Utilities.svg"),
  governmentandutilitiesSelected : require("../../images/Government_&_Utilities_select.svg"),
  healthcareandpharmaceutical : require("../../images/Healthcare_&_Pharmaceutical.svg"),
  healthcareandpharmaceuticalSelected : require("../../images/Healthcare_&_Pharmaceutical_select.svg"),
  householdsupplies : require("../../images/Household_Supplies.svg"),
  householdsuppliesSelected : require("../../images/Household_Supplies_select.svg"),
  placesofworship : require("../../images/Places_of_Worship.svg"),
  placesofworshipSelected : require("../../images/Places_of_Worship_select.svg"),
  liquor : require("../../images/Liquor.svg"),
  liquorSelected : require("../../images/Liquor_select.svg"),
  sportsgamingandentertainment : require("../../images/Sports.svg"),
  sportsgamingandentertainmentSelected : require("../../images/Sports_select.svg"),
}

let backicon = require("../../images/back_icon.svg");
let gpicon = require("../../images/google_pin.svg");
let cuicon = require("../../images/camera_upload.svg");

const GoogleMapsAPI = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

Geocode.setApiKey(GoogleMapsAPI);
Geocode.enableDebug();
console.log(GoogleMapsAPI);
class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      steps: 0,
      mapView: true,
      modal: false,
      imageUpload: null,
      shoptype: "",
      shopname: "",
      shopdesc: "",
      fulladdress: "",
      address: "",
      city: "",
      area: "",
      state: "",
      landmark: "",
      mapPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng,
      },
      markerPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng,
      },
      opens_at: "10:00",
      closes_at: "20:00",
      break_start: "12:00",
      break_end: "13:00",
      weekly_off: [],
      // slot_limit: "",
      serving_duration: 1,
      max_concurrency: "",
      token_threshold: "",
    };
    // this.handleImage = this.handleImage.bind(this);
    // this.handleClose = this.handleClose.bind(this);
    // this.onDrop = this.onDrop.bind(this);
  }

  /**
   * Get the current address from the default map position and set those values in the state
   */
  componentDidMount() {
    Geocode.fromLatLng(
      this.state.mapPosition.lat,
      this.state.mapPosition.lng
    ).then(
      (response) => {
        const fulladdress = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray);

        console.log("city", city, area, state);

        this.setState({
          fulladdress: fulladdress ? fulladdress : "",
          address: fulladdress ? fulladdress : "",
          area: area ? area : "",
          city: city ? city : "",
          state: state ? state : "",
        });
        console.log("component address called", this.state);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  /**
   * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
   *
   * @param nextProps
   * @param nextState
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.markerPosition.lat !== this.props.center.lat ||
      this.state.mapView !== nextState.mapView ||
      this.state.fulladdress !== nextState.fulladdress ||
      this.state.address !== nextState.address ||
      this.state.city !== nextState.city ||
      this.state.area !== nextState.area ||
      this.state.state !== nextState.state ||
      this.state.shopname !== nextState.shopname ||
      this.state.shopdesc !== nextState.shopdesc ||
      this.state.shoptype !== nextState.shoptype ||
      this.state.steps !== nextState.steps ||
      this.state.opens_at !== nextState.opens_at ||
      this.state.closes_at !== nextState.closes_at ||
      this.state.break_start !== nextState.break_start ||
      this.state.break_end !== nextState.break_end ||
      // this.state.slot_limit !== nextState.slot_limit ||
      this.state.max_concurrency !== nextState.max_concurrency ||
      this.state.weekly_off !== nextState.weekly_off ||
      this.state.modal !== nextState.modal
    ) {
      return true;
    } else if (this.props.center.lat === nextProps.center.lat) {
      return false;
    }
  }
  /**
   * Get the city and set the city input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getCity = (addressArray) => {
    let city = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        "administrative_area_level_2" === addressArray[i].types[0]
      ) {
        city = addressArray[i].long_name;
        return city;
      }
    }
  };
  /**
   * Get the area and set the area input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getArea = (addressArray) => {
    let area = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray[i].types.length; j++) {
          if (
            "sublocality_level_1" === addressArray[i].types[j] ||
            "locality" === addressArray[i].types[j]
          ) {
            area = addressArray[i].long_name;
            return area;
          }
        }
      }
    }
  };
  /**
   * Get the address and set the address input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getState = (addressArray) => {
    let state = "";
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (
          addressArray[i].types[0] &&
          "administrative_area_level_1" === addressArray[i].types[0]
        ) {
          state = addressArray[i].long_name;
          return state;
        }
      }
    }
  };
  /**
   * And function for city,state and address input
   * @param event
   */
  onChange = (event) => {
    console.log("event for input", event, event.target.ariaValueNow);
    this.setState({
      [event.target.name]: event.target.value || event.target.ariaValueNow,
    });
  };
  /**
   * This Event triggers when the marker window is closed
   *
   * @param event
   */
  onInfoWindowClose = (event) => {};

  /**
   * When the marker is dragged you get the lat and long using the functions available from event object.
   * Use geocode to get the address, city, area and state from the lat and lng positions.
   * And then set those values in the state.
   *
   * @param event
   */
  onMarkerDragEnd = (event) => {
    let newLat = event.latLng.lat(),
      newLng = event.latLng.lng();

    Geocode.fromLatLng(newLat, newLng).then(
      (response) => {
        const fulladdress = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray);
        this.setState({
          fulladdress: fulladdress ? fulladdress : "",
          address: fulladdress ? fulladdress : "",
          area: area ? area : "",
          city: city ? city : "",
          state: state ? state : "",
          markerPosition: {
            lat: newLat,
            lng: newLng,
          },
          mapPosition: {
            lat: newLat,
            lng: newLng,
          },
        });
        console.log("component address marker called ", this.state);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  /**
   * When the user types an address in the search box
   * @param place
   */
  onPlaceSelected = (place) => {
    console.log("plc", place);
    const fulladdress = place.formatted_address,
      addressArray = place.address_components,
      city = this.getCity(addressArray),
      area = this.getArea(addressArray),
      state = this.getState(addressArray),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng();
    // Set these values in the state.
    this.setState({
      fulladdress: fulladdress ? fulladdress : "",
      address: fulladdress ? fulladdress : "",
      area: area ? area : "",
      city: city ? city : "",
      state: state ? state : "",
      markerPosition: {
        lat: latValue,
        lng: lngValue,
      },
      mapPosition: {
        lat: latValue,
        lng: lngValue,
      },
    });
    console.log("component address place called ", this.state);
  };

  // componentDidUpdate(prevProps, prevState) {
  // 	// reset form
  // 	if (Object.keys(this.props.shop).length > 0) {
  // 		this.formik.resetForm();
  // 	}
  // }

  onSubmit = (e) => {
    e.preventDefault();

    console.log(this.state, UserDetails());

    let setupShopData = {
      sc_id: UserDetails().id,
      sp_type: this.state.shoptype,
      sp_name: this.state.shopname,
      sp_desc: this.state.shopdesc,
      sp_address: {
        fulladdress: this.state.fulladdress,
        address: this.state.address,
        landmark: this.state.landmark,
        area: this.state.area,
        city: this.state.city,
        state: this.state.state,
      },
      sp_geo: {
        lat: this.state.markerPosition.lat,
        lng: this.state.markerPosition.lng,
      },
      sp_details: {
        opensAt: this.state.opens_at,
        closesAt: this.state.closes_at,
        breakStartsAt: this.state.break_start,
        breakEndsAt: this.state.break_end,
        weeklyOff: this.state.weekly_off,
        // slotLimit: this.state.slot_limit,
        servingDuration: this.state.serving_duration * 60000,
        maxConcurrency: this.state.max_concurrency,
        tokenThreshold: this.state.token_threshold,
      },
    };

    if (Object.keys(this.props.shopDetails.Shop).length > 0) {
      if (!setupShopData.sp_type) {
        setupShopData.sp_type = this.props.shopDetails.Shop[0].sp_type;
      }

      if (!setupShopData.sp_name) {
        setupShopData.sp_name = this.props.shopDetails.Shop[0].sp_name;
      }

      if (!setupShopData.sp_desc) {
        setupShopData.sp_desc = this.props.shopDetails.Shop[0].sp_desc;
      }

      if (!setupShopData.sp_address.landmark) {
        setupShopData.sp_address.landmark = this.props.shopDetails.Shop[0].sp_address.landmark;
      }

      if (!setupShopData.sp_address.address) {
        setupShopData.sp_address.address = this.props.shopDetails.Shop[0].sp_address.address;
      }

      if (!setupShopData.sp_details.opensAt) {
        setupShopData.sp_details.opensAt = this.props.shopDetails.Shop[0].sp_details.opensAt;
      }

      if (!setupShopData.sp_details.closesAt) {
        setupShopData.sp_details.closesAt = this.props.shopDetails.Shop[0].sp_details.closesAt;
      }

      if (!setupShopData.sp_details.breakStartsAt) {
        setupShopData.sp_details.breakStartsAt = this.props.shopDetails.Shop[0].sp_details.breakStartsAt;
      }

      if (!setupShopData.sp_details.breakEndsAt) {
        setupShopData.sp_details.breakEndsAt = this.props.shopDetails.Shop[0].sp_details.breakEndsAt;
      }

      if (!setupShopData.sp_details.weeklyOff) {
        setupShopData.sp_details.weeklyOff = this.props.shopDetails.Shop[0].sp_details.weeklyOff;
      }

      if (!setupShopData.sp_details.slotLimit) {
        setupShopData.sp_details.slotLimit = this.props.shopDetails.Shop[0].sp_details.slotLimit;
      }

      if (!setupShopData.sp_details.servingDuration) {
        setupShopData.sp_details.servingDuration = this.props.shopDetails.Shop[0].sp_details.servingDuration;
      }

      if (!setupShopData.sp_details.maxConcurrency) {
        setupShopData.sp_details.maxConcurrency = this.props.shopDetails.Shop[0].sp_details.maxConcurrency;
      }

      setupShopData.sp_id = this.props.shopDetails.Shop[0]._id;

      console.log("sending to props", setupShopData);
      this.props.onUpdateSubmitForm(setupShopData);
    } else {
      this.props.onSubmitForm(setupShopData);
    }
  };

  handleStepNext = () => {
    console.log("data on basic step", this.state);
    this.setState({ steps: this.state.steps + 1 });
  };

  handleStepPrev = () => {
    console.log("data on basic step", this.state);
    this.setState({ steps: this.state.steps - 1 });
  };

  handleClose = () => {
    this.setState({ modal: false });
  };

  handleImage = () => {
    console.log("aaya idhar");

    this.setState({ modal: true });
  };

  onDrop(picture, text) {
    if (text === "file") {
      console.log(picture.target.files);

      let imageFormObj = new FormData();
      imageFormObj.append("imageName", "multer-image-" + Date.now());
      imageFormObj.append("file", picture.target.files[0]);
      console.log("imageFormObj", imageFormObj);
      if (this.props.shopDetails.Shop[0]) {
        console.log("this.props.shopDetails", this.props);
        let data = {
          id: this.props.shopDetails.Shop[0]
            ? this.props.shopDetails.Shop[0]._id
            : null,
          file: imageFormObj,
        };
        this.props.onAvatarSubmitForm(data);
      }
    }

    this.setState({
      modal: false,
    });
  }

  setSelectedCategory = (category) => {
    console.log("call for set category with val", category);
    this.setState({ shoptype: category });
  };

  setMapView = (val) => {
    this.setState({ mapView: val });
  };

  handleOffSetDay = (day) => {
    var array = [...this.state.weekly_off];
    var index = array.indexOf(day);
    if (index > -1) {
      array.splice(index, 1);
      this.setState({ weekly_off: array});
      console.log('poped ', this.state);
    } else {
      let concated = array.concat(day);
      this.setState({ weekly_off: concated });
      console.log('pushed ', this.state);
    }
  };

  fetchCurrLocation = () => {
    GetLocation().then((res)=>{
      Geocode.fromLatLng(res.lat, res.lng).then(
        (response) => {
          const fulladdress = response.results[0].formatted_address,
            addressArray = response.results[0].address_components,
            city = this.getCity(addressArray),
            area = this.getArea(addressArray),
            state = this.getState(addressArray);
          this.setState({
            fulladdress: fulladdress ? fulladdress : "",
            address: fulladdress ? fulladdress : "",
            area: area ? area : "",
            city: city ? city : "",
            state: state ? state : "",
            mapPosition: {
              ...this.state.mapPosition,
              lat: res.lat,
              lng: res.lng
            },
            markerPosition: {
              ...this.state.markerPosition,
              lat: res.lat,
              lng: res.lng
            }
          });
          console.log("my location called ", this.state);
        },
        (error) => {
          console.error(error);
        }
      );
      // this.setState({
      //   mapPosition: {
      //     ...this.state.mapPosition,
      //     lat: res.lat,
      //     lng: res.lng
      //   },
      //   markerPosition: {
      //     ...this.state.markerPosition,
      //     lat: res.lat,
      //     lng: res.lng
      //   }
      // });

      // console.log("got the current location",res, this.state.mapPosition);
    });
  };


  render() {
    const marks = [
      {
        value: 1,
        label: "1 Min",
      },
      {
        value: 60,
        label: "60 Min",
      },
    ];

    console.log("this.state", this.state);
    console.log("selector called here", this.props.shopDetails);
    const AsyncMap = withScriptjs(
      withGoogleMap((props) => (
        <GoogleMap
          google={this.props.google}
          defaultZoom={this.props.zoom}
          defaultCenter={{
            lat: this.state.mapPosition.lat,
            lng: this.state.mapPosition.lng,
          }}
          options={{ streetViewControl: false }}
        >
          {/* InfoWindow on top of marker */}
          <InfoWindow
            onClose={this.onInfoWindowClose}
            position={{
              lat: this.state.markerPosition.lat + 0.0018,
              lng: this.state.markerPosition.lng,
            }}
          >
            <div>
              <span style={{ padding: 0, margin: 0 }}>
                {this.state.fulladdress}
              </span>
            </div>
          </InfoWindow>
          {/*Marker*/}
          <Marker
            google={this.props.google}
            name={"Dolores park"}
            draggable={true}
            onDragEnd={this.onMarkerDragEnd}
            position={{
              lat: this.state.markerPosition.lat,
              lng: this.state.markerPosition.lng,
            }}
          />
          <Marker />
          {/* For Auto complete Search Box */}
          <Autocomplete
            // style={{
            // 	width: '100%',
            // 	height: '40px',
            // 	paddingLeft: '16px',
            // 	marginTop: '2px',
            // 	marginBottom: '500px'
            // }}
            onPlaceSelected={this.onPlaceSelected}
            // types={['(regions)']}
            className="location-input"
          />
          <Button className="curr-location-btn" onClick={this.fetchCurrLocation}><MyLocationIcon /></Button>
        </GoogleMap>
      ))
    );

    let map;
    if (this.props.center.lat !== undefined) {
      if (Object.keys(this.props.shopDetails.Shop).length > 0) {
        //My shop
        console.log("good to go mate", this.props.shopDetails.Shop);

        let ShopDetails = this.props.shopDetails.Shop[0];
        console.log("good to go mate2", ShopDetails);

        map = (
          <div>
            <Grid>
              <AsyncMap
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPI}&libraries=places`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: this.props.height }} />}
                mapElement={<div style={{ height: `100%` }} />}
                className="map-wrapper"
              />
            </Grid>

            <Grid columns={1} className="map-add-details">
              <Grid.Row>
                <div>
                  {/* {this.props.requesting 
                        // && 
                        // <Spinner />
                        
                        } */}
                  <div className="row">
                    {/* <div className="col-md-6 mx-auto">
									{console.log(this.props.errors)}
									{Object.keys(this.props.errors).length > 0 &&
										<div>
											<FlashMessage data={this.props.errors.e ? this.props.errors.e.error : "Issue with registeration"} alertClass="danger" />
										</div>
									}
									{Object.keys(this.props.shop).length > 0 &&
										<div>
											<FlashMessage data={this.props.shop.message} alertClass="success" />
										</div>
									}
								</div> */}
                  </div>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                  <Modal
                    open={this.state.modal}
                    onClose={this.handleClose}
                    disableBackdropClick={true}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: `translate(-50%, -50%)`,
                        padding: "15px",
                        backgroundColor: "#fff",
                      }}
                    >
                      <CancelIcon
                        style={{ float: "right" }}
                        onClick={this.handleClose}
                      />
                      <h4>Upload: Shop Image</h4>
                      <input
                        type="file"
                        onChange={(e) => this.onDrop(e, "file")}
                      />
                    </div>
                    {/* <Button primary onClick={this.handleClose}>Submit</Button> */}
                  </Modal>
                  <Avatar
                    className="profile-avatar"
                    src={
                      this.props.shopDetails &&
                      this.props.shopDetails.Shop &&
                      this.props.shopDetails.Shop[0].profile_pic
                        ? this.props.shopDetails.Shop[0].profile_pic
                        : "images/avatar.jpg"
                    }
                    onClick={this.handleImage.bind(this)}
                  />
                </div>

                <form onSubmit={this.onSubmit}>
                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <InputLabel id="shoptypelabel">
                      Please select your shop Category
                    </InputLabel>
                    <Select
                      labelId="shoptypelabel"
                      id="shoptype"
                      name="shoptype"
                      // value={ "groceries"}
                      onChange={this.onChange}
                      required
                      className="form-control text-input error shopname-input"
                      placeholder="Please select a category"
                      defaultValue={ShopDetails.sp_type}
                    >
                      <MenuItem value="supermarket">Supermarket</MenuItem>
                      <MenuItem value="wines">Wines & Spirits</MenuItem>
                      <MenuItem value="pharmacy">Pharmacy</MenuItem>
                      <MenuItem value="meat">Meat & Fish</MenuItem>
                      <MenuItem value="cafe">Cafe & Restaurant</MenuItem>
                      <MenuItem value="salon">Hair & Beauty Salon</MenuItem>
                      <MenuItem value="boutiques">Boutiques</MenuItem>
                      <MenuItem value="kirana">Kirana</MenuItem>
                      <MenuItem value="bakery">Bakery</MenuItem>
                    </Select>
                    {/* <FormHelperText>*</FormHelperText> */}
                  </div>

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      id="shopname"
                      label="Your Shop Name"
                      name="shopname"
                      required
                      onChange={this.onChange}
                      // onBlur={handleBlur}
                      className="form-control text-input error shopname-input"
                      // value={this.state.shopname}
                      variant="outlined"
                      // onChange={this.onChange}
                      placeholder="eg: Reliance Mart"
                      defaultValue={ShopDetails.sp_name}
                    />
                    {/* {errors.address && touched.address && (
												<div className="input-feedback">{errors.address}</div>
											)} */}
                  </div>

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      id="fulladdress"
                      label="Full Address"
                      name="fulladdress"
                      required
                      // onChange={handleChange}
                      // onBlur={handleBlur}
                      className="form-control text-input error address-input"
                      value={ShopDetails.sp_address.fulladdress}
                      variant="outlined"
                      onChange={this.onChange}
                    />
                    {/* {errors.address && touched.address && (
												<div className="input-feedback">{errors.address}</div>
											)} */}
                  </div>

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      id="address"
                      label="Address"
                      name="address"
                      required
                      // onChange={handleChange}
                      // onBlur={handleBlur}
                      className="form-control text-input error address-input"
                      defaultValue={ShopDetails.sp_address.address}
                      variant="outlined"
                      onChange={this.onChange}
                    />
                    {/* {errors.address && touched.address && (
												<div className="input-feedback">{errors.address}</div>
											)} */}
                  </div>

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      id="area"
                      label="Area"
                      required
                      // onChange={handleChange}
                      // onBlur={handleBlur}
                      className="form-control text-input error area-input"
                      value={ShopDetails.sp_address.area}
                      variant="outlined"
                      onChange={this.onChange}
                    />
                    {/* {errors.area && touched.area && (
												<div className="input-feedback">{errors.area}</div>
											)} */}
                  </div>

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      id="city"
                      label="City"
                      required
                      // onChange={handleChange}
                      // onBlur={handleBlur}
                      className="form-control text-input error city-input"
                      value={ShopDetails.sp_address.city}
                      variant="outlined"
                      onChange={this.onChange}
                    />
                    {/* {errors.city && touched.city && (
												<div className="input-feedback">{errors.city}</div>
											)} */}
                  </div>

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      id="state"
                      label="State"
                      required
                      // onChange={handleChange}
                      // onBlur={handleBlur}
                      className="form-control text-input error state-input"
                      value={ShopDetails.sp_address.state}
                      variant="outlined"
                      onChange={this.onChange}
                    />
                    {/* {errors.state && touched.state && (
												<div className="input-feedback">{errors.state}</div>
											)} */}
                  </div>

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      id="landmark"
                      label="Landmark"
                      name="landmark"
                      // onChange={handleChange}
                      // onBlur={handleBlur}
                      className="form-control text-input error state-input"
                      // value={this.state.landmark}
                      variant="outlined"
                      onChange={this.onChange}
                      defaultValue={ShopDetails.sp_address.landmark || ""}
                    />
                    {/* {errors.state && touched.state && (
												<div className="input-feedback">{errors.state}</div>
											)} */}
                  </div>

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      id="shopdesc"
                      label="Your Shop Description"
                      name="shopdesc"
                      required
                      multiline
                      rows={4}
                      onChange={this.onChange}
                      className="form-control text-input error shopname-input"
                      variant="outlined"
                      // onChange={this.onChange}
                      placeholder="eg: We provide fresh groceries"
                      defaultValue={ShopDetails.sp_desc}
                    />
                    {/* {errors.address && touched.address && (
												<div className="input-feedback">{errors.address}</div>
											)} */}
                  </div>

                  {/*Add shop details here open time ,closing time, threshold ,etc*/}

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      required
                      id="opens_at"
                      label="Opens At"
                      type="time"
                      name="opens_at"
                      onChange={this.onChange}
                      defaultValue={ShopDetails.sp_details.opensAt}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        step: 300, // 5min
                      }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      required
                      id="closes_at"
                      label="Closes At"
                      type="time"
                      name="closes_at"
                      onChange={this.onChange}
                      defaultValue={ShopDetails.sp_details.closesAt}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        step: 300, // 5min
                      }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      required
                      id="break_start"
                      label="Break Starts At"
                      type="time"
                      name="break_start"
                      onChange={this.onChange}
                      defaultValue={ShopDetails.sp_details.breakStartsAt}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        step: 300, // 5min
                      }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      required
                      id="break_end"
                      label="Break Ends At"
                      type="time"
                      name="break_end"
                      onChange={this.onChange}
                      defaultValue={ShopDetails.sp_details.breakEndsAt}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        step: 300, // 5min
                      }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <InputLabel id="weeklyofflabel">
                      Please select week off day{" "}
                    </InputLabel>
                    <Select
                      labelId="weeklyofflabel"
                      id="weeklyoff"
                      name="weeklyoff"
                      // value={ "groceries"}
                      onChange={this.onChange}
                      className="form-control text-input error shopname-input"
                      placeholder="Please select a week day"
                      defaultValue={ShopDetails.sp_details.weeklyOff}
                    >
                      <MenuItem value="monday">Monday</MenuItem>
                      <MenuItem value="tuesday">Tuesday</MenuItem>
                      <MenuItem value="wednesday">Wednesday</MenuItem>
                      <MenuItem value="thursday">Thursday</MenuItem>
                      <MenuItem value="friday">Friday</MenuItem>
                      <MenuItem value="saturday">Saturday</MenuItem>
                      <MenuItem value="sunday">Sunday</MenuItem>
                    </Select>
                    {/* <FormHelperText>*</FormHelperText> */}
                  </div>

                  {/* <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      required
                      id="slotlimit"
                      label="Slot Limit"
                      type="number"
                      name="slotlimit"
                      onChange={this.onChange}
                      defaultValue={ShopDetails.sp_details.slotLimit}
                    />
                  </div> */}

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      required
                      id="servingDuration"
                      label="Serving Duration"
                      type="number"
                      name="servingduration"
                      onChange={this.onChange}
                      defaultValue={ShopDetails.sp_details.servingDuration}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      required
                      id="maxconcurrency"
                      label="Maximum Concurrency"
                      type="number"
                      name="maxconcurrency"
                      onChange={this.onChange}
                      defaultValue={ShopDetails.sp_details.maxConcurrency}
                    />
                  </div>

                  <Grid.Column>
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ color: "#ded6f5", width: "47%" }}
                      type="submit"
                      className="add-location-next-button"
                    >
                      Update Shop
                    </Button>
                  </Grid.Column>
                </form>
              </Grid.Row>
            </Grid>
          </div>
        );
      } else {
        //New Shop registeration logic
        map = (
          <div>
            <Grid>
              <AsyncMap
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPI}&libraries=places`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: this.props.height }} />}
                mapElement={<div style={{ height: `100%` }} />}
                className="map-wrapper"
              />
            </Grid>

            <Grid columns={1} className="map-add-details">
              <Grid.Row>
                <div>
                  {/* {this.props.requesting 
                        // && 
                        // <Spinner />
                        
                        } */}
                  <div className="row">
                    {/* <div className="col-md-6 mx-auto">
									{console.log(this.props.errors)}
									{Object.keys(this.props.errors).length > 0 &&
										<div>
											<FlashMessage data={this.props.errors.e ? this.props.errors.e.error : "Issue with registeration"} alertClass="danger" />
										</div>
									}
									{Object.keys(this.props.shop).length > 0 &&
										<div>
											<FlashMessage data={this.props.shop.message} alertClass="success" />
										</div>
									}
								</div> */}
                  </div>
                </div>

                <form onSubmit={this.onSubmit}>
                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <InputLabel id="shoptypelabel">
                      Please select your shop Category
                    </InputLabel>
                    <Select
                      labelId="shoptypelabel"
                      id="shoptype"
                      name="shoptype"
                      // value={ "groceries"}
                      onChange={this.onChange}
                      required
                      className="form-control text-input error shopname-input"
                      placeholder="Please select a category"
                    >
                      <MenuItem value="supermarket">Supermarket</MenuItem>
                      <MenuItem value="wines">Wines & Spirits</MenuItem>
                      <MenuItem value="pharmacy">Pharmacy</MenuItem>
                      <MenuItem value="meat">Meat & Fish</MenuItem>
                      <MenuItem value="cafe">Cafe & Restaurant</MenuItem>
                      <MenuItem value="salon">Hair & Beauty Salon</MenuItem>
                      <MenuItem value="boutiques">Boutiques</MenuItem>
                      <MenuItem value="kirana">Kirana</MenuItem>
                      <MenuItem value="bakery">Bakery</MenuItem>
                    </Select>
                    {/* <FormHelperText>*</FormHelperText> */}
                  </div>

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      id="shopname"
                      label="Your Shop Name"
                      name="shopname"
                      required
                      onChange={this.onChange}
                      // onBlur={handleBlur}
                      className="form-control text-input error shopname-input"
                      // value={this.state.shopname}
                      variant="outlined"
                      // onChange={this.onChange}
                      placeholder="eg: Reliance Mart"
                    />
                    {/* {errors.address && touched.address && (
												<div className="input-feedback">{errors.address}</div>
											)} */}
                  </div>

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      id="fulladdress"
                      label="Full Address"
                      name="fulladdress"
                      required
                      // onChange={handleChange}
                      // onBlur={handleBlur}
                      className="form-control text-input error address-input"
                      value={this.state.fulladdress}
                      variant="outlined"
                      onChange={this.onChange}
                    />
                    {/* {errors.address && touched.address && (
												<div className="input-feedback">{errors.address}</div>
											)} */}
                  </div>

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      id="address"
                      label="Address"
                      name="address"
                      required
                      // onChange={handleChange}
                      // onBlur={handleBlur}
                      className="form-control text-input error address-input"
                      defaultValue={this.state.address}
                      variant="outlined"
                      onChange={this.onChange}
                    />
                    {/* {errors.address && touched.address && (
												<div className="input-feedback">{errors.address}</div>
											)} */}
                  </div>

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      id="area"
                      label="Area"
                      required
                      // onChange={handleChange}
                      // onBlur={handleBlur}
                      className="form-control text-input error area-input"
                      value={this.state.area}
                      variant="outlined"
                      onChange={this.onChange}
                    />
                    {/* {errors.area && touched.area && (
												<div className="input-feedback">{errors.area}</div>
											)} */}
                  </div>

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      id="city"
                      label="City"
                      required
                      // onChange={handleChange}
                      // onBlur={handleBlur}
                      className="form-control text-input error city-input"
                      value={this.state.city}
                      variant="outlined"
                      onChange={this.onChange}
                    />
                    {/* {errors.city && touched.city && (
												<div className="input-feedback">{errors.city}</div>
											)} */}
                  </div>

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      id="state"
                      label="State"
                      required
                      // onChange={handleChange}
                      // onBlur={handleBlur}
                      className="form-control text-input error state-input"
                      value={this.state.state}
                      variant="outlined"
                      onChange={this.onChange}
                    />
                    {/* {errors.state && touched.state && (
												<div className="input-feedback">{errors.state}</div>
											)} */}
                  </div>

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      id="landmark"
                      label="Landmark"
                      name="landmark"
                      // required
                      // onChange={handleChange}
                      // onBlur={handleBlur}
                      className="form-control text-input error state-input"
                      // value={this.state.landmark}
                      variant="outlined"
                      onChange={this.onChange}
                    />
                    {/* {errors.state && touched.state && (
												<div className="input-feedback">{errors.state}</div>
											)} */}
                  </div>
                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      id="shopdesc"
                      label="Your Shop Description"
                      name="shopdesc"
                      required
                      multiline
                      rows={4}
                      onChange={this.onChange}
                      // onBlur={handleBlur}
                      className="form-control text-input error shopname-input"
                      // value={this.state.shopname}
                      variant="outlined"
                      // onChange={this.onChange}
                      placeholder="eg: We provide fresh groceries"
                    />
                    {/* {errors.address && touched.address && (
												<div className="input-feedback">{errors.address}</div>
											)} */}
                  </div>

                  {/*Add shop details here open time ,closing time, threshold ,etc*/}

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      required
                      id="opens_at"
                      label="Open At"
                      type="time"
                      name="opens_at"
                      onChange={this.onChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        step: 300, // 5min
                      }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      required
                      id="closes_at"
                      label="Close At"
                      type="time"
                      name="closes_at"
                      onChange={this.onChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        step: 300, // 5min
                      }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      required
                      id="break_start"
                      label="Break Start At"
                      type="time"
                      name="break_start"
                      onChange={this.onChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        step: 300, // 5min
                      }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      required
                      id="break_end"
                      label="Break End At"
                      type="time"
                      name="break_end"
                      onChange={this.onChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        step: 300, // 5min
                      }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <InputLabel id="weeklyofflabel">
                      Please select week off day{" "}
                    </InputLabel>
                    <Select
                      labelId="weeklyofflabel"
                      id="weeklyoff"
                      name="weeklyoff"
                      // value={ "groceries"}
                      onChange={this.onChange}
                      className="form-control text-input error shopname-input"
                      placeholder="Please select a week day"
                    >
                      <MenuItem value="monday">Monday</MenuItem>
                      <MenuItem value="tuesday">Tuesday</MenuItem>
                      <MenuItem value="wednesday">Wednesday</MenuItem>
                      <MenuItem value="thursday">Thursday</MenuItem>
                      <MenuItem value="friday">Friday</MenuItem>
                      <MenuItem value="saturday">Saturday</MenuItem>
                      <MenuItem value="sunday">Sunday</MenuItem>
                    </Select>
                    {/* <FormHelperText>*</FormHelperText> */}
                  </div>

                  {/* <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      required
                      id="slotlimit"
                      label="Slot Limit"
                      type="number"
                      name="slotlimit"
                      onChange={this.onChange}
                    />
                  </div> */}

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      required
                      id="servingDuration"
                      label="Serving Duration"
                      type="number"
                      name="servingduration"
                      onChange={this.onChange}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: "2rem" }}>
                    <TextField
                      required
                      id="maxconcurrency"
                      label="Maximum Concurrency"
                      type="number"
                      name="maxconcurrency"
                      onChange={this.onChange}
                    />
                  </div>

                  <Grid.Column>
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ color: "#ded6f5", width: "47%" }}
                      // onClick={handleSubmit} disabled={!isValid || isSubmitting}
                      //  disabled={!isValid}
                      type="submit"
                      className="add-location-next-button"
                    >
                      Setup My Shop
                    </Button>
                  </Grid.Column>
                </form>
              </Grid.Row>
            </Grid>
          </div>
        );
      }
    } else {
      map = <div style={{ height: this.props.height }} />;
    }

    //Write step Logic Here

    //Show step badge
    if (Object.keys(this.props.shopDetails.Shop).length > 0) {
      //My shop
      console.log("good to go mate", this.props.shopDetails.Shop);
      let ShopDetails = this.props.shopDetails.Shop[0];
      console.log("good to go mate2", ShopDetails);
      if (this.state.steps == 0) {
        return (
          <div>
            <Grid>
              <div style={{ marginBottom: "2rem" }}>
                <Modal
                  open={this.state.modal}
                  onClose={this.handleClose}
                  disableBackdropClick={true}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: `translate(-50%, -50%)`,
                      padding: "15px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <CancelIcon
                      style={{ float: "right" }}
                      onClick={this.handleClose}
                    />
                    <h4>Upload: Shop Image</h4>
                    <input
                      type="file"
                      onChange={(e) => this.onDrop(e, "file")}
                    />
                  </div>
                  {/* <Button primary onClick={this.handleClose}>Submit</Button> */}
                </Modal>
                {/* <Avatar
                  className="profile-avatar"
                  src={
                    this.props.shopDetails &&
                    this.props.shopDetails.Shop &&
                    this.props.shopDetails.Shop[0].profile_pic
                      ? this.props.shopDetails.Shop[0].profile_pic
                      : "images/avatar.jpg"
                  }
                  onClick={this.handleImage.bind(this)}
                /> */}
                {
                  this.props.shopDetails &&
                  this.props.shopDetails.Shop &&
                  this.props.shopDetails.Shop[0].profile_pic ? 
                  <img src={this.props.shopDetails.Shop[0].profile_pic} style={{ width: '100%', height: '30%' }} onClick={this.handleImage.bind(this)} /> : 
                  <div style={{ padding: '20px', textAlign: 'center' }} onClick={this.handleImage.bind(this)}>
                    <img src={cuicon} />
                    <p className="upload-text">Click here to upload your service photo</p>
                  </div>
                }
              </div>
            </Grid>
            <Grid>
              <h1
                className="head2"
                style={{ textAlign: "center", margin: "30px 0px" }}
              >
                Update Service Info (<Link to='/MyShop'>My Shop</Link>)
              </h1>
              <Grid style={{ textAlign: "center" }}>
                {/* <div className="form-group" style={{ marginBottom: "20px" }}> */}
                <div className="form-group" style={{ marginBottom: "2rem" }}>
                  <TextField
                    id="shopname"
                    label="Shop Name"
                    name="shopname"
                    required
                    onChange={this.onChange}
                    className="form-control text-input error shopname-input"
                    variant="outlined"
                    placeholder="eg: Reliance Mart"
                    // defaultValue={this.state.shopname}
                    defaultValue={ShopDetails.sp_name}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "2rem" }}>
                  <TextField
                    id="shopdesc"
                    label="Shop Description"
                    name="shopdesc"
                    required
                    multiline
                    rows={4}
                    onChange={this.onChange}
                    className="form-control text-input error shopname-input"
                    variant="outlined"
                    placeholder="eg: We provide fresh groceries"
                    // defaultValue={this.state.shopdesc}
                    defaultValue={ShopDetails.sp_desc}
                  />
                </div>

                {/* Category selection here*/}

                {/*<div className="form-group">
                  <h4 className="subtitle" style={{ margin: "15px 0px" }}>
                    Select category
                  </h4>
                  {console.log("selected category", this.state)}
                   <Grid container style={{ justifyContent: "center" }}>
                    <div
                      className={
                        "categoryBox " +
                        (ShopDetails.sp_type === "automotiveandtransport"
                          ? "selected"
                          : "")
                      }
                      onClick={() =>
                        this.setSelectedCategory("automotiveandtransport")
                      }
                    >
                      <Image src={ShopDetails.sp_type === 'automotiveandtransport' ? categories.automotiveandtransportSelected : categories.automotiveandtransport} />
                      <p className="categoryText" style={{ fontSize: "10px" }}>
                        Automotive & Transport
                      </p>
                    </div>

                    <div
                      className={
                        "categoryBox " +
                        (ShopDetails.sp_type === "businessandfinance"
                          ? "selected"
                          : "")
                      }
                      onClick={() =>
                        this.setSelectedCategory("businessandfinance")
                      }
                    >
                      <Image src={ShopDetails.sp_type === 'businessandfinance' ? categories.businessandfinanceSelected : categories.businessandfinance} />
                      <p className="categoryText" style={{ fontSize: "10px" }}>
                        Business & Finance
                      </p>
                    </div>

                    <div
                      className={
                        "categoryBox " +
                        (ShopDetails.sp_type ===
                        "chemicalsandconstructionmaterials"
                          ? "selected"
                          : "")
                      }
                      onClick={() =>
                        this.setSelectedCategory(
                          "chemicalsandconstructionmaterials"
                        )
                      }
                    >
                      <Image src={ShopDetails.sp_type === 'chemicalsandconstructionmaterials' ? categories.chemicalsandconstructionmaterialsSelected : categories.chemicalsandconstructionmaterials} />
                      <p className="categoryText" style={{ fontSize: "10px" }}>
                        Chemicals & Construction Materials
                      </p>
                    </div>

                    <div
                      className={
                        "categoryBox " +
                        (ShopDetails.sp_type === "consumergoodsandservices"
                          ? "selected"
                          : "")
                      }
                      onClick={() =>
                        this.setSelectedCategory("consumergoodsandservices")
                      }
                    >
                      <Image src={ShopDetails.sp_type === 'consumergoodsandservices' ? categories.consumergoodsandservicesSelected : categories.consumergoodsandservices} />
                      <p className="categoryText" style={{ fontSize: "10px" }}>
                        Consumer Goods & Services
                      </p>
                    </div>

                    <div
                      className={
                        "categoryBox " +
                        (ShopDetails.sp_type === "healthcareandpharmaceutical"
                          ? "selected"
                          : "")
                      }
                      onClick={() =>
                        this.setSelectedCategory("healthcareandpharmaceutical")
                      }
                    >
                      <Image src={ShopDetails.sp_type === 'healthcareandpharmaceutical' ? categories.healthcareandpharmaceuticalSelected : categories.healthcareandpharmaceutical} />
                      <p className="categoryText" style={{ fontSize: "10px" }}>
                        Healthcare & Pharmaceutical
                      </p>
                    </div>

                    <div
                      className={
                        "categoryBox " +
                        (ShopDetails.sp_type === "governmentandutilities"
                          ? "selected"
                          : "")
                      }
                      onClick={() =>
                        this.setSelectedCategory("governmentandutilities")
                      }
                    >
                      <Image src={ShopDetails.sp_type === 'governmentandutilities' ? categories.governmentandutilitiesSelected : categories.governmentandutilities} />
                      <p className="categoryText" style={{ fontSize: "10px" }}>
                        Government & Utilities
                      </p>
                    </div>

                    <div
                      className={
                        "categoryBox " +
                        (ShopDetails.sp_type === "placesofworship"
                          ? "selected"
                          : "")
                      }
                      onClick={() =>
                        this.setSelectedCategory("placesofworship")
                      }
                    >
                      <Image src={ShopDetails.sp_type === 'placesofworship' ? categories.placesofworshipSelected : categories.placesofworship} />
                      <p className="categoryText" style={{ fontSize: "10px" }}>
                        Places of Worship
                      </p>
                    </div>

                    <div
                      className={
                        "categoryBox " +
                        (ShopDetails.sp_type === "sportsgamingandentertainment"
                          ? "selected"
                          : "")
                      }
                      onClick={() =>
                        this.setSelectedCategory("sportsgamingandentertainment")
                      }
                    >
                      <Image src={ShopDetails.sp_type === 'sportsgamingandentertainment' ? categories.sportsgamingandentertainmentSelected : categories.sportsgamingandentertainment} />
                      <p className="categoryText" style={{ fontSize: "10px" }}>
                        Sports, Gaming & Entertainment
                      </p>
                    </div>

                    <div
                      className={
                        "categoryBox " +
                        (ShopDetails.sp_type === "householdsupplies"
                          ? "selected"
                          : "")
                      }
                      onClick={() =>
                        this.setSelectedCategory("householdsupplies")
                      }
                    >
                      <Image src={ShopDetails.sp_type === 'householdsupplies' ? categories.householdsuppliesSelected : categories.householdsupplies} />
                      <p className="categoryText" style={{ fontSize: "10px" }}>
                        Household Supplies
                      </p>
                    </div>

                    <div
                      className={
                        "categoryBox " +
                        (ShopDetails.sp_type === "foodandgroceries"
                          ? "selected"
                          : "")
                      }
                      onClick={() =>
                        this.setSelectedCategory("foodandgroceries")
                      }
                    >
                      <Image src={ShopDetails.sp_type === 'foodandgroceries' ? categories.foodandgroceriesSelected : categories.foodandgroceries} />
                      <p className="categoryText" style={{ fontSize: "10px" }}>
                        Food & Groceries
                      </p>
                    </div>

                    <div
                      className={
                        "categoryBox " +
                        (ShopDetails.sp_type === "liquor" ? "selected" : "")
                      }
                      onClick={() => this.setSelectedCategory("liquor")}
                    >
                      <Image src={ShopDetails.sp_type === 'liquor' ? categories.liquorSelected : categories.liquor} />
                      <p className="categoryText" style={{ fontSize: "10px" }}>
                        Liquor
                      </p>
                    </div> 
                </Grid>
                </div> */}
                {console.log("shop type", ShopDetails.sp_type)}
                {/* {Set Location Button} */}
                <div className="form-group">
                  <div style={{ margin: "30px" }}>
                    <button
                      onClick={this.handleStepNext}
                      className="login-button"
                      // disabled={
                      //   !this.state.shoptype ||
                      //   !this.state.shopname ||
                      //   !this.state.shopdesc
                      //     ? true
                      //     : false
                      // }
                    >
                      Set Location
                    </button>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        );
      }

      if (this.state.steps == 1) {
        return (
          <div>
            <Grid>
              <h1
                className="head2"
                style={{ textAlign: "center", margin: "30px 10px" }}
              >
                <Image
                  src={backicon}
                  onClick={this.handleStepPrev}
                  style={{ float: "left" }}
                />
                Update Service Location
              </h1>
              <Grid style={{ textAlign: "center" }}>
                <Grid container style={{ justifyContent: "center" }}>
                  <Grid
                    item
                    xs={5}
                    className={
                      "addressGroup addressGroup1 " +
                      (this.state.mapView ? "active" : "")
                    }
                    onClick={() => this.setMapView(true)}
                  >
                    MAP
                  </Grid>
                  <Grid
                    item
                    xs={5}
                    className={
                      "addressGroup addressGroup2 " +
                      (!this.state.mapView ? "active" : "")
                    }
                    onClick={() => {
                      this.setMapView(false);
                    }}
                  >
                    ADDRESS
                  </Grid>
                </Grid>
                <div style={{ display: this.state.mapView ? "block" : "none" }}>
                  <Grid style={{ marginBottom: "60px" }}>
                    <div style={{ marginBottom: "10px" }}>
                      <Image src={gpicon} style={{ marginRight: "15px" }} />
                      <span style={{ color: "#E95353" }}>
                        <b>Place red pin at your exact shop location</b>
                      </span>
                    </div>
                    <AsyncMap
                      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPI}&libraries=places`}
                      loadingElement={<div style={{ height: `100%` }} />}
                      containerElement={
                        <div style={{ height: this.props.height }} />
                      }
                      mapElement={<div style={{ height: `100%` }} />}
                      className="map-wrapper"
                    />
                  </Grid>
                  <div style={{ margin: "30px" }}>
                    <button
                      type="submit"
                      className="login-button"
                      onClick={() => this.setMapView(false)}
                      disabled={
                        !this.state.mapPosition.lat ||
                        !this.state.mapPosition.lng
                          ? true
                          : false
                      }
                    >
                      Set Address
                    </button>
                  </div>
                </div>
                <div
                  style={{ display: !this.state.mapView ? "block" : "none" }}
                >
                  <div>
                    <div
                      className="form-group"
                      style={{ marginBottom: "2rem" }}
                    >
                      <TextField
                        id="address"
                        label="Address"
                        name="address"
                        required
                        className="form-control text-input error address-input"
                        variant="outlined"
                        onChange={this.onChange}
                        defaultValue={ShopDetails.sp_address.address}
                      />
                    </div>
                    {/* <div
                      className="form-group"
                      style={{ marginBottom: "2rem" }}
                    >
                      <TextField
                        id="fulladdress"
                        label="Full Address"
                        name="fulladdress"
                        value={this.state.fulladdress}
                        required
                        className="form-control text-input error address-input"
                        variant="outlined"
                      />
                    </div> */}

                    <div
                      className="form-group"
                      style={{ marginBottom: "2rem" }}
                    >
                      <TextField
                        id="landmark"
                        label="Landmark"
                        name="landmark"
                        className="form-control text-input error state-input"
                        variant="outlined"
                        onChange={this.onChange}
                        defaultValue={ShopDetails.sp_address.landmark}
                      />
                    </div>
                    <div className="address-container">
                      <Grid container>
                        <Grid item xs={6}>
                          <h5 className="address-head">Area:</h5>
                          <p className="address-subhead">
                            {ShopDetails.sp_address.area}
                          </p>
                        </Grid>
                        <Grid item xs={6}>
                          <h5 className="address-head">City:</h5>
                          <p className="address-subhead">
                            {ShopDetails.sp_address.city}
                          </p>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid item xs={6}>
                          <h5 className="address-head">State:</h5>
                          <p className="address-subhead">
                            {ShopDetails.sp_address.state}
                          </p>
                        </Grid>
                        {/* <Grid item xs={6}>
                          <h5 className="address-head">PIN:</h5>
                          <p className="address-subhead">
                            {this.state.address}
                          </p>
                        </Grid> */}
                      </Grid>
                    </div>
                  </div>
                  <Grid style={{ margin: "30px" }}>
                    <button
                      type="submit"
                      className="login-button"
                      onClick={this.handleStepNext}
                      // disabled={
                      //   !this.state.address ||
                      //   !this.state.area ||
                      //   !this.state.city ||
                      //   !this.state.state ||
                      //   !this.state.fulladdress
                      //     ? true
                      //     : false
                      // }
                    >
                      Set Timing
                    </button>
                  </Grid>
                </div>
              </Grid>
            </Grid>
          </div>
        );
      }

      if (this.state.steps == 2) {
        return (
          <div>
            <Grid>
              <h1
                className="head2"
                style={{ textAlign: "center", margin: "30px 10px" }}
              >
                <Image
                  src={backicon}
                  onClick={this.handleStepPrev}
                  style={{ float: "left" }}
                />
                Update Service Timing
              </h1>
              <Grid style={{ textAlign: "center" }}>
                <Card className="timing-container">
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <TextField
                          required
                          id="opens_at"
                          label="Shop Open Time"
                          type="time"
                          name="opens_at"
                          onChange={this.onChange}
                          defaultValue={ShopDetails.sp_details.opensAt}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            step: 300, // 5 min
                          }}
                          style={{ width: "100%" }}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <TextField
                          required
                          id="closes_at"
                          label="Shop Close Time"
                          type="time"
                          name="closes_at"
                          defaultValue={ShopDetails.sp_details.closesAt}
                          onChange={this.onChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            step: 300, // 5 min
                          }}
                          style={{ width: "100%" }}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <TextField
                          required
                          id="break_start"
                          label="Break Start Time"
                          type="time"
                          name="break_start"
                          defaultValue={ShopDetails.sp_details.breakStartsAt}
                          onChange={this.onChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            step: 300, // 5 min
                          }}
                          style={{ width: "100%" }}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <TextField
                          required
                          id="break_end"
                          label="Break End Time"
                          type="time"
                          name="break_end"
                          defaultValue={ShopDetails.sp_details.breakEndsAt}
                          onChange={this.onChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            step: 300, // 5 min
                          }}
                          style={{ width: "100%" }}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </Card>

                <Card className="timing-container">
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <InputLabel
                          id="weeklyofflabel"
                          style={{ marginBottom: "10px" }}
                        >
                          Select week off day
                        </InputLabel>
                        <Grid container spacing={1} style={{ justifyContent: 'center' }}>
                          <Grid item xs={3}
                            onClick={() => this.handleOffSetDay("Monday")}
                          > 
                            <div 
                              className={
                                "day-container " +
                                (ShopDetails.sp_details.weeklyOff.includes("Monday")
                                  ? "selected"
                                  : "")
                              }
                            >
                            <p>Monday</p>
                            </div>
                          </Grid>
                          <Grid
                            item xs={3}
                            onClick={() => this.handleOffSetDay("Tuesday")}
                          >
                            <div 
                              className={
                                "day-container " +
                                (ShopDetails.sp_details.weeklyOff.includes("Tuesday")
                                  ? "selected"
                                  : "")
                              }
                            >
                              <p>Tuesday</p>
                            </div>
                          </Grid>
                          <Grid
                            item xs={3}
                            onClick={() => this.handleOffSetDay("Wednesday")}
                          >
                            <div 
                              className={
                                "day-container " +
                                (ShopDetails.sp_details.weeklyOff.includes("Wednesday")
                                  ? "selected"
                                  : "")
                              }
                            >
                              <p>Wednesday</p>
                              </div>
                          </Grid>
                          <Grid
                            item xs={3}
                            onClick={() => this.handleOffSetDay("Thursday")}
                          >
                            <div 
                              className={
                                "day-container " +
                                (ShopDetails.sp_details.weeklyOff.includes("Thursday")
                                  ? "selected"
                                  : "")
                              }
                            >
                              <p>Thursday</p>
                            </div>
                          </Grid>
                          <Grid
                            item xs={3}
                            onClick={() => this.handleOffSetDay("Friday")}
                          >
                            <div 
                              className={
                                "day-container " +
                                (ShopDetails.sp_details.weeklyOff.includes("Friday")
                                  ? "selected"
                                  : "")
                              }
                            >
                              <p>Friday</p>
                            </div>
                          </Grid>
                          <Grid
                            item xs={3}
                            onClick={() => this.handleOffSetDay("Saturday")}
                          >
                            <div 
                              className={
                                "day-container " +
                                (ShopDetails.sp_details.weeklyOff.includes("Saturday")
                                  ? "selected"
                                  : "")
                              }
                            >
                              <p>Saturday</p>
                            </div>
                          </Grid>
                          <Grid
                            item xs={3}
                            onClick={() => this.handleOffSetDay("Sunday")}
                          >
                            <div 
                              className={
                                "day-container " +
                                (ShopDetails.sp_details.weeklyOff.includes("Sunday")
                                  ? "selected"
                                  : "")
                              }
                            >
                              <p>Sunday</p>
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                    </Grid>
                    {/* <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <TextField
                          required
                          id="slot_limit"
                          label="Slot Limit"
                          type="number"
                          name="slot_limit"
                          className="form-control text-input error"
                          onChange={this.onChange}
                          defaultValue={this.state.slot_limit}
                        />
                      </div>
                    </Grid> */}
                    <Grid item xs={12}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <TextField
                          required
                          id="max_concurrency"
                          label="Number of Counters"
                          type="number"
                          name="max_concurrency"
                          onChange={this.onChange}
                          defaultValue={ShopDetails.sp_details.maxConcurrency}
                          InputProps={{
                            inputProps: { min: 1 },
                          }}
                          style={{ width: "100%" }}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <InputLabel id="discrete-slider-small-steps">
                          Serving Duration*
                        </InputLabel>
                        <Slider
                          id="serving_duration"
                          name="serving_duration"
                          defaultValue={ShopDetails.sp_details.servingDuration/60000}
                          aria-labelledby="discrete-slider-small-steps"
                          step={1}
                          min={1}
                          max={60}
                          valueLabelDisplay="auto"
                          marks={marks}
                          onChange={(event, newValue) => {
                            this.setState({ serving_duration: newValue });
                          }}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </Card>
                <Grid style={{ margin: "30px" }}>
                  <button
                    type="submit"
                    className="login-button"
                    onClick={this.handleStepNext}
                    // disabled={!this.state.max_concurrency ? true : false}
                  >
                    View Summary
                  </button>
                </Grid>
              </Grid>
            </Grid>
          </div>
        );
      }

      if (this.state.steps == 3) {
        let shop_icon = null;
        console.log(this.state.shoptype);
        switch (this.state.shoptype) {
          case "automotiveandtransport":
            shop_icon = categories.automotiveandtransport;
            break;
          case "businessandfinance":
            shop_icon = categories.businessandfinance;
            break;
          case "chemicalsandconstructionmaterials":
            shop_icon = categories.chemicalsandconstructionmaterials;
            break;
          case "consumergoodsandservices":
            shop_icon = categories.consumergoodsandservices;
            break;
          case "healthcareandpharmaceutical":
            shop_icon = categories.healthcareandpharmaceutical;
            break;
          case "governmentandutilities":
            shop_icon = categories.governmentandutilities;
            break;
          case "placesofworship":
            shop_icon = categories.placesofworship;
            break;
          case "sportsgamingandentertainment":
            shop_icon = categories.sportsgamingandentertainment;
            break;
          case "householdsupplies":
            shop_icon = categories.householdsupplies;
            break;
          case "foodandgroceries":
            shop_icon = categories.foodandgroceries;
            break;
          case "liquor":
            shop_icon = categories.liquor;
            break;
          default:
            shop_icon =null;
        }
        return (
          <div>
            <Grid>
              <h1
                className="head2"
                style={{ textAlign: "center", margin: "30px 10px" }}
              >
                <Image
                  src={backicon}
                  onClick={this.handleStepPrev}
                  style={{ float: "left" }}
                />
                View Summary
              </h1>
              <Grid style={{ textAlign: "center" }}>
                <Card className="timing-container">
                  <h1 className="shopName">
                    <Image src={shop_icon} style={{ marginRight: "15px" }} />
                    {this.state.shopname}
                  </h1>
                  <h3 className="shopDescription">{this.state.shopdesc}</h3>
                  <h5 className="shopAddress">{this.state.address}</h5>
                </Card>

                <Card className="timing-container">
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <InputLabel>Shop Open Time</InputLabel>
                        <p className="address-subhead">{this.state.opens_at}</p>
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <InputLabel>Shop Close Time</InputLabel>
                        <p className="address-subhead">
                          {this.state.closes_at}
                        </p>
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <InputLabel>Break Start Time</InputLabel>
                        <p className="address-subhead">
                          {this.state.break_start}
                        </p>
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <InputLabel>Break Close Time</InputLabel>
                        <p className="address-subhead">
                          {this.state.break_end}
                        </p>
                      </div>
                    </Grid>
                  </Grid>
                </Card>

                <Card className="timing-container">
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <InputLabel>Select week off day</InputLabel>
                        <p className="address-subhead">
                          {this.state.weekly_off.toString()}
                        </p>
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <InputLabel>Serving Duration</InputLabel>
                        <p className="address-subhead">
                          {this.state.serving_duration} Min
                        </p>
                      </div>
                    </Grid>
                    {/* <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <InputLabel>Slot Limit</InputLabel>
                        <p className="address-subhead">
                          {this.state.slot_limit}
                        </p>
                      </div>
                    </Grid> */}
                    <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <InputLabel>Number of Counters</InputLabel>
                        <p className="address-subhead">
                          {this.state.max_concurrency}
                        </p>
                      </div>
                    </Grid>
                  </Grid>
                </Card>
                <Grid style={{ margin: "30px" }}>
                  <button
                    type="submit"
                    className="login-button"
                    onClick={this.onSubmit}
                  >
                    Get Started
                  </button>
                </Grid>
              </Grid>
            </Grid>
          </div>
        );
      }
    } else {
      if (this.state.steps == 0) {
        return (
          <div>
            <Grid>
              <h1
                className="head2"
                style={{ textAlign: "center", margin: "30px 0px" }}
              >
                Add Service Info
              </h1>
              <Grid style={{ textAlign: "center" }}>
                {/* <div className="form-group" style={{ marginBottom: "20px" }}> */}
                <div className="form-group" style={{ marginBottom: "2rem" }}>
                  <TextField
                    id="shopname"
                    label="Shop Name"
                    name="shopname"
                    required
                    onChange={this.onChange}
                    className="form-control text-input error shopname-input"
                    variant="outlined"
                    placeholder="eg: Reliance Mart"
                    defaultValue={this.state.shopname}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "2rem" }}>
                  <TextField
                    id="shopdesc"
                    label="Shop Description"
                    name="shopdesc"
                    required
                    multiline
                    rows={4}
                    onChange={this.onChange}
                    className="form-control text-input error shopname-input"
                    variant="outlined"
                    placeholder="eg: We provide fresh groceries"
                    defaultValue={this.state.shopdesc}
                  />
                </div>

                {/* Category selection here*/}

                <div className="form-group">
                  <h4 className="subtitle" style={{ margin: "15px 0px" }}>
                    Select category
                  </h4>
                  {console.log("selected category", this.state)}
                  <Grid container style={{ justifyContent: "center" }}>
                    <div
                      className={
                        "categoryBox " +
                        (this.state.shoptype === "automotiveandtransport"
                          ? "selected"
                          : "")
                      }
                      onClick={() =>
                        this.setSelectedCategory("automotiveandtransport")
                      }
                    >
                      <Image src={this.state.shoptype === 'automotiveandtransport' ? categories.automotiveandtransportSelected : categories.automotiveandtransport} />
                      <p className="categoryText" style={{ fontSize: "10px" }}>
                        Automotive & Transport
                      </p>
                    </div>

                    <div
                      className={
                        "categoryBox " +
                        (this.state.shoptype === "businessandfinance"
                          ? "selected"
                          : "")
                      }
                      onClick={() =>
                        this.setSelectedCategory("businessandfinance")
                      }
                    >
                      <Image src={this.state.shoptype === 'businessandfinance' ? categories.businessandfinanceSelected : categories.businessandfinance} />
                      <p className="categoryText" style={{ fontSize: "10px" }}>
                        Business & Finance
                      </p>
                    </div>

                    <div
                      className={
                        "categoryBox " +
                        (this.state.shoptype ===
                        "chemicalsandconstructionmaterials"
                          ? "selected"
                          : "")
                      }
                      onClick={() =>
                        this.setSelectedCategory(
                          "chemicalsandconstructionmaterials"
                        )
                      }
                    >
                      <Image src={this.state.shoptype === 'chemicalsandconstructionmaterials' ? categories.chemicalsandconstructionmaterialsSelected : categories.chemicalsandconstructionmaterials} />
                      <p className="categoryText" style={{ fontSize: "10px" }}>
                        Chemicals & Construction Materials
                      </p>
                    </div>

                    <div
                      className={
                        "categoryBox " +
                        (this.state.shoptype === "consumergoodsandservices"
                          ? "selected"
                          : "")
                      }
                      onClick={() =>
                        this.setSelectedCategory("consumergoodsandservices")
                      }
                    >
                      <Image src={this.state.shoptype === 'consumergoodsandservices' ? categories.consumergoodsandservicesSelected : categories.consumergoodsandservices} />
                      <p className="categoryText" style={{ fontSize: "10px" }}>
                        Consumer Goods & Services
                      </p>
                    </div>

                    <div
                      className={
                        "categoryBox " +
                        (this.state.shoptype === "healthcareandpharmaceutical"
                          ? "selected"
                          : "")
                      }
                      onClick={() =>
                        this.setSelectedCategory("healthcareandpharmaceutical")
                      }
                    >
                      <Image src={this.state.shoptype === 'healthcareandpharmaceutical' ? categories.healthcareandpharmaceuticalSelected : categories.healthcareandpharmaceutical} />
                      <p className="categoryText" style={{ fontSize: "10px" }}>
                        Healthcare & Pharmaceutical
                      </p>
                    </div>

                    <div
                      className={
                        "categoryBox " +
                        (this.state.shoptype === "governmentandutilities"
                          ? "selected"
                          : "")
                      }
                      onClick={() =>
                        this.setSelectedCategory("governmentandutilities")
                      }
                    >
                      <Image src={this.state.shoptype === 'governmentandutilities' ? categories.governmentandutilitiesSelected : categories.governmentandutilities} />
                      <p className="categoryText" style={{ fontSize: "10px" }}>
                        Government & Utilities
                      </p>
                    </div>

                    <div
                      className={
                        "categoryBox " +
                        (this.state.shoptype === "placesofworship"
                          ? "selected"
                          : "")
                      }
                      onClick={() =>
                        this.setSelectedCategory("placesofworship")
                      }
                    >
                      <Image src={this.state.shoptype === 'placesofworship' ? categories.placesofworshipSelected : categories.placesofworship} />
                      <p className="categoryText" style={{ fontSize: "10px" }}>
                        Places of Worship
                      </p>
                    </div>

                    <div
                      className={
                        "categoryBox " +
                        (this.state.shoptype === "sportsgamingandentertainment"
                          ? "selected"
                          : "")
                      }
                      onClick={() =>
                        this.setSelectedCategory("sportsgamingandentertainment")
                      }
                    >
                      <Image src={this.state.shoptype === 'sportsgamingandentertainment' ? categories.sportsgamingandentertainmentSelected : categories.sportsgamingandentertainment} />
                      <p className="categoryText" style={{ fontSize: "10px" }}>
                        Sports, Gaming & Entertainment
                      </p>
                    </div>

                    <div
                      className={
                        "categoryBox " +
                        (this.state.shoptype === "householdsupplies"
                          ? "selected"
                          : "")
                      }
                      onClick={() =>
                        this.setSelectedCategory("householdsupplies")
                      }
                    >
                      <Image src={this.state.shoptype === 'householdsupplies' ? categories.householdsuppliesSelected : categories.householdsupplies} />
                      <p className="categoryText" style={{ fontSize: "10px" }}>
                        Household Supplies
                      </p>
                    </div>

                    <div
                      className={
                        "categoryBox " +
                        (this.state.shoptype === "foodandgroceries"
                          ? "selected"
                          : "")
                      }
                      onClick={() =>
                        this.setSelectedCategory("foodandgroceries")
                      }
                    >
                      <Image src={this.state.shoptype === 'foodandgroceries' ? categories.foodandgroceriesSelected : categories.foodandgroceries} />
                      <p className="categoryText" style={{ fontSize: "10px" }}>
                        Food & Groceries
                      </p>
                    </div>

                    <div
                      className={
                        "categoryBox " +
                        (this.state.shoptype === "liquor" ? "selected" : "")
                      }
                      onClick={() => this.setSelectedCategory("liquor")}
                    >
                      <Image src={this.state.shoptype === 'liquor' ? categories.liquorSelected : categories.liquor} />
                      <p className="categoryText" style={{ fontSize: "10px" }}>
                        Liquor
                      </p>
                    </div> 
                  </Grid>
                </div>
                {console.log("shop type", this.state.shoptype)}
                {/* {Set Location Button} */}
                <div className="form-group">
                  <div style={{ margin: "30px" }}>
                    <button
                      onClick={this.handleStepNext}
                      className="login-button"
                      disabled={
                        !this.state.shoptype ||
                        !this.state.shopname ||
                        !this.state.shopdesc
                          ? true
                          : false
                      }
                    >
                      Set Location
                    </button>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        );
      }

      if (this.state.steps == 1) {
        return (
          <div>
            <Grid>
              <h1
                className="head2"
                style={{ textAlign: "center", margin: "30px 10px" }}
              >
                <Image
                  src={backicon}
                  onClick={this.handleStepPrev}
                  style={{ float: "left" }}
                />
                Add Service Location
              </h1>
              <Grid style={{ textAlign: "center" }}>
                <Grid container style={{ justifyContent: "center" }}>
                  <Grid
                    item
                    xs={5}
                    className={
                      "addressGroup addressGroup1 " +
                      (this.state.mapView ? "active" : "")
                    }
                    onClick={() => this.setMapView(true)}
                  >
                    MAP
                  </Grid>
                  <Grid
                    item
                    xs={5}
                    className={
                      "addressGroup addressGroup2 " +
                      (!this.state.mapView ? "active" : "")
                    }
                    onClick={() => {
                      this.setMapView(false);
                    }}
                  >
                    ADDRESS
                  </Grid>
                </Grid>
                <div style={{ display: this.state.mapView ? "block" : "none" }}>
                  <Grid style={{ marginBottom: "60px" }}>
                    <div style={{ marginBottom: "10px" }}>
                      <Image src={gpicon} style={{ marginRight: "15px" }} />
                      <span style={{ color: "#E95353" }}>
                        <b>Place red pin at your exact shop location</b>
                      </span>
                    </div>
                    <AsyncMap
                      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPI}&libraries=places`}
                      loadingElement={<div style={{ height: `100%` }} />}
                      containerElement={
                        <div style={{ height: this.props.height }} />
                      }
                      mapElement={<div style={{ height: `100%` }} />}
                      className="map-wrapper"
                    />
                  </Grid>
                  <div style={{ margin: "30px" }}>
                    <button
                      type="submit"
                      className="login-button"
                      onClick={() => this.setMapView(false)}
                      disabled={
                        !this.state.mapPosition.lat ||
                        !this.state.mapPosition.lng
                          ? true
                          : false
                      }
                    >
                      Set Address
                    </button>
                  </div>
                </div>
                <div
                  style={{ display: !this.state.mapView ? "block" : "none" }}
                >
                  <div>
                    <div
                      className="form-group"
                      style={{ marginBottom: "2rem" }}
                    >
                      <TextField
                        id="address"
                        label="Address"
                        name="address"
                        required
                        className="form-control text-input error address-input"
                        variant="outlined"
                        onChange={this.onChange}
                        value={this.state.address}
                      />
                    </div>
                    {/* <div
                      className="form-group"
                      style={{ marginBottom: "2rem" }}
                    >
                      <TextField
                        id="fulladdress"
                        label="Full Address"
                        name="fulladdress"
                        value={this.state.fulladdress}
                        required
                        className="form-control text-input error address-input"
                        variant="outlined"
                      />
                    </div> */}

                    <div
                      className="form-group"
                      style={{ marginBottom: "2rem" }}
                    >
                      <TextField
                        id="landmark"
                        label="Landmark"
                        name="landmark"
                        className="form-control text-input error state-input"
                        variant="outlined"
                        onChange={this.onChange}
                        defaultValue={this.state.landmark}
                      />
                    </div>
                    <div className="address-container">
                      <Grid container>
                        <Grid item xs={6}>
                          <h5 className="address-head">Area:</h5>
                          <p className="address-subhead">{this.state.area}</p>
                        </Grid>
                        <Grid item xs={6}>
                          <h5 className="address-head">City:</h5>
                          <p className="address-subhead">{this.state.city}</p>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid item xs={6}>
                          <h5 className="address-head">State:</h5>
                          <p className="address-subhead">{this.state.state}</p>
                        </Grid>
                        {/* <Grid item xs={6}>
                          <h5 className="address-head">PIN:</h5>
                          <p className="address-subhead">
                            {this.state.address}
                          </p>
                        </Grid> */}
                      </Grid>
                    </div>
                  </div>
                  <Grid style={{ margin: "30px" }}>
                    <button
                      type="submit"
                      className="login-button"
                      onClick={this.handleStepNext}
                      disabled={
                        !this.state.address ||
                        !this.state.area ||
                        !this.state.city ||
                        !this.state.state ||
                        !this.state.fulladdress
                          ? true
                          : false
                      }
                    >
                      Set Timing
                    </button>
                  </Grid>
                </div>
              </Grid>
            </Grid>
          </div>
        );
      }

      if (this.state.steps == 2) {
        return (
          <div>
            <Grid>
              <h1
                className="head2"
                style={{ textAlign: "center", margin: "30px 10px" }}
              >
                <Image
                  src={backicon}
                  onClick={this.handleStepPrev}
                  style={{ float: "left" }}
                />
                Add Service Timing
              </h1>
              <Grid style={{ textAlign: "center" }}>
                <Card className="timing-container">
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <TextField
                          required
                          id="opens_at"
                          label="Shop Open Time"
                          type="time"
                          name="opens_at"
                          onChange={this.onChange}
                          defaultValue={this.state.opens_at}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            step: 300, // 5 min
                          }}
                          style={{ width: "100%" }}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <TextField
                          required
                          id="closes_at"
                          label="Shop Close Time"
                          type="time"
                          name="closes_at"
                          defaultValue={this.state.closes_at}
                          onChange={this.onChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            step: 300, // 5 min
                          }}
                          style={{ width: "100%" }}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <TextField
                          required
                          id="break_start"
                          label="Break Start Time"
                          type="time"
                          name="break_start"
                          defaultValue={this.state.break_start}
                          onChange={this.onChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            step: 300, // 5 min
                          }}
                          style={{ width: "100%" }}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <TextField
                          required
                          id="break_end"
                          label="Break End Time"
                          type="time"
                          name="break_end"
                          defaultValue={this.state.break_end}
                          onChange={this.onChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            step: 300, // 5 min
                          }}
                          style={{ width: "100%" }}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </Card>

                <Card className="timing-container">
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <InputLabel
                          id="weeklyofflabel"
                          style={{ marginBottom: "10px" }}
                        >
                          Select week off day
                        </InputLabel>
                        <Grid container spacing={1} style={{ justifyContent: 'center' }}>
                          <Grid item xs={3}
                            onClick={() => this.handleOffSetDay("Monday")}
                          > 
                            <div 
                              className={
                                "day-container " +
                                (this.state.weekly_off.includes("Monday")
                                  ? "selected"
                                  : "")
                              }
                            >
                            <p>Monday</p>
                            </div>
                          </Grid>
                          <Grid
                            item xs={3}
                            onClick={() => this.handleOffSetDay("Tuesday")}
                          >
                            <div 
                              className={
                                "day-container " +
                                (this.state.weekly_off.includes("Tuesday")
                                  ? "selected"
                                  : "")
                              }
                            >
                              <p>Tuesday</p>
                            </div>
                          </Grid>
                          <Grid
                            item xs={3}
                            onClick={() => this.handleOffSetDay("Wednesday")}
                          >
                            <div 
                              className={
                                "day-container " +
                                (this.state.weekly_off.includes("Wednesday")
                                  ? "selected"
                                  : "")
                              }
                            >
                              <p>Wednesday</p>
                              </div>
                          </Grid>
                          <Grid
                            item xs={3}
                            onClick={() => this.handleOffSetDay("Thursday")}
                          >
                            <div 
                              className={
                                "day-container " +
                                (this.state.weekly_off.includes("Thursday")
                                  ? "selected"
                                  : "")
                              }
                            >
                              <p>Thursday</p>
                            </div>
                          </Grid>
                          <Grid
                            item xs={3}
                            onClick={() => this.handleOffSetDay("Friday")}
                          >
                            <div 
                              className={
                                "day-container " +
                                (this.state.weekly_off.includes("Friday")
                                  ? "selected"
                                  : "")
                              }
                            >
                              <p>Friday</p>
                            </div>
                          </Grid>
                          <Grid
                            item xs={3}
                            onClick={() => this.handleOffSetDay("Saturday")}
                          >
                            <div 
                              className={
                                "day-container " +
                                (this.state.weekly_off.includes("Saturday")
                                  ? "selected"
                                  : "")
                              }
                            >
                              <p>Saturday</p>
                            </div>
                          </Grid>
                          <Grid
                            item xs={3}
                            onClick={() => this.handleOffSetDay("Sunday")}
                          >
                            <div 
                              className={
                                "day-container " +
                                (this.state.weekly_off.includes("Sunday")
                                  ? "selected"
                                  : "")
                              }
                            >
                              <p>Sunday</p>
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                    </Grid>
                    {/* <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <TextField
                          required
                          id="slot_limit"
                          label="Slot Limit"
                          type="number"
                          name="slot_limit"
                          className="form-control text-input error"
                          onChange={this.onChange}
                          defaultValue={this.state.slot_limit}
                        />
                      </div>
                    </Grid> */}
                    <Grid item xs={12}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <TextField
                          required
                          id="max_concurrency"
                          label="Number of Counters"
                          type="number"
                          name="max_concurrency"
                          onChange={this.onChange}
                          defaultValue={this.state.max_concurrency}
                          InputProps={{
                            inputProps: { min: 1 },
                          }}
                          style={{ width: "100%" }}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <InputLabel id="discrete-slider-small-steps">
                          Serving Duration*
                        </InputLabel>
                        <Slider
                          id="serving_duration"
                          name="serving_duration"
                          defaultValue={this.state.serving_duration}
                          aria-labelledby="discrete-slider-small-steps"
                          step={1}
                          min={1}
                          max={60}
                          valueLabelDisplay="auto"
                          marks={marks}
                          onChange={(event, newValue) => {
                            this.setState({ serving_duration: newValue });
                          }}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </Card>
                <Grid style={{ margin: "30px" }}>
                  <button
                    type="submit"
                    className="login-button"
                    onClick={this.handleStepNext}
                    disabled={!this.state.max_concurrency ? true : false}
                  >
                    View Summary
                  </button>
                </Grid>
              </Grid>
            </Grid>
          </div>
        );
      }

      if (this.state.steps == 3) {
        let shop_icon = null;
        console.log(this.state.shoptype);
        switch (this.state.shoptype) {
          case "automotiveandtransport":
            shop_icon = categories.automotiveandtransport;
            break;
          case "businessandfinance":
            shop_icon = categories.businessandfinance;
            break;
          case "chemicalsandconstructionmaterials":
            shop_icon = categories.chemicalsandconstructionmaterials;
            break;
          case "consumergoodsandservices":
            shop_icon = categories.consumergoodsandservices;
            break;
          case "healthcareandpharmaceutical":
            shop_icon = categories.healthcareandpharmaceutical;
            break;
          case "governmentandutilities":
            shop_icon = categories.governmentandutilities;
            break;
          case "placesofworship":
            shop_icon = categories.placesofworship;
            break;
          case "sportsgamingandentertainment":
            shop_icon = categories.sportsgamingandentertainment;
            break;
          case "householdsupplies":
            shop_icon = categories.householdsupplies;
            break;
          case "foodandgroceries":
            shop_icon = categories.foodandgroceries;
            break;
          case "liquor":
            shop_icon = categories.liquor;
            break;
          default:
            shop_icon =null;
        }
        return (
          <div>
            <Grid>
              <h1
                className="head2"
                style={{ textAlign: "center", margin: "30px 10px" }}
              >
                <Image
                  src={backicon}
                  onClick={this.handleStepPrev}
                  style={{ float: "left" }}
                />
                View Summary
              </h1>
              <Grid style={{ textAlign: "center" }}>
                <Card className="timing-container">
                  <h1 className="shopName">
                    <Image src={shop_icon} style={{ marginRight: "15px" }} />
                    {this.state.shopname}
                  </h1>
                  <h3 className="shopDescription">{this.state.shopdesc}</h3>
                  <h5 className="shopAddress">{this.state.address}</h5>
                </Card>

                <Card className="timing-container">
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <InputLabel>Shop Open Time</InputLabel>
                        <p className="address-subhead">{this.state.opens_at}</p>
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <InputLabel>Shop Close Time</InputLabel>
                        <p className="address-subhead">
                          {this.state.closes_at}
                        </p>
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <InputLabel>Break Start Time</InputLabel>
                        <p className="address-subhead">
                          {this.state.break_start}
                        </p>
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <InputLabel>Break Close Time</InputLabel>
                        <p className="address-subhead">
                          {this.state.break_end}
                        </p>
                      </div>
                    </Grid>
                  </Grid>
                </Card>

                <Card className="timing-container">
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <InputLabel>Week off day</InputLabel>
                        <p className="address-subhead">
                          {this.state.weekly_off.length === 0 ? 'None' : this.state.weekly_off.toString()}
                        </p>
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <InputLabel>Serving Duration</InputLabel>
                        <p className="address-subhead">
                          {this.state.serving_duration} Min
                        </p>
                      </div>
                    </Grid>
                    {/* <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <InputLabel>Slot Limit</InputLabel>
                        <p className="address-subhead">
                          {this.state.slot_limit}
                        </p>
                      </div>
                    </Grid> */}
                    <Grid item xs={6}>
                      <div
                        className="form-group"
                        style={{ marginBottom: "2rem" }}
                      >
                        <InputLabel>Number of Counters</InputLabel>
                        <p className="address-subhead">
                          {this.state.max_concurrency}
                        </p>
                      </div>
                    </Grid>
                  </Grid>
                </Card>
                <Grid style={{ margin: "30px" }}>
                  <button
                    type="submit"
                    className="login-button"
                    onClick={this.onSubmit}
                  >
                    Get Started
                  </button>
                </Grid>
              </Grid>
            </Grid>
          </div>
        );
      }
    }
    // return (map)
  }
}
Map.propTypes = {
  onSubmitForm: PropTypes.func,
  onUpdateSubmitForm: PropTypes.func,
  onAvatarSubmitForm: PropTypes.func,
  // errors: PropTypes.object
};

const mapStateToProps = createStructuredSelector({
  // repos: makeSelectRepos(),
  // username: makeSelectUsername(),
  shopDetails: makeSelectSPRegister(),
  // loading: makeSelectLoading(),
  // error: makeSelectError(),
});

function mapDispatchToProps(dispatch) {
  return {
    // onSubmitForm: (evt, actions) => {
    // 	console.log("form was submitted");
    // 	if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    // 	dispatch(setupShopRequest(evt));
    // 	setTimeout(() => {
    // 		actions.setSubmitting(false);
    // 	}, 500);
    // },
    onSubmitForm: (payload) => {
      console.log("form was submitted");

      dispatch(setupShopRequest(payload));
    },
    onPageInit: dispatch(setupShopPageInit()),
    onUpdateSubmitForm: (payload) => {
      console.log("uploadform was submitted");
      dispatch(updateShopRequest(payload));
    },
    onAvatarSubmitForm: (data) => {
      dispatch(uploadSpAvatar(data));
    },
  };
}

// export default Map
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Map));
