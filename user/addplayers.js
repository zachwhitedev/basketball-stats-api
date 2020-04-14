'use strict';

const pool = require('../db');

exports.handler = async (event) => {
  const bodyData = event.body;
  const teamid = bodyData.teamid;
  const userid = bodyData.userid;
  const players = bodyData.players;

  let promises = [];
  for (let i = 0; i < players.length; i++) {
    if (players[i].firstname && teamid && userid) {
      const playerFirstName = players[i].firstname;
      const playerLastName = players[i].lastname;
      const playerJersey = players[i].jersey;
      const query = {
        text:
          'INSERT INTO players (firstname, lastname, user_id, team_id, jersey) VALUES ($1, $2, $3, $4, $5) RETURNING player_id',
        values: [playerFirstName, playerLastName, userid, teamid, playerJersey],
      };
      const promise = await pool.query(query);
      promises.push(promise);
      continue;
    } else {
      console.log('Missing player data...');
      continue;
    }
  }

  try {
    const returnedPlayers = await Promise.all(promises);
    const getGames = {
      text: 'SELECT game_id FROM games WHERE user_id = $1 AND team_id = $2',
      values: [userid, teamid],
    };
    const existingGames = await pool.query(getGames);

    let pgPromises = [];
    for (let i = 0; i < returnedPlayers.length; i++) {
      let thisplayerid = returnedPlayers[i].rows[0].player_id;
      for (let i = 0; i < existingGames.rows.length; i++) {
        let game = existingGames.rows[i];
        const makePlayerGameEntry = {
          text:
            'INSERT INTO playergame (gameid, teamid, playerid) VALUES ($1, $2, $3)',
          values: [game.game_id, teamid, thisplayerid],
        };
        pgPromises.push(await pool.query(makePlayerGameEntry));
        continue;
      }
    }

    const pgentries = await Promise.all(pgPromises);

    const response = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        message: 'Players added successfully.',
      },
    };
    return response;
  } catch (err) {
    const response = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: err,
      }),
    };
    console.log(err);
    return response;
  }
};
