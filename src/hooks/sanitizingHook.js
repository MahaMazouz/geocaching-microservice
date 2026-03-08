
const { spacesSanitizer } = require('../utils/sanitizer');

const sanitizingHook = (request, reply, done) => {
    request.query.query = spacesSanitizer({ query: request.query.query });
    done();
};

module.exports = {
    sanitizingHook,
};
