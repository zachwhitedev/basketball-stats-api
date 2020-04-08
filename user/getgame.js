'use strict';

const pool = require('../db');

exports.handler = async event => {

  const game = event.body;
  const userid = parseInt(game.userid);
  const teamid = parseInt(game.teamid);
  const gameid = parseInt(game.gameid);

  const getGameData = {
    text:
    'SELECT game_id, game_name, end_result, teamscore, oppscore FROM games WHERE user_id = $1 AND team_id = $2 AND game_id = $3',
    values: [userid, teamid, gameid]
  };

  try {
    const gameData = await pool.query(getGameData);
    const response = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: {
        game: gameData.rows
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