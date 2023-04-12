const configurations = {
    defaultConfig: {
        BE_URL_prefix: "https://dev-abhi-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://dev-abhi-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://dev-abhi-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://dev-abhi-rfq-api.claimzippy.com/api/v0"
    },
    prod: {
        BE_URL_prefix: "https://abhi-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://abhi-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://abhi-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://abhi-rfq-api.claimzippy.com/api/v0"
    },
    dev: {
        BE_URL_prefix: "https://dev-abhi-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://dev-abhi-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://dev-abhi-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://dev-abhi-rfq-api.claimzippy.com/api/v0"
    },
    sandbox: {
        BE_URL_prefix: "https://sandbox-abhi-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://sandbox-abhi-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://sandbox-abhi-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https:/sandbox-abhi-rfq-api.claimzippy.com/api/v0"
    },
    local: {
        BE_URL_prefix: "http://localhost:5017/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "http://localhost:5004/api/v0",
        TPA_PC_BE_URL_prefix: "http://localhost:5002/api/v0",
        RFQ_URL_prefix: "http://localhost:5016/api/v0"
    },

    v2: {
        BE_URL_prefix: "https://v2-abhi-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://v2-abhi-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://v2-abhi-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://v2-abhi-rfq-api.claimzippy.com/api/v0"
    },
    v3: {
        BE_URL_prefix: "https://v3-abhi-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://v3-abhi-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://v3-abhi-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://v3-abhi-rfq-api.claimzippy.com/api/v0"
    },
    v4: {
        BE_URL_prefix: "https://v4-abhi-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://v4-abhi-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://v4-abhi-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://v4-abhi-rfq-api.claimzippy.com/api/v0"
    },
    v5: {
        BE_URL_prefix: "https://v5-abhi-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://v5-abhi-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://v5-abhi-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://v5-abhi-rfq-api.claimzippy.com/api/v0"
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