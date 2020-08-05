var Status = (() => {
    return {
        STATUS_CONFLICT: 409,
        STATUS_NOT_FOUND: 404,
        STATUS_OK: 200,
        STATUS_UNPROCESSABLE_ENTITY: 402,
        STATUS_BAD_REQUEST: 400,
        STATUS_INTERNAL_SERVER_ERROR: 500,
        STATUS_UN_AUTHORIZED: 401,
    }
})();

module.exports = Status;