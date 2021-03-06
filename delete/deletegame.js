'use strict';

const pool = require('../db');

exports.handler = async event => {

  const game = event.body;
  console.log(game);
  const userid = game.userid;
  const teamid = game.teamid;
  const gameid = game.gameid;

  const deleteGame = {
    text: 'DELETE FROM games WHERE game_id = $1 AND team_id = $2 AND user_id = $3',
    values: [gameid, teamid, userid]
  };

  const deletePlayerGameEntries = {
    text: 'DELETE FROM playergame WHERE gameid = $1 AND teamid = $2',
    values: [gameid, teamid]
  }

  try {
    const deletedGame = await pool.query(deleteGame);
    const deletedPlayerGameEntries = await pool.query(deletePlayerGameEntries);
    const allDone = await Promise.all([deletedGame, deletedPlayerGameEntries]);
    if (allDone) {
      const response = {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: {
          message: `Game deleted successfully`
        }
      };
      return response;
    } else console.log('Problem deleting game from database.');
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