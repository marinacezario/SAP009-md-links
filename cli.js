const { mdLinks } = require('./src/md-links.js')

const dirPath = process.argv[2]
const options = {
  validate: process.argv.includes('--validate'),
  stats: process.argv.includes('--stats')
}

mdLinks(dirPath, options)
  .then(links => {
    console.log(links)
  })
  .catch(error => {
    console.error(error)
  })