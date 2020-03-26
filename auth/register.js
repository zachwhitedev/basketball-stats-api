'use strict';

const pool = require('../db');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');

exports.handler = async event => {
  let userData;
  if (typeof event.body === 'string') {
    try {
      userData = JSON.parse(event.body);
    } catch (e) {
      new Error('Could not parse Data');
    }
  }

  const email = userData.email.toString();
  const password = userData.password.toString();
  const firstname = userData.firstname.toString();
  const lastname = userData.lastname.toString();

  const checkEmail = {
    text: 'SELECT firstname FROM users WHERE email = $1',
    values: [email]
  };

  try {
    const results = await pool.query(checkEmail);
    if (results.rowCount > 0) {
      const response = {
        statusCode: 402,
        body: JSON.stringify({ message: 'User already exists.' })
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
        const results = await pool.query(query);
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        if (results) {
          const msg = {
            to: email,
            from: 'zach@basketballapp.com',
            subject: 'confirm your account with Basketball App',
            text: 'no text, using html instead',
            html: `<h4 style="color: green";">whats up ${firstname}!</h4><p>Click <a href='https://basketball-stats.netlify.com/userconfirmation/ipvtw0vfmlvh5fk2s/${confirmString}'>here</a> to confirm your email.</p><p>- Zach White</p>`
          };
          sgMail.send(msg);
          const response = {
            statusCode: 200,
            body: JSON.stringify({ message: 'User added successfully.' })
          };
          return response;
        }
      } catch (err) {
        const response = {
          headers: { 'Content-Type': 'application/json' },
          data: null,
          message: err.message
        };
        return response;
      }
    }
  } catch (err) {
    const response = {
      statusCode: 402,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(err)
    };
    return response;
  }
};
