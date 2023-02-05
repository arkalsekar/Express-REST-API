const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const bodyParser = require('body-parser')
const db = require('./db')


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Main Endpoint
app.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, rows, fields) => {

    if (err) throw err;
    console.log('The solution is: ', rows[0])
  })

  res.json(
    {
      "/all": "Gets you all the Data from the Database",
      "/get/user": "Gets You the Data from the Database",
      "/post": "Adds the Data to the Database",
      "/put": "Updates the Data to the Database",
      "/drop": "Deletes the Data from the Database",
    }
  )
})

// To get All the Data from MySQL Database
app.get('/all', (req, res) => {
  db.query('SELECT * FROM users', (err, rows, fields) => {
    if (err) throw err
    var rows = rows;

    res.json(rows)
    console.log('The solution is: ', rows)
  })

})

// To get specific data from MySQL Database
app.get('/get/:user', (req, res) => {
  let user = req.params.user
  db.query(`SELECT * FROM users WHERE Name = '${user}'`, (err, rows, fields) => {
    if (err) throw err
    var rows = rows;

    res.json(rows)
    console.log('The solution is: ', rows)
  })

})

// To create a New Entry in MySQL Database
app.post('/post', (req, res, next) => {
  let name = req.body.name
  let email = req.body.email
  let raw_data = req.body
  console.log(name, email)
  let sql = `INSERT INTO USERS VALUES('${name}', '${email}')`
  db.query(sql, (err, rows, fields) => {
    if (err) {
      res.json({ "Error": err })
    }

    res.json({ "Data_Added": raw_data })

  })
  // res.json({"status": "Ok"})
})

// Updates the Data from MySQL Database
app.put('/put', (req, res) => {
  let raw_data = req.body
  if (req.body.old_name) {
    let sql = `UPDATE users set name='${req.body.new_name}' WHERE name = '${req.body.old_name}'`
    db.query(sql, (err, rows, fields) => {
      if (err) {
        res.json({ "Error": err })
      }

      res.json({ 'Data_Updated': req.body.new_name })
    })
  }
  else if (req.body.old_email) {
    let sql = `UPDATE users set email='${req.body.new_email}' WHERE email = '${req.body.old_email}'`
    db.query(sql, (err, rows, fields) => {
      if (err) {
        res.json({ "Error": err })
      }

      res.json({ 'Data_Updated': req.body.new_email })
    })
  }

  else {

    let fetch_by = req.body.fetch_by
    let fetch_by_value = req.body.fetch_by_value
    let update_by = req.body.update_by
    let update_by_value = req.body.update_by_value
    let sql = `UPDATE users set ${update_by} ='${update_by_value}' WHERE ${fetch_by} = '${fetch_by_value}'`
    db.query(sql, (err, rows, fields) => {
      if (err) {
        res.json(err)
      }

      res.json({ 'Data_Updated': { "fetch_By-value": update_by_value } })
    })
  }
  // res.json({"Data_Updated": "d"})
})

// Delete Data from MySQL Databse
app.delete('/drop', (req, res, next) => {
  let fetch_by = req.body.fetch_by
  let fetch_by_value = req.body.fetch_by_value

  let sql = `DELETE from users WHERE ${fetch_by} = '${fetch_by_value}'`
  db.query(sql, (err, rows, fields) => {
    if (err) {
      res.json(err)
    }
    res.json({"Status": "Deleted Successfully"})
  })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})