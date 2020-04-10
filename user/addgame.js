'use strict';

const pool = require('../db');

exports.handler = async event => {

  try {
    const game = event.body;
  
    const gamename = game.gamename;
    const userid = game.userid;
    const teamid = game.teamid;
  
    const addGame = {
      text:
        'INSERT INTO games (game_name, user_id, team_id) VALUES ($1, $2, $3) RETURNING game_id, user_id, team_id',
      values: [gamename, userid, teamid]
    };
  
    const getPlayers = {
      text: 'SELECT * FROM players WHERE user_id = $1 AND team_id = $2',
      values: [userid, teamid]
    };
  
    const gameCreated = await pool.query(addGame);
    const teamPlayers = await pool.query(getPlayers);
  
    const [ createdGame, createdPlayers ] = await Promise.all([gameCreated, teamPlayers]);
  
    const createdGameId = createdGame.rows[0].game_id;
    const createdTeamId = createdGame.rows[0].team_id;
  
    let promises = [];
    for(let i=0; i < createdPlayers.rows.length; i++){
      let player = createdPlayers.rows[i];
      let addPlayerGame = {
        text: 'INSERT INTO playergame (playerid, gameid, teamid) VALUES ($1, $2, $3)',
        values: [player.player_id, createdGameId, createdTeamId]
      }
      const promise = await pool.query(addPlayerGame);
      promises.push(promise);
      continue;
    }
  
    const allDone = await Promise.all(promises);
    console.log('allDone', allDone);
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
  } catch (err){
    console.log('error!!! = ', err);
    const response = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: {
        error: err
      }
    };
    return response;
  }
};
