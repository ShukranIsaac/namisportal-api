var Status = (() => {
    return {
        STATUS_CONFLICT: 409,
        STATUS_OK: 200,
        STATUS_UNPROCESSABLE_ENTITY: 402,
        STATUS_INTERNAL_SERVER_ERROR: 500
    }
})();

module.exports = Status;