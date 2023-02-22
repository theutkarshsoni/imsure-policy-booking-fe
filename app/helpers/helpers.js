import React from "react";
import history from "../utils/history";
import Geohash from "latlon-geohash";
import request from "../utils/request";

export const DisplayFormikState = (props) => (
  <div style={{ margin: "1rem 0" }}>
    <h3 style={{ fontFamily: "monospace" }}>&nbsp;</h3>
    <pre
      style={{
        background: "#f6f8fa",
        fontSize: ".65rem",
        padding: ".5rem",
      }}
    >
      <strong>props</strong> = {JSON.stringify(props, null, 2)}
    </pre>
  </div>
);

export const browserRedirect = (location, route) => {
  history.push(location, route ? route : "/");
};

export const parseJwt = (token) => {
  if (token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  }
  return null;
};

export const checkAuthorization = () => {
  const storedToken = localStorage.getItem("token");

  if (storedToken) {
    const tokenPayload = parseJwt(storedToken);

    const expiration = new Date(tokenPayload.exp * 1000).getTime();
    const current = new Date().getTime();

    if (current > expiration) return false;

    // if (tokenPayload.acceptTOS === 0 || tokenPayload.acceptPP === 0)
    //   return false;

    return true;
  }

  return false;
};




export const UserDetails = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    return user;
  }

  return null;
};

export const GetLocation = () => {
  if (!!navigator.geolocation) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        let CurrLocation = {};
        CurrLocation["lat"] = position.coords.latitude;
        CurrLocation["lng"] = position.coords.longitude;
        console.log("Curr location", CurrLocation);

        //Add precision for geohash

        let geohash = Geohash.encode(CurrLocation.lat, CurrLocation.lng, 6);

        console.log("Geo hash", geohash);

        //Make a geohashObj

        let geoObj = {};
        console.log("process.env", process.env);
        let geoexpiry = process.env.REACT_GEOHASH_EXPIRY
          ? process.env.REACT_GEOHASH_EXPIRY
          : 0;

        geoObj["geohash"] = geohash;
        geoObj["lat"] = CurrLocation.lat;
        geoObj["lng"] = CurrLocation.lng;
        geoObj["geoexpiry"] = geoexpiry;

        //If geohash doesnt exist in localstorage push to localstorage
        //If geohash exists in localstorage but does not match this geohash update the geohash
        //Set an expiry for geohash, if expired then reflush the geohash
        let geohashStorage = localStorage.getItem("geohash");

        if (geohashStorage) {
          console.log("got geohash");
          let expiry = new Date().getSeconds();

          let geoObjParse = JSON.parse(localStorage.getItem("geohash"));

          //Change Logic here for expiry

          console.log(
            "geoObjParse",
            parseInt(geoObjParse.geoexpiry),
            expiry,
            geoObjParse.geohash,
            geohash
          );
          if (parseInt(geoObjParse.geoexpiry) < expiry) {
            console.log("geohash expired, refetching");

            localStorage.setItem("geohash", JSON.stringify(geoObj));
          }

          if (geoObjParse.geohash != geohash) {
            console.log("geohash didnt match to localstorage geohash");

            localStorage.setItem("geohash", JSON.stringify(geoObj));
          }
        } else {
          console.log("setting geohash obj for the first time");
          localStorage.setItem("geohash", JSON.stringify(geoObj));
        }

        resolve(geoObj);
      });
    });
  }
};

export const BackgroundApiSync = () => {
  // console.log("Hey im the one who does amazing background job");
  //Fetch geoObj from localstorage
  const current = new Date().getTime();
  const geoObj = JSON.parse(localStorage.getItem("geohash"));
  Object.keys(localStorage).forEach(function (syncKey) {
    //Match for required keys

    if (syncKey.includes("/ar/")) {
      //Execute only if current geohash exists in localstorage
      //Can get item by sunc key
      let spListEvent = JSON.parse(
        localStorage.getItem(`/ar/${geoObj.geohash}`)
      );

      //Check for events //if exist parse and execute them
      //Check if this can handle all events

      //Event type
      if (spListEvent) {
        // spListEvent.url = "/sp/gh/23.3973572/85.3213457"; //Override for hack
        if (current > spListEvent.expiry) {
          //If event has met expiry then only execute the event
          // console.log("event call for bg", spListEvent);
          // console.log(
          //   "event call param for bs",
          //   spListEvent.method,
          //   spListEvent.url,
          //   spListEvent.data
          // );

          if (spListEvent && spListEvent.url && spListEvent.method) {
            request(spListEvent.method, spListEvent.url, spListEvent.data)
              .then((res) => {
                // console.log("bg api resp", res);
                if (res) {
                  //Update spList
                  localStorage.setItem(
                    `/gh/${geoObj.geohash}`,
                    JSON.stringify(res.data)
                  );
                }
              })
              .catch((err) => {
                console.log("No Data from api");
              });
          }
        }
      }
    }

    if (syncKey.includes("/spd/")) {
      // console.log("spdkey to be synced", syncKey);
      let spDetailsEvent = JSON.parse(localStorage.getItem(syncKey));
      // console.log(
      //   "got spd",
      //   spDetailsEvent,
      //   current,
      //   spDetailsEvent.expiry,
      //   current > spDetailsEvent.expiry
      // );

      if (spDetailsEvent) {
        // spDetailsEvent.url = "/sp/gh/23.3973572/85.3213457"; //Override for hack
        if (current > spDetailsEvent.expiry) {
          //If event has met expiry then only execute the event
          // console.log("event call for spdbg", spDetailsEvent);
          // console.log(
          //   "event call param for bs",
          //   spDetailsEvent.method,
          //   spDetailsEvent.url,
          //   spDetailsEvent.data
          // );

          if (spDetailsEvent && spDetailsEvent.url && spDetailsEvent.method) {
            request(
              spDetailsEvent.method,
              spDetailsEvent.url,
              spDetailsEvent.data
            )
              .then((res) => {
                // console.log("spd bg api resp", res);
                if (res) {
                  //Update spList
                  localStorage.setItem(
                    `/sd/${res.data.data[0]._id}`,
                    JSON.stringify(res.data)
                  );
                }
              })
              .catch((err) => {
                console.log("No Data from api");
              });
          }
        }
      }
    }
  });
};
