'use strict';

const pool = require('../db');

exports.handler = async event => {
  const bodyData = event.body;
  const userid = bodyData.userid;
  const teamid = bodyData.teamid;
  const playerid = bodyData.playerid;

  const deletePlayer = {
    text: 'DELETE FROM players WHERE player_id = $1 AND team_id = $2 AND user_id = $3',
    values: [playerid, teamid, userid]
  };
  const deletePlayerGame = {
    text: 'DELETE FROM playergame WHERE playerid = $1 AND teamid = $2',
    values: [playerid, teamid]
  };

  try {
    const deletedPlayer = await pool.query(deletePlayer);
    const deletedPlayerGame = await pool.query(deletePlayerGame);
    const [values] = await Promise.alll([deletedPlayer, deletedPlayerGame]);
    if (values) {
      const response = {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: {
          message: `Player deleted successfully`
        }
      };
      return response;
    } else console.log('Problem writing to database.');
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
