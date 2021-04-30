const { mysqldb } = require('./../connection');
const fs = require('fs');
const hashpass = require('./../helpers/HashPass');
const { promisify } = require('util');
const { createAccessToken } = require('./../helpers/CreateToken');
// const handlebars = require('handlebars');
const dba = promisify(mysqldb.query).bind(mysqldb);
const jwt = require('jsonwebtoken');

module.exports = {
    Register: async (req, res) => {
        try {
            const { email, username, password } = req.body;
            const validation = new RegExp('^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[@$!%*?&])').test(password);
            const mail = /[@]/g;
            if (!email || !username || !password) {
                return res.status(400).send({ message: 'Pastikan data terisi semua' });
            } else if (password.length < 6) {
                return res.status(400).send({ message: 'Password harus lebih dari 6 karakter' });
            } else if (!validation) {
                return res
                    .status(400)
                    .send({ message: 'Password harus berunsur angka, spesial character huruf besar dan huruf kecil' });
            } else if (!email.match(mail)) {
                return res.status(400).send({ message: 'Pastikan untuk memasukan Email yang benar' });
            }
            let sql = `select * from users where username = ? and email = ? `;

            const datausers = await dba(sql, [username, email]);
            if (datausers.length) {
                return res.status(500).send({ message: 'username telah terdaftar' });
            } else {
                sql = `insert into users set ?`;
                const iduser = Date.now();

                let data = {
                    uid: iduser,
                    username: username,
                    password: password,
                    email: email,
                };
                const dataUsers = await dba(sql, data);
                const id = dataUsers.insertId;
                console.log(data);
                sql = `select id,uid,username,email from users where uid = ? `;
                const dataUser = await dba(sql, [iduser, id]);

                let dataToken = {
                    uid: dataUser[0].uid,
                    username: dataUser[0].username,
                };

                const tokenAccess = createAccessToken(dataToken);

                return res.status(200).send({ ...dataUser[0], token: tokenAccess });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'server error' });
        }
    },
    Login: (req, res) => {
        const { user, password } = req.body;

        if (!user || !password) {
            return res.status(400).send({ message: 'bad request' });
        }
        let sql = `SELECT id,uid,username,email,status,role FROM users 
        WHERE (username = ? or email = ?) and password = ?`;
        mysqldb.query(sql, [user, user, password], (err, dataUser) => {
            if (err) return res.status(500).send({ message: err });

            if (dataUser.length) {
                const dataToken = {
                    id: dataUser[0].id,
                    username: dataUser[0].username,
                };
                const token = createAccessToken(dataToken);
                return res.status(200).send({ ...dataUser[0], token: token });
            } else {
                return res.status(500).send({ message: 'login gagal' });
            }
        });
    },
    Deactive: async (req, res) => {
        try {
            const update = { status: 0 };
            let sql = `select * from users where id = ?`;
            let dataUser = await dba(sql, [req.user.id]);
            if (dataUser[0].status == 0) {
                return res.status(500).send({ message: 'user deactive' });
            } else {
                sql = `update users set ? where id = ?`;
                dataUser = await dba(sql, [update, req.user.id]);
                sql = `select uid from users where id = ?`;
                dataUser = await dba(sql, req.user.id);
                return res.status(200).send({ ...dataUser[0], status: 'deactive' });
            }
        } catch (error) {
            return res.status(500).send({ message: 'server error' });
        }
    },
    Activate: async (req, res) => {
        try {
            const update = { status: 1 };
            let sql = `select * from users where id = ?`;
            let dataUser = await dba(sql, [req.user.id]);
            if (dataUser[0].status == 1) {
                return res.status(500).send({ message: 'user active' });
            } else {
                sql = `update users set ? where id = ?`;
                dataUser = await dba(sql, [update, req.user.id]);
                sql = `select uid from users where id = ?`;
                dataUser = await dba(sql, req.user.id);
                return res.status(200).send({ ...dataUser[0], status: 'active' });
            }
        } catch (error) {
            return res.status(500).send({ message: 'server error' });
        }
    },
    Closed: async (req, res) => {
        try {
            const update = { status: 2 };
            let sql = `select * from users where id = ?`;
            let dataUser = await dba(sql, [req.user.id]);
            if (dataUser[0].status == 2) {
                return res.status(500).send({ message: 'user closed' });
            } else {
                sql = `update users set ? where id = ?`;
                dataUser = await dba(sql, [update, req.user.id]);
                sql = `select uid from users where id = ?`;
                dataUser = await dba(sql, req.user.id);
                return res.status(200).send({ ...dataUser[0], status: 'closed' });
            }
        } catch (error) {
            return res.status(500).send({ message: 'server error' });
        }
    },
};
