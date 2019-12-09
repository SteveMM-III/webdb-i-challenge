const express = require( 'express' );

const knex = require('../data/dbConfig.js');

const router = express.Router();

router.get( '/', ( req, res ) => {
  knex
    .select( '*' )
    .from( 'accounts' )
    .then( accounts => {
      res.status( 200 ).json( accounts );
    } )
    .catch( error => {
      console.log( error );
      res.status( 500 ).json( { error: 'Error getting accounts' } );
    } );
} );

router.get( '/:id', validateAccountId, ( req, res ) => {
  res.status( 200 ).json( req.account );
} );

router.post( '/', ( req, res ) => {
  const postData = req.body;

  knex( 'accounts' )
    .insert( postData, 'id' )
    .then( ids => {
      const id = ids[ 0 ];

      return knex( 'accounts')
        .select( '*' )
        .where( { id } )
        .first()
        .then( account => {
          res.status( 200 ).json( account );
        } );
    } )
    .catch( error => {
      console.log( error );
      res.status( 500 ).json( { error: 'Error adding account' } );
    } );
} );

router.put( '/:id', validateAccountId, ( req, res ) => {
  const { id } = req.params;
  const changes = req.body;

  knex( 'accounts' )
    .where( { id } )
    .update( changes )
    .then( count => {
      if ( count > 0 ) { res.status( 200 ).json( { message: `${count} record(s) updated` } ); }
      else { res.status( 404 ).json( { message: 'account not found' } ); }
    })
    .catch( error => {
      console.log( error );
      res.status( 500 ).json( { error: 'error updating account' } );
    } );
} );

router.delete( '/:id', validateAccountId, ( req, res ) => {
  knex( 'accounts' )
    .where( { id: req.params.id } )
    .del()
    .then( count => {
      res.status( 200 ).json( { message: `${count} record(s) removed` } );
    } )
    .catch( error => {
      console.log(error);
      res.status(500).json( { errorMessage: "Error removing the account" } );
    } );
} );

function validateAccountId( req, res, next ) {
  knex
    .select( '*' )
    .from( 'accounts' )
    .where( { id: req.params.id } )
    .first()
    .then( account => {
      if ( account ) { req.account = account; next(); }
      else { res.status( 404 ).json( { message: "account id not found" } ) }
    } )
    .catch( error => {
      console.log( error );
      res.status( 500 ).json( { error: "error validating account id" } );
    } );
}

module.exports = router;