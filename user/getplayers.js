'use strict';

const pool = require('../db');

exports.handler = async event => {
    const body = JSON.parse(event.body);
    const userid = body.userid;
    const teamid = body.teamid;

    // expects a req body of => { userid: 6, teamid: 22 }

  const getPlayers = {
    text: 'SELECT firstname, lastname, jersey FROM players WHERE user_id = $1 AND team_id = $2',
    values: [userid, teamid]
  };

  try {
    const playerData = await pool.query(getPlayers);
    let players = [];
    for(let i=0; i < playerData.rows.length; i++){
      players.push(playerData.rows[i])
      continue;
    }
    const response = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        playerList: players
      })
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