const configurations = {
    defaultConfig: {
        BE_URL_prefix: "https://dev-star-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://dev-star-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://dev-star-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://dev-star-rfq-api.claimzippy.com/api/v0"
    },
    prod: {
        BE_URL_prefix: "https://star-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://star-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://star-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://star-rfq-api.claimzippy.com/api/v0"
    },
    dev: {
        BE_URL_prefix: "https://dev-star-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://dev-star-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://dev-star-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://dev-star-rfq-api.claimzippy.com/api/v0"
    },
    sandbox: {
        BE_URL_prefix: "https://sandbox-star-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://sandbox-star-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://sandbox-star-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https:/sandbox-star-rfq-api.claimzippy.com/api/v0"
    },
    local: {
        BE_URL_prefix: "http://localhost:5017/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "http://localhost:5004/api/v0",
        TPA_PC_BE_URL_prefix: "http://localhost:5002/api/v0",
        RFQ_URL_prefix: "http://localhost:5016/api/v0"
    },

    v2: {
        BE_URL_prefix: "https://v2-star-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://v2-star-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://v2-star-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://v2-star-rfq-api.claimzippy.com/api/v0"
    },
    v3: {
        BE_URL_prefix: "https://v3-star-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://v3-star-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://v3-star-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://v3-star-rfq-api.claimzippy.com/api/v0"
    },
    v4: {
        BE_URL_prefix: "https://v4-star-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://v4-star-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://v4-star-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://v4-star-rfq-api.claimzippy.com/api/v0"
    },
    v5: {
        BE_URL_prefix: "https://v5-star-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://v5-star-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://v5-star-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://v5-star-rfq-api.claimzippy.com/api/v0"
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