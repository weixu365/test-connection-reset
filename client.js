
const axios = require('axios');
const Bluebird = require('bluebird');
const HttpAgent = require('agentkeepalive');

const keepAliveOption = {
  freeSocketKeepAliveTimeout: 30 * 1000, // Should be less than server keep alive timeout
  socketActiveTTL: 50 * 1000 // Should be less than dns ttl
};
const httpAgent = new HttpAgent(keepAliveOption);

let host = 'http://localhost:8000';
let path = '/';

const httpClient = axios.create({
  baseURL: host,
  timeout: 5000,
});

const sendRequest = () =>
  httpClient.request({
    url: path,
    httpAgent,
  })
    .then(res => {
      console.log('Received response', res.status);
    })
    .catch(e => {
      console.error('Error occurred', e.message);
    });

let delay=501;
const start = () =>
  sendRequest()
    .then(() => delay -= 1)
    .then(() => delay > 450 ? Bluebird.delay(delay).then(start) : 'Done')

start();
