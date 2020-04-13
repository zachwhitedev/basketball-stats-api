'use strict';

const pool = require('../db');

exports.handler = async event => {

  const body = event.body;
  const gameid = body.gameid;
  const teamid = body.teamid;
  const userid = body.userid;
  const scoretype = body.scoretype;

  // scoretype
  // 1 = teamscore + 1
  // 2 = teamscore - 1
  // 3 = oppscore + 1
  // 4 = oppscore -1

  let changeScore = {
      text: '',
      values: [userid, teamid, gameid]
  }

  if(scoretype == 1){
      changeScore.text = `UPDATE games SET teamscore = teamscore + 1 WHERE user_id = $1 AND team_id = $2 AND game_id = $3`
    }
    else if(scoretype == 2){
        changeScore.text = `UPDATE games SET teamscore = teamscore - 1 WHERE user_id = $1 AND team_id = $2 AND game_id = $3`
    }
    else if(scoretype == 3){
        changeScore.text = `UPDATE games SET oppscore = oppscore + 1 WHERE user_id = $1 AND team_id = $2 AND game_id = $3`
    }
    else if(scoretype == 4){
        changeScore.text = `UPDATE games SET oppscore = oppscore - 1 WHERE user_id = $1 AND team_id = $2 AND game_id = $3`
  } else {
      console.log('zach, error 9178374');
  }

  try {
    const scoreChanged = await pool.query(changeScore);
    if(scoreChanged.rowCount > 0){
        const response = {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: {
            message: `Score changed successfully`
          }
        };
        return response;
    } else console.log('Problem writing to database.')
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