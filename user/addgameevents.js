'use strict';

const pool = require('../db');

exports.handler = async event => {
  const bodyData = event.body;
  const events = bodyData.events;

  let promises = [];
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    if (
      event.userid &&
      event.playerid &&
      event.eventid &&
      event.gameid &&
      event.teamid
    ) {
      const userid = event.userid;
      const playerid = event.playerid;
      const eventid = event.eventid;
      const gameid = event.gameid;
      const teamid = event.teamid;
      const addGameEvent = {
        text:
          'INSERT INTO game_events (player_id, event_id, user_id, game_id, team_id) VALUES ($1, $2, $3, $4, $5)',
        values: [playerid, eventid, userid, gameid, teamid]
      };
      const promise = await pool.query(addGameEvent);
      promises.push(promise);
      continue;
    } else {
      console.log('Missing user data...');
      continue;
    }
  }

  try {
    const [ values ] = await Promise.all(promises);
    const response = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: {
        message: `All game events added succesfully.`,
        operations: values.rowCount
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
