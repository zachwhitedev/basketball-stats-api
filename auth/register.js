'use strict';

const pool = require('../db');
const bcrypt = require('bcryptjs');

const sgMail = require('@sendgrid/mail');

exports.handler = async event => {

  let userData = JSON.parse(event.body);
  const email = userData.email;
  const password = userData.password;
  const firstname = userData.firstname;
  const lastname = userData.lastname;
  
  const checkEmail = {
    text: 'SELECT firstname FROM users WHERE email = $1',
    values: [email]
  };
  
  try {
    const results = await pool.query(checkEmail);
    if (results.rowCount > 0) {
      const response = {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        statusCode: 200,
        body: JSON.stringify({ error: 'User already exists.' })
      };
      return response;
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt); // hash password   
      const confirmStringPreSlice =
      Math.random()
      .toString(36)
      .slice(2) +
      Math.random()
      .toString(36)
      .slice(2);
      const confirmString = confirmStringPreSlice.slice(-15);
      const query = {
        text:
        'INSERT INTO users(email, password, firstname, lastname, confirm_string) VALUES($1, $2, $3, $4, $5)',
        values: [email, hashedPassword, firstname, lastname, confirmString]
      };
      try {
        await pool.query(query);
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: email,
          from: 'zach@basketballapp.com',
          subject: 'confirm your account with Basketball App',
          text: 'no text, using html instead',
          html: `<h4 style="color: green";">whats up ${firstname}!</h4><p>Click <a href='https://basketball-stats.netlify.com/userconfirmation/ipvtw0vfmlvh5fk2s/${confirmString}'>here</a> to confirm your email.</p><p>- Zach White</p>`
        };
        const message = await sgMail.send(msg);
        console.log(message);
          const response = {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            statusCode: 200,
            body: JSON.stringify({ message: 'User added successfully.', error: '' })
          };
          return response;
      } catch (err) {
        const response = {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          data: null,
          message: err.message
        };
        return response;
      }
    }
  } catch (err) {
    const response = {
      statusCode: 402,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(err)
    };
    return response;
  }
};
