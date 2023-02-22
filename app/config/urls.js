const { configuration } = require("./configuration");

export const urls = {

  // Local
  // PREFIX: "http://localhost:5001/api/v0/",

  // Local IP
  // PREFIX: "http://192.168.0.111:5001/api/v0/",

  // Server Dev
  // PREFIX: "https://dev-tpa-adjud-api.imsure.in/api/v0/",

  // Server Prod
  // PREFIX: "https://tpa-adjud-api.imsure.in/api/v0/",

  PREFIX: configuration.BE_URL_prefix,

  // TPA_COMMON: "http://localhost:5004/api/v0/",
  // TPA_COMMON: "http://192.168.0.111:5004/api/v0/",
  // TPA_COMMON: "https://dev-tpa-api.imsure.in/api/v0/",
  // TPA_COMMON: "https://tpa-api.imsure.in/api/v0/",

  TPA_COMMON: configuration.TPA_COMMON_BE_URL_PREFIX,

  PC_PREFIX: configuration.TPA_PC_BE_URL_prefix,





  TPA_LOGIN_URL: '/users/tpa/login',
  TPA_PENDING_CLAIM_URL: '/adjudicator/pending/claims/list',
  TPA_APPROVE_URL: '/adjudicator/claims/approve',
  TPA_OVERRIDE_APPROVE_URL: '/adjudicator/claims/override/approve',
  TPA_REJECT_URL: '/adjudicator/claims/reject',
};
