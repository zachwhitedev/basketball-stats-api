'use strict';

const pool = require('../db');

exports.handler = async event => {
  const confirmString = event.body.confirmstring.toString();
  const query = {
    text:
      'SELECT id, firstname, lastname, email FROM users WHERE confirm_string = $1',
    values: [confirmString]
  };

  try {
    const results = await pool.query(query);
    if (results.rows[0]) {
      const nowConfirmed = 'true';
      const userId = results.rows[0].id;
      const userEmail = results.rows[0].email;
      const confirmUser = {
        text: 'UPDATE users SET is_confirmed = $1 WHERE id = $2 AND email = $3',
        values: [nowConfirmed, userId, userEmail]
      };
      try {
        const result = await pool.query(confirmUser);
        if (result.rowCount > 0) {
          const response = {
            statusCode: 200,
            body: JSON.stringify({
              success: 'User email confirmed.',
              message: 'User email confirmed.'
            })
          };
          return response;
        } else {
          const response = {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error confirming user email.' })
          };
          return response;
        }
      } catch (err) {
        const response = {
          statusCode: 500,
          body: JSON.stringify({ error: err })
        };
        return response;
      }
    } else {
      console.log('Error line 56 confirmEmail.js');
    }
  } catch (err) {
    const response = {
      statusCode: 500,
      body: JSON.stringify({ error: err })
    };
    return response;
  }
};
