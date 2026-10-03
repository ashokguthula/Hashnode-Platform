// Handle unknown routes
const notFound = (req, res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Handle application errors
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode && res.statusCode !== 200
        ? res.statusCode
        : 500;

    res.status(statusCode).json({
        message: err.message || "Server error",
    });
};

module.exports = {
    notFound,
    errorHandler,
};