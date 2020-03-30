'use strict';

const pool = require('../db');

exports.handler = async event => {

  const bodyData = event.body;
  const userid = bodyData.userid;
  const teamname = bodyData.teamname;

  const addTeam = {
    text:
      'INSERT INTO teams (user_id, team_name) VALUES ($1, $2)',
    values: [userid, teamname]
  };

  try {
    const addedTeam = await pool.query(addTeam);
    if(addedTeam.rowCount > 0){
        const response = {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: {
            message: `New team ${teamname} added successfully`
          }
        };
        return response;
    } else console.log('Problem writing to database.')
  } catch (err) {
    const response = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: err
      })
    };
    console.log(err);
    return response;
  }
};
