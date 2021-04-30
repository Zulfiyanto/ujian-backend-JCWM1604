const { mysqldb } = require('./../connection');
const fs = require('fs');
const { promisify } = require('util');
// const handlebars = require('handlebars');
const dba = promisify(mysqldb.query).bind(mysqldb);

module.exports = {
    MovieAll: (req, res) => {
        let sql = `select * from movies`;
        mysqldb.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: 'server error' });
            }
            return res.status(200).send(result);
        });
    },
    UpcommingMovie: (req, res) => {},
    AddAdminMovie: (req, res) => {},
    EditStatusMovie: (req, res) => {},
    AddScheduleMovie: (req, res) => {},
};
