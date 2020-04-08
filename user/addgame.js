'use strict';

const pool = require('../db');

exports.handler = async event => {

  const game = event.body;

  const gamename = game.gamename;
  const userid = game.userid;
  const teamid = game.teamid;

  const addGame = {
    text:
      'INSERT INTO games (game_name, user_id, team_id) VALUES ($1, $2, $3)',
    values: [gamename, userid, teamid]
  };

  try {
    const addedGame = await pool.query(addGame);
    if(addedGame.rowCount > 0){
        const response = {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: {
            message: `New game '${gamename}' added successfully`
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
