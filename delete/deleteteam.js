'use strict';

const pool = require('../db');

exports.handler = async event => {
  const bodyData = event.body;
  const userid = bodyData.userid;
  const teamid = bodyData.teamid;

  const deleteTeam = {
    text: 'DELETE FROM teams WHERE team_id = $1 AND user_id = $2',
    values: [teamid, userid]
  };
  
  const deletePlayers = {
    text: 'DELETE FROM players WHERE team_id = $1 AND user_id = $2',
    values: [teamid, userid]
  }

  const deletePlayerGames = {
    text: 'DELETE FROM playergame WHERE teamid = $1',
    values: [teamid]
  }

  try {
    const queryOne = await pool.query(deleteTeam);
    const queryTwo = await pool.query(deletePlayers);
    const queryThree = await pool.query(deletePlayerGames);
    const [ deletedTeam, deletedPlayers, deletedPlayerGames ] = await Promise.all([queryOne, queryTwo, queryThree]);
    if (deletedTeam.rowCount > 0 && deletedPlayers.rowCount > 0 && deletedPlayerGames.rowCount > 0) {
      const response = {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: {
          message: `Team deleted successfully`
        }
      };
      return response;
    } else console.log('Problem deleting from database.');
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
