const fs = require('fs')
const path = require('path')

function dirReader (dirPath) {
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

function fileReader (file) {
  const isFileMd = path.extname(file) === '.md'
  if (!isFileMd) {
    return Promise.reject(new Error('file is not .md'))
  }
  return fs.promises.readFile(file).then(data => {
    return { file, data: data.toString() }
  })
}

function mainReader (dirPath) {
  return fs.promises.stat(dirPath)
    .then(statsObj => {
      return statsObj.isDirectory() ? dirReader(dirPath) : fileReader(dirPath).then((result) => [result])
    })
}

module.exports = { mainReader }
