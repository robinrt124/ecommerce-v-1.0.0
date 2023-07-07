/**
 * Error response
 * @param {Response} res
 * @param {object} param1
 * @returns
 */
const errorResponse = (
    res,
    { statusCode = 500, message = 'Internal Server Error' }
) => {
    return res.status(statusCode).json({
        success: false,
        message: message
    });
};

/**
 * Success response
 * @param {res} res
 * @param {object} param1
 * @returns
 */
const successResponse = (
    res,
    { statusCode = 200, message = 'Success', payload = {} }
) => {
    return res.status(statusCode).json({
        success: true,
        message: message,
        payload
    });
};

module.exports = {
    errorResponse,
    successResponse
};
