require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8888,
  NODE_ENV: process.env.NODE_ENV,
  BASIC_AUTH_API_USERNAME: process.env.BASIC_AUTH_API_USERNAME,
  BASIC_AUTH_API_PASS: process.env.BASIC_AUTH_API_PASS,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  CALLBACK_URL: process.env.CALLBACK_URL,
  SCOPES: process.env.SCOPES,
  STATE: process.env.STATE,
  baseUrl: process.env.baseUrl,
};
