const axios = require('axios');
const fs = require('fs');
const baseUrl = "https://yh-finance.p.rapidapi.com/";
const stockSummaryUrl = "stock/v2/get-summary";
const region = "US";

const rawdata = fs.readFileSync("env.json");
const env = JSON.parse(rawdata);
const {
        "XRapidAPIHost": rapidApiHost,
        "XRapidAPIKey": rapidApiKey,
        "StocksToCheck": stocksToCheck
      } = env;

if (!rapidApiHost || !rapidApiKey) {
    console.log("Either api key or api host is missing");
    process.exit();
}

if (!stocksToCheck[0]) {
    console.log("You haven't entered any stock codes");
    process.exit();
}

process(stocksToCheck);

function process (stocksToCheck) {
    stocksToCheck.forEach((stock, i) => {
      setTimeout(() => request(stock), i * 250);
    });
}

function request (stockName) {
    const options = {
        method: 'GET',
        url: baseUrl+stockSummaryUrl,
        params: {symbol: stockName, region: region},
        headers: {
          'X-RapidAPI-Host': rapidApiHost,
          'X-RapidAPI-Key': rapidApiKey
        }
      };
      
      axios.request(options).then(function (response) {
        processResponse(response.data);
      }).catch(function (error) {
        console.error(error);
        processError(error);
    });
}

function processResponse (res) {
    let companyName = res.price.longName;
    let price = res.price.regularMarketPrice.raw
    console.log(companyName);
    console.log(price);
}

function processError (error) {
  let tooManyRequests = "You are making more than 5 requests per second";
  let errorCode = error.response.status;
  if (errorCode === 429) {
    console.log(tooManyRequests)
  }
  console.log(errorCode);
}