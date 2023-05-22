function extractLinks (fileData) {
  const mdText = fileData.data
  const regExLink = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm
  const linkMatcher = mdText.match(regExLink)

  if (linkMatcher !== null) {
    const links = linkMatcher.map(link => {
      const removePunctuation = link.replace(/.$/, '').replace(/^./, '')
      const splitEx = removePunctuation.split('](')

      const linksObj = {
        file: fileData.file,
        text: splitEx[0],
        href: splitEx[1]
      }

      return linksObj
    })
    console.log(links)
    return links
  }
}

function getLinks (files) {
  const filesArr = []
  filesArr.push(files)
  return new Promise((resolve, reject) => {
    const linksArr = filesArr.flatMap(extractLinks)
      .filter((link) => link)
    resolve(linksArr)
  })
}

function validateLinks (linksArr) {
  return Promise.all(
    linksArr.map(element => {
      return fetch(element.href)
        .then(linksObj => {
          if (linksObj.ok !== undefined && linksObj.status !== undefined) {
            const fetchLinkObj = { ...element, status: linksObj.status, ok: linksObj.ok }
            return fetchLinkObj
          } else {
            throw new Error('Invalid fetch response')
          }
        })
        .catch(err => ({ ...element, status: err, ok: false }))
    }))
}

function linkStats (linksArr) {
  return new Promise((resolve) => {
    const hrefList = []
    let broken = 0
    linksArr.forEach(element => {
      hrefList.push(element.href)
      if (element.ok === false) {
        broken++
      };
    })

    const uniqueLinks = new Set(hrefList)

    const objStats = {
      total: hrefList.length,
      unique: uniqueLinks.size,
      broken
    }
    resolve(objStats)
  })
}

module.exports = {
  getLinks,
  validateLinks,
  linkStats
}
