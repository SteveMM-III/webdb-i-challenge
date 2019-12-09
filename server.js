const express = require('express');
const helmet = require( 'helmet' );

const AccountsRouter = require( './accounts/accounts-router' );

const server = express();

function logger( req, res, next ) {
  console.log( `${ req.method }to ${ req.originalUrl }` )
  next();
}

server.get( '/', ( req, res ) => {
  res.send( '<h3>DB Challenge I with knex</h3>' );
} );


server.use( helmet()       );
server.use( express.json() );
server.use( logger         );

server.use( '/api/accounts', AccountsRouter );

module.exports = server;