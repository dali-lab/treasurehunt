const Firebase = require('firebase')
const config = require('../../config')
const huntsRef = new Firebase(`${ config.FIREBASE_ROOT }/hunts`)
const rootRef = new Firebase(`${ config.FIREBASE_ROOT }`)
const usersRef = new Firebase(`${ config.FIREBASE_ROOT }/users`)

