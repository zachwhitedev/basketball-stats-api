'use strict';

const pool = require('../db');

exports.handler = async event => {

  const bodyData = event.body;
  const userid = parseInt(bodyData.userid);
  const teamid = parseInt(bodyData.teamid);

  console.log('teamid', teamid);
  console.log('userid', userid);
  const getTeams = {
    text:
      'SELECT player_id, firstname, lastname, jersey FROM players WHERE user_id = $1 AND team_id = $2',
    values: [userid, teamid]
  };

  const getTeamName = {
    text:
      'SELECT team_name FROM teams WHERE user_id = $1 AND team_id = $2',
    values: [userid, teamid]
  };



  try {
    const playerData = await pool.query(getTeams);
    const teamName = await pool.query(getTeamName);

    const [ returnedPlayers, returnedTeamName ] = await Promise.all([ playerData, teamName ]);

    let players = [];
    for (let i = 0; i < returnedPlayers.rows.length; i++) {
      let player = {
        id: returnedPlayers.rows[i].player_id,
        firstname: returnedPlayers.rows[i].firstname,
        lastname: returnedPlayers.rows[i].lastname,
        team_id: returnedPlayers.rows[i].team_id,
        jersey: returnedPlayers.rows[i].jersey
      };
      players.push(player);
    }
    const response = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: {
        userid: userid,
        teamid: teamid,
        name: returnedTeamName.rows[0].team_name,
        players: players
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
