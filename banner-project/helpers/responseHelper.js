const sendResponse = (res, statusCode, success, message, data = null) => {
  res.status(statusCode).json({
    success,
    statusCode,
    message,
    data,
  });
};

module.exports = sendResponse;
