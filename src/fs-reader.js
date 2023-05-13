const fs = require("fs");
const path = require("path");
// const errorHandling = require("./errorHandling");


function dirReader(dirPath) {
  return new Promise((resolve) => {
    fs.promises.readdir(dirPath)
      .then((files) => {
        const readMd = files.filter(file => {
          return path.extname(file) === '.md'
        })
        .map(file => {
          return fileReader(path.resolve(dirPath, file))
        })
        return Promise.all(readMd)
          .then((result) => {
            resolve(result)
          })
      })

  })
}

function fileReader(file) {
  const isFileMd = path.extname(file) === '.md'
  if(!isFileMd) {
    console.log('MUST INCLUDE ERROR HERE')
    // return Promise.reject('não temos erros ainda')
  }
  return fs.promises.readFile(file).then(data => {
    return { file, data: data.toString() } 
  })
}

function mainReader (dirPath) {
  return fs.promises.stat(dirPath)
  .then(statsObj => {
    return statsObj.isDirectory() ? dirReader(dirPath) : fileReader(dirPath)
  })
}

module.exports = {
  dirReader,
  fileReader,
  mainReader
}