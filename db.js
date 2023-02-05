'use strict'
const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'arkalsekar',
  password: 'arkalsekar',
  database: 'expressdb'
})

connection.connect()

module.exports = connection