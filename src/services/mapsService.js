const { scanPlaces, getScannedPlaces } = require('../adaptors/redisAdaptor');

const scanFullIteration = async ({ query = '', scanFunc }) => {
    var res = [];
    var cursor = 0;
    var isIterationCompleted = true;
    var cachedPlacesForIter = [];
    while (res.length < 1 && isIterationCompleted) {
        cachedPlacesForIter = await scanFunc({ query: query, cursor: cursor });
        if (cachedPlacesForIter[1]) res.push(cachedPlacesForIter[1]);
        if (cachedPlacesForIter[0] === '0') {
            isIterationCompleted = false;
        } else {
            cursor = cachedPlacesForIter[0];
        }
    }
    return res;
};
const scanBestFullIteration = async ({ query = '' }) => {
    const res = await scanFullIteration({
        query: query, scanFunc: scanBestReturnIteration,
    },
    );
    return res;
};

const scanFirstFullIteration = async ({ query = '' }) => {
    const res = await scanFullIteration({
        query: query, scanFunc: scanFirstReturnIteration,
    },
    );
    return res;
};

const scanBestReturnIteration = async ({ query, cursor }) => {
    var result = [];
    var cachedResForIter = await scanPlaces({ query: query, cursor: cursor });
    result.push(cachedResForIter[0]);
    for (const it of cachedResForIter[1]) {
        const pred = await getScannedPlaces({ query: it });
        const JSONRes = JSON.parse(pred);
        if (it !== '(empty list or set)' && JSONRes.status !== 'ZERO_RESULTS') {
            result.push(it);
            return result;
        }
    }
    return result;
};

const scanFirstReturnIteration = async ({ query, cursor }) => {
    var result = [];
    var cachedResForIter = await scanPlaces({ query: query, cursor: cursor });
    result.push(cachedResForIter[0]);
    for (const it of cachedResForIter[1]) {
        if (it !== '(empty list or set)') {
            result.push(it);
            return result;
        }
    }
    return result;
};

module.exports = {
    scanFullIteration,
    scanBestFullIteration,
    scanFirstFullIteration,
};
