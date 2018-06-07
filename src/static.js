'use strict'
const fs = require('fs')
const path = require('path')
const express = require('express')

const puppyConfig = require('../puppy.config.js')

function initialize (staticApp) {
  const configFile = path.resolve(process.cwd(), 'puppy.config.js')

  if (fs.existsSync(configFile)) {
    Object.assign(puppyConfig, require(configFile))
  }

  staticApp.use(express.static(puppyConfig.STATIC_DIR))
}

module.exports = initialize
