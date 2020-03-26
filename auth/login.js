'use strict';

const pool = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.handler = async event => {
  const userData = event.body;
  const email = userData.email;
  const password = userData.password;

  const query = {
    text:
      'SELECT id, email, firstname, lastname, password, is_confirmed FROM users WHERE email = $1',
    values: [email]
  };

  try {
    const data = await pool.query(query);
    if (data.rows[0].is_confirmed == 'false') {
      const response = {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'You must confirm your email account.'
        })
      };
      return response;
    } else if (data.rows[0].is_confirmed == 'true') {
      const validPass = await bcrypt.compare(password, data.rows[0].password);
      if (!validPass) {
        const response = {
          headers: { 'Content-Type': 'application/json' },
          statusCode: 400,
          body: JSON.stringify({
            error: 'Email/password authentication failed.'
          })
        };
        return response;
      } else if (validPass) {
        const payload = {
          userid: data.rows[0].id,
          useremail: data.rows[0].email,
          firstname: data.rows[0].firstname,
          lastname: data.rows[0].lastname
        };
        console.log(payload);
        let token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: 30 * 60
        });
        const response = {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: token
          })
        };
        return response;
      } else {
        const response = {
          headers: { 'Content-Type': 'application/json' },
          statusCode: 400,
          body: JSON.stringify({
            error: 'Error authenticating user.'
          })
        };
        return response;
      }
    } else {
      const response = {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'User does not exist.'
        })
      };
      return response;
    }
  } catch (err) {
    const response = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'User does not exist.'
      })
    };
    return response;
  }
};
