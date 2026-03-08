const {
    getPlacesCtrl,
    getPlacesNoCacheCtrl,
    getCachePlacesCtrl,
    seedPlacesCtrl,
} = require('../controllers/mapsController');
const { sanitizingHook } = require('../hooks/sanitizingHook');
module.exports = async function (fastify) {
    fastify.get('/', async () => ({ hello: 'World' }));
    fastify.get('/nc/places', getPlacesNoCacheCtrl);
    fastify.get('/c/places', getCachePlacesCtrl);
    fastify.post('/seed', seedPlacesCtrl);
    fastify.route({
        method: 'GET',
        url: '/api/places',
        preHandler: sanitizingHook,
        handler: getPlacesCtrl,
    });
};
