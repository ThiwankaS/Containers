const redis = require('redis');
const { promisify } = require('util')
const { REDIS_URL } = require('../util/config')

let getAsync
let setAsync

if (!REDIS_URL) {
  const redisIsDisabled = () => {
    console.log('No REDIS_URL set, Redis is disabled')
    return null
  }
  getAsync = redisIsDisabled
  setAsync = redisIsDisabled
} else {
  const client = redis.createClient({
    url: REDIS_URL
  })
    
  getAsync = promisify(client.get).bind(client)
  setAsync = promisify(client.set).bind(client)    
}

const KEY = 'added_todos';

async function getCount() {
  try {
    let rawValue = await getAsync(KEY);
    let numericValue = Number(rawValue);
    return Number.isFinite(numericValue) ? numericValue : 0 ;
  } catch (e) {
    console.error("get count error ", e);
    return 0;
  }
}

async function increment() {
  try {
    let currentValue = await getAsync('added_todos');
    let updatedValue = Number(currentValue) + 1;
    await setAsync(KEY, String(updatedValue));
    return updatedValue;
  } catch (e) {
    console.error("increment error ", e);
    return null;
  }
}

module.exports = {
  getAsync,
  setAsync,
  getCount,
  increment
}