const express = require('express');

const cors = require('cors');
require('dotenv').config();
const bearerToken = require('express-bearer-token');

// main app
const app = express();

// apply middleware
const morgan = require('morgan');
morgan.token('date', function (req, res) {
    return new Date();
});
app.use(bearerToken());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :date'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

// main route
const response = (req, res) => res.status(200).send('<h1>REST API JCWM1604</h1>');
app.get('/', response);

const { AuthRoutes } = require('./src/routes');
app.use('/user', AuthRoutes);
const { MovieRoutes } = require('./src/routes');
app.use('/movies', MovieRoutes);

// bind to local machine
app.all('*', (req, res) => {
    res.status(404).send('result not found');
});
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => `CONNECTED : port ${PORT}`);
