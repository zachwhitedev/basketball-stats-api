'use strict';

const pool = require('../db');

exports.handler = async event => {
    const body = event.body;
    const gameid = body.gameid;
    console.log(gameid);
    const teamid = body.teamid;
    console.log(teamid);

  const getPlayers = {
    text: 'SELECT pgid, playerid, gameid, teamid, fg, nofg, trey, notrey, ft, noft, reb, ast, blk, stl, tover, pf FROM playergame WHERE gameid = $1 AND teamid = $2',
    values: [gameid, teamid]
  };

  try {
    const gamedata = await pool.query(getPlayers);
    let finalData = [];
    for(let i=0; i < gamedata.rows.length; i++){
      finalData.push(gamedata.rows[i])
      continue;
    }
    const response = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: {
        playerData: finalData
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