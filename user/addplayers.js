'use strict';

const pool = require('../db');

exports.handler = async event => {
  const bodyData = event.body;
  const teamid = bodyData.teamid;
  const userid = bodyData.userid;
  const players = bodyData.players;

  let promises = [];
  for (let i = 0; i < players.length; i++) {
    if (players[i].firstname && players[i].lastname && teamid && userid) {
      const playerFirstName = players[i].firstname;
      const playerLastName = players[i].lastname;
      const playerJersey = players[i].jersey;
      const query = {
        text:
          'INSERT INTO players (firstname, lastname, user_id, team_id, jersey) VALUES ($1, $2, $3, $4, $5)',
        values: [playerFirstName, playerLastName, userid, teamid, playerJersey]
      };
      const promise = await pool.query(query);
      promises.push(promise);
      continue;
    } else {
      console.log('Missing player data...');
      continue;
    }
  }

  try {
    const [values] = await Promise.all(promises);
    const response = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: {
        message: 'Players added successfully.',
        successfulQueries: values.rowCount
      }
    };
    return response;
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
