/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const { Pool } = require('pg') //importação do node-postgress

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  const pool = new Pool({  
    host: 'lallah.db.elephantsql.com',
    user: 'xasuqnxe',
    password: '3KIKxICeyvl8g5uXPWROj8YY6qwUXpLF',
    database: 'xasuqnxe',
    port: 5432
  })

  on('task', {
    removeUser(email) { //criação da promessa, para abortar quando der erro ou resolver a remoção do usuário (DELETE)
      return new Promise(function(resolve){
        pool.query('DELETE FROM public.users WHERE email = $1', [email], function(error, result){
          if (error) {
            throw error
          }
          resolve({success: result})
        })
      })

    }
  })

}
