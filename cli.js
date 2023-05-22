const { mdLinks } = require('./src/md-links.js')

const dirPath = process.argv[2]

mdLinks(dirPath)
  .then((result) => {
    console.log(result)
  })
  .catch((error) => {
    console.log('Error:', error.message)
  })