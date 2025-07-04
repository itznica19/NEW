const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'phpmyadmin.romangry.fr',
    user: 'student', // change this for your project
    password: '@Stud3nt2026', // change this for your project
    database: 'schooldb' // change this for your project
});

module.exports = pool.promise();