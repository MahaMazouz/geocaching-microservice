const validateAutoAddress = {
    type: 'object',
    required: ['query'],
    properties: {
        query: { type: 'string' },
    },
};

module.exports = {
    validateAutoAddress,
};
