const axios = require('axios');
const fs = require('fs');
const baseUrl = "https://yh-finance.p.rapidapi.com/";
const stockSummaryUrl = "stock/v2/get-summary";
const region = "US";

let rawdata = fs.readFileSync("env.json");
let env = JSON.parse(rawdata);
let rapidApiKey = env.XRapidAPIKey;
let rapidApiHost = env.XRapidAPIHost;
let stocksToCheck = env.StocksToCheck;//JSON.parse(env.StocksToCheck);

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
    stocksToCheck.map(stockName => request(stockName));
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
    });
}

function processResponse (res) {
    let companyName = res.price.longName;
    let price = res.price.regularMarketOpen.raw
    console.log(companyName);
    console.log(price);
}