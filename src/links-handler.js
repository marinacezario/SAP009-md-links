function extractLinks (content) {
  const mdText = content.data
  const regExLink = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm
  const linkMatcher = mdText.match(regExLink)

  if (linkMatcher !== null) {
    const links = linkMatcher.map(link => {
      const removePunctuation = link.replace(/.$/, '').replace(/^./, '')
      const splitEx = removePunctuation.split('](')

      const linksObj = {
        file: content.file,
        text: splitEx[0],
        href: splitEx[1]
      }

      return linksObj
    })
    return links
  }
}

function getLinks (files) {
  return files.map(extractLinks)
    .filter((link) => link).flat()
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
        .catch(err => ({ ...element, status: err.message, ok: false }))
    }))
}

function linkStats (linksArr) {
  return new Promise((resolve) => {
    const hrefList = []
    let broken = 0
    if (linksArr) {
      linksArr.forEach(element => {
        hrefList.push(element.href)
        if (element.ok === false) {
          broken++
        };
      })
    }

    const uniqueLinks = new Set(hrefList)

    const objStats = {
      total: hrefList.length,
      unique: uniqueLinks.size,
      broken
    }
    resolve({ links: linksArr, stats: objStats })
  })
}

module.exports = {
  getLinks,
  validateLinks,
  linkStats
}
