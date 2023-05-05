const configurations = {
    defaultConfig: {
        BE_URL_prefix: "https://dev-linkk-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://dev-linkk-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://dev-linkk-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://dev-linkk-rfq-api.claimzippy.com/api/v0"
    },
    prod: {
        BE_URL_prefix: "https://linkk-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://linkk-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://linkk-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://linkk-rfq-api.claimzippy.com/api/v0"
    },
    dev: {
        BE_URL_prefix: "https://dev-linkk-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://dev-linkk-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://dev-linkk-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://dev-linkk-rfq-api.claimzippy.com/api/v0"
    },
    sandbox: {
        BE_URL_prefix: "https://sandbox-linkk-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://sandbox-linkk-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://sandbox-linkk-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https:/sandbox-linkk-rfq-api.claimzippy.com/api/v0"
    },
    local: {
        BE_URL_prefix: "http://localhost:5017/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "http://localhost:5004/api/v0",
        TPA_PC_BE_URL_prefix: "http://localhost:5002/api/v0",
        RFQ_URL_prefix: "http://localhost:5016/api/v0"
    },

    v2: {
        BE_URL_prefix: "https://v2-linkk-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://v2-linkk-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://v2-linkk-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://v2-linkk-rfq-api.claimzippy.com/api/v0"
    },
    v3: {
        BE_URL_prefix: "https://v3-linkk-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://v3-linkk-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://v3-linkk-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://v3-linkk-rfq-api.claimzippy.com/api/v0"
    },
    v4: {
        BE_URL_prefix: "https://v4-linkk-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://v4-linkk-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://v4-linkk-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://v4-linkk-rfq-api.claimzippy.com/api/v0"
    },
    v5: {
        BE_URL_prefix: "https://v5-linkk-pb-api.claimzippy.com/api/v0",
        TPA_COMMON_BE_URL_PREFIX: "https://v5-linkk-authentication-api.claimzippy.com/api/v0",
        TPA_PC_BE_URL_prefix: "https://v5-linkk-pc-api.claimzippy.com/api/v0",
        RFQ_URL_prefix: "https://v5-linkk-rfq-api.claimzippy.com/api/v0"
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