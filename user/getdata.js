'use strict';

const pool = require('../db');

exports.handler = async event => {
  let params = event.pathParameters;
  let userid = params.id;

  const getTeams = {
    text: 'SELECT team_name, team_id FROM teams WHERE user_id = $1',
    values: [userid]
  };

  const getUserData = {
    text: 'SELECT id, firstname, lastname, email FROM users WHERE id = $1',
    values: [userid]
  };
  
  const getPlayers = {
    text: 'SELECT player_id, firstname, lastname, team_id, jersey FROM players WHERE user_id = $1',
    values: [userid]
  };
  
  try {
    const teamData = await pool.query(getTeams);
    const userData = await pool.query(getUserData);
    const playerData = await pool.query(getPlayers);
    
    let teams = [];
    for (let i = 0; i < teamData.rows.length; i++) {
      let team = {
        id: teamData.rows[i].team_id,
        name: teamData.rows[i].team_name
      }
      teams.push(team);
      continue;
    }
    
    let players = [];
    for(let i =0; i < playerData.rows.length; i++){
      let player = {
        id: playerData.rows[i].player_id,
        firstname: playerData.rows[i].firstname,
        lastname: playerData.rows[i].lastname,
        team_id: playerData.rows[i].team_id,
        jersey: playerData.rows[i].jersey
      }
      players.push(player);
    }

    const response = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        data: {
          id: userData.rows[0].user_id,
          firstname: userData.rows[0].firstname,
          lastname: userData.rows[0].lastname,
          email: userData.rows[0].email,
          teams: teams,
          players: players
        }
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
