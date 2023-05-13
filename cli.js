const { mainReader } = require ('./src/fs-reader.js')

mainReader(process.argv[2])
 .then((result) => {
    console.log(result)
 })
 .catch((err) => {
    console.log('this is the error: ' + err)
 })