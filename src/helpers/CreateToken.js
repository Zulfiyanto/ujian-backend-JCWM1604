const jwt = require('jsonwebtoken');

module.exports = {
    createAccessToken: (data) => {
        const key = process.env.ACCESS_TOKEN_KEY;
        const token = jwt.sign(data, key, { expiresIn: '2h' });
        return token;
    },
};
