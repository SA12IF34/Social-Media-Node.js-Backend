module.exports = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
} 