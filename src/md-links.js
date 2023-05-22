const { mainReader } = require('./fs-reader')
const { getLinks, validateLinks, linkStats } = require('./links-handler')

function mdLinks (filePath, options) {
  return new Promise((resolve, reject) => {
    mainReader(filePath)
      .then(fileContent => {
        if (!Array.isArray(fileContent)) {
          getLinks(fileContent)
            .then(linksObj => {
              if (!options.validate) {
                resolve(linksObj)
              } else {
                validateLinks(linksObj)
                  .then(fetchLinkObjResolved => {
                    if (options.stats) {
                      linkStats(fetchLinkObjResolved)
                        .then(statsObj => {
                          resolve({ links: fetchLinkObjResolved, stats: statsObj })
                        })
                    } else {
                      resolve(fetchLinkObjResolved)
                    }
                  })
              }
            })
        } else {
          const promises = fileContent.map(objContent => {
            return getLinks(objContent)
          })
          Promise.all(promises)
            .then(results => {
              const linksObj = results.flat()
              if (options.validate) {
                validateLinks(linksObj)
                  .then(fetchLinkObjResolved => {
                    if (options.stats) {
                      linkStats(fetchLinkObjResolved)
                        .then(statsObj => {
                          resolve({ links: fetchLinkObjResolved, stats: statsObj })
                        })
                    } else {
                      resolve(fetchLinkObjResolved)
                    }
                  })
              } else {
                if (options.stats) {
                  linkStats(linksObj)
                    .then(statsObj => {
                      resolve({ links: linksObj, stats: statsObj })
                    })
                } else {
                  resolve(linksObj)
                }
              }
            })
            .catch(reject)
        }
      })
      .catch(reject)
  })
}

module.exports = {
  mdLinks
}