'use strict';

const pool = require('../db');

exports.handler = async (event) => {
  const body = event.body;
  const playerid = body.playerid;
  const gameid = body.gameid;
  const teamid = body.teamid;
  const eventid = body.eventid;

  if (eventid == 13) {
    const query = {
      text: `UPDATE playergame SET fg = fg - 1 WHERE playerid = $1 AND gameid = $2 AND teamid = $3`,
      values: [playerid, gameid, teamid],
    };

    const query2 = {
        text: `UPDATE games SET teamscore = teamscore - 2 WHERE game_id = $1 AND team_id = $2`,
        values: [gameid, teamid],
      }
      try {
        const updated = await pool.query(query);
        const updatedScore = await pool.query(query2);
        const values = await Promise.all([updated, updatedScore]);
        if (values) {
          return respondGood();
        }
    } catch (err) {
      console.log(err);
      return respondBad(err);
    }
  } else if (eventid == 14) {
    const query = {
      text: `UPDATE playergame SET nofg = nofg - 1 WHERE playerid = $1 AND gameid = $2 AND teamid = $3`,
      values: [playerid, gameid, teamid],
    };
    
    try {
      const updated = await pool.query(query);
      if (updated.rowCount > 0) {
        return respondGood();
      }
    } catch (err) {
      console.log(err);
      return respondBad(err);
    }
  } else if (eventid == 15) {
    const query = {
      text: `UPDATE playergame SET trey = trey - 1 WHERE playerid = $1 AND gameid = $2 AND teamid = $3`,
      values: [playerid, gameid, teamid],
    };
    const query2 = {
        text: `UPDATE games SET teamscore = teamscore - 3 WHERE game_id = $1 AND team_id = $2`,
        values: [gameid, teamid],
      }
      try {
        const updated = await pool.query(query);
        const updatedScore = await pool.query(query2);
        const values = await Promise.all([updated, updatedScore]);
        if (values) {
          return respondGood();
        }
    } catch (err) {
      console.log(err);
      return respondBad(err);
    }
  } else if (eventid == 16) {
    const query = {
      text: `UPDATE playergame SET notrey = notrey - 1 WHERE playerid = $1 AND gameid = $2 AND teamid = $3`,
      values: [playerid, gameid, teamid],
    };
    try {
      const updated = await pool.query(query);
      if (updated.rowCount > 0) {
        return respondGood();
      }
    } catch (err) {
      console.log(err);
      return respondBad(err);
    }
  } else if (eventid == 17) {
    const query = {
      text: `UPDATE playergame SET ft = ft - 1 WHERE playerid = $1 AND gameid = $2 AND teamid = $3`,
      values: [playerid, gameid, teamid],
    };
    const query2 = {
        text: `UPDATE games SET teamscore = teamscore - 1 WHERE game_id = $1 AND team_id = $2`,
        values: [gameid, teamid],
      }
      try {
        const updated = await pool.query(query);
        const updatedScore = await pool.query(query2);
        const values = await Promise.all([updated, updatedScore]);
        if (values) {
          return respondGood();
        }
    } catch (err) {
      console.log(err);
      return respondBad(err);
    }
  } else if (eventid == 18) {
    const query = {
      text: `UPDATE playergame SET noft = noft - 1 WHERE playerid = $1 AND gameid = $2 AND teamid = $3`,
      values: [playerid, gameid, teamid],
    };
    try {
      const updated = await pool.query(query);
      if (updated.rowCount > 0) {
        return respondGood();
      }
    } catch (err) {
      console.log(err);
      return respondBad(err);
    }
  } else if (eventid == 19) {
    const query = {
      text: `UPDATE playergame SET reb = reb - 1 WHERE playerid = $1 AND gameid = $2 AND teamid = $3`,
      values: [playerid, gameid, teamid],
    };
    try {
      const updated = await pool.query(query);
      if (updated.rowCount > 0) {
        return respondGood();
      }
    } catch (err) {
      console.log(err);
      return respondBad(err);
    }
  } else if (eventid == 20) {
    const query = {
      text: `UPDATE playergame SET ast = ast - 1 WHERE playerid = $1 AND gameid = $2 AND teamid = $3`,
      values: [playerid, gameid, teamid],
    };
    try {
      const updated = await pool.query(query);
      if (updated.rowCount > 0) {
        return respondGood();
      }
    } catch (err) {
      console.log(err);
      return respondBad(err);
    }
  } else if (eventid == 21) {
    const query = {
      text: `UPDATE playergame SET blk = blk - 1 WHERE playerid = $1 AND gameid = $2 AND teamid = $3`,
      values: [playerid, gameid, teamid],
    };
    try {
      const updated = await pool.query(query);
      if (updated.rowCount > 0) {
        return respondGood();
      }
    } catch (err) {
      console.log(err);
      return respondBad(err);
    }
  } else if (eventid == 22) {
    const query = {
      text: `UPDATE playergame SET stl = stl - 1 WHERE playerid = $1 AND gameid = $2 AND teamid = $3`,
      values: [playerid, gameid, teamid],
    };
    try {
      const updated = await pool.query(query);
      if (updated.rowCount > 0) {
        return respondGood();
      }
    } catch (err) {
      console.log(err);
      return respondBad(err);
    }
  } else if (eventid == 23) {
    const query = {
      text: `UPDATE playergame SET tover = tover - 1 WHERE playerid = $1 AND gameid = $2 AND teamid = $3`,
      values: [playerid, gameid, teamid],
    };
    try {
      const updated = await pool.query(query);
      if (updated.rowCount > 0) {
        return respondGood();
      }
    } catch (err) {
      console.log(err);
      return respondBad(err);
    }
  } else if (eventid == 24) {
    const query = {
      text: `UPDATE playergame SET pf = pf - 1 WHERE playerid = $1 AND gameid = $2 AND teamid = $3`,
      values: [playerid, gameid, teamid],
    };
    try {
      const updated = await pool.query(query);
      if (updated.rowCount > 0) {
        return respondGood();
      }
    } catch (err) {
      console.log(err);
      return respondBad(err);
    }
  } else {
    console.log('wtf...');
  }
};

///////////////// responses /////////////////////////

const respondGood = () => {
  const response = {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: {
      message: `Game event removed succesfully.`,
      operations: 1
    },
  };
  return response;
};

const respondBad = (err) => {
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
};

////////////////////////////////////////////