'use strict';

const pool = require('../db');

exports.handler = async event => {
  const bodyData = event.body;
  const userid = bodyData.userid;
  const teamid = bodyData.teamid;
  const playerid = bodyData.playerid; // this is all good, go from here

  const deletePlayer = {
    text: 'DELETE FROM players WHERE player_id = $1 AND team_id = $2 AND user_id = $3',
    values: [playerid, teamid, userid]
  };

  try {
    const deletedPlayer = await pool.query(deletePlayer);
    if (deletedPlayer.rowCount > 0) {
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
