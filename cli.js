#!/usr/bin/env node
const chalk = require('chalk')
const { mdLinks } = require('./src/md-links.js')
const { linkStats } = require('./src/links-handler.js')

const dirPath = process.argv[2]
const options = {
  validate: process.argv.includes('--validate'),
  stats: process.argv.includes('--stats')
}

function showValidation (linksArr) {
  linksArr.forEach(objStats => {
    let ok
    let icon

    if (objStats.ok) {
      ok = chalk.green('OK')
      icon = chalk.green('\u2714')
    } else {
      ok = chalk.red('FAIL')
      icon = chalk.red('\u2717')
    }
    console.log(icon, objStats.file, objStats.href, ok, objStats.status, objStats.text)
  })
}

function showStats (linksArr, options) {
  linkStats(linksArr)
    .then(objStats => {
      console.log('Total: ', linksArr.stats.total)
      console.log('Unique: ', linksArr.stats.unique)

      if (options.validate) {
        console.log('Broken: ', linksArr.stats.broken)
      }
    })
}

function showFilesLinks (linksArr) {
  linksArr.forEach(element => {
    console.log(element.file, element.href, element.text)
  })
}

mdLinks(dirPath, options)
  .then(result => {
    if (options.stats) {
      showStats(result, options)
    } else if (options.validate) {
      showValidation(result)
    } else if (!options.validate) {
      showFilesLinks(result)
    } else {
      console.log('Invalid command')
    }
  })
  .catch(error => {
    console.error(chalk.red(error.message))
  })
