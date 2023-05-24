const fs = require('fs')
const path = require('path')

// leitor de diretorio precisa ter uma promessa de que vai ler o diretorio
// usar o ReadDir do FS para ler o diretorio
// usar o forEach para ver se tem mais algum diretorio ali
// se tiver mais algum diretorio, chamar de novo o leitor de diretorio
//  se não tiver mais nenhum diretorio, ele vai olhar os arquivos e separar o que for MD
// usar o map para chamar o leitor de arquivo para chamar cada .md
// retornar o result

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
      return statsObj.isDirectory()
        ? dirReader(dirPath)
        : fileReader(dirPath)
          .then((result) => [result])
    })
}

module.exports = {
  dirReader,
  fileReader,
  mainReader
}
