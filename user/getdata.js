'use strict';

const pool = require('../db');

exports.handler = async event => {
    let params = event.pathParameters;
    let userid = params.id;
    const getTeams = {
        text:
          'SELECT name FROM teams WHERE user_id = $1',
        values: [userid]
      };
    
      try {
        const data = await pool.query(getTeams);
      }catch(err){
          console.log(err);
      }
};