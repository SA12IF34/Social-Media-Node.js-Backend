const whitelist = ['*', ];
const corsOptions = {
    origin: (origin, callback) => {whitelist.includes(origin) || !origin ? callback(null, true): callback(new Error('Not allowed by CORS'))},
    optionsSuccessStatus: 200
}

module.exports = corsOptions; 