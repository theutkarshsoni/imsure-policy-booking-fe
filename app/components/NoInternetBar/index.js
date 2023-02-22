import React, { useState, useEffect } from "react";

import './nointernetbar.css'

function NoInternetBar () {
    return (
        <div className="network-error" style={{ display: navigator.onLine ? 'none' : 'block' }}>
            <span>No internet. Connect to Wi-Fi or celluar network.</span>     
        </div>
    );
}

export default NoInternetBar;