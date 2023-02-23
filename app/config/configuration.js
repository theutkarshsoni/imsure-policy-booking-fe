const configurations = {
    defaultConfig: {
        BE_URL_prefix: "https://dev-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://dev-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://dev-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://dev-rfq-api.claimzippy.com/api/v0"
    },
    prod: {
        BE_URL_prefix: "https://dev-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://dev-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://dev-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://dev-rfq-api.claimzippy.com/api/v0"
    },
    dev: {
        BE_URL_prefix: "https://dev-dev-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://dev-dev-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://dev-dev-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://dev-rfq-api.claimzippy.com/api/v0"
    },
    sandbox: {
        BE_URL_prefix: "https://sandbox-dev-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://sandbox-dev-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://sandbox-dev-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://dev-rfq-api.claimzippy.com/api/v0"
    },
    local: {
        BE_URL_prefix: "http://localhost:5017/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "http://localhost:5004/api/v0",
        TPA_PC_BE_URL_prefix: "http://localhost:5002/api/v0",
        RFQ_URL_prefix: "http://localhost:5016/api/v0"
    },

    v2: {
        BE_URL_prefix: "https://v2-dev-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://v2-dev-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://v2-dev-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://v2-dev-rfq-api.claimzippy.com/api/v0"
    },
    v3: {
        BE_URL_prefix: "https://v3-dev-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://v3-dev-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://v3-dev-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://v3-dev-rfq-api.claimzippy.com/api/v0"
    },
    v4: {
        BE_URL_prefix: "https://v4-dev-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://v4-dev-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://v4-dev-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://v4-dev-rfq-api.claimzippy.com/api/v0"
    },
    v5: {
        BE_URL_prefix: "https://v5-dev-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://v5-dev-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://v5-dev-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://v5-dev-rfq-api.claimzippy.com/api/v0"
    },

}

const ENV =
    window.location.host.includes("localhost")
        ? "local"
        : window.location.host.split("-")[0]
            ? window.location.host.split("-")[0]
            : "prod";

console.log("ENV: ", ENV);

console.log("configuaration: ", { ...configurations.defaultConfig, ...configurations[ENV] });

export const configuration = { ...configurations.defaultConfig, ...configurations[ENV] };