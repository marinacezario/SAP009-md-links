function extractLinks (fileData) {
    const mdText = fileData.data
    const regExLink = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm
    const linkMatcher = mdText.match(regExLink)
  
    if (linkMatcher !== null) {
      const linksArr = linkMatcher.map(link => {
        const removePunctuation = link.replace(/.$/, '').replace(/^./, '')
        const splitEx = removePunctuation.split('](')
  
        const linksObj = {
          file: fileData.file,
          text: splitEx[0],
          href: splitEx[1]
        }
  
        return linksObj
      })
      return linksArr
    }
  }
  
  function getLinks (files) {
    return new Promise((resolve, reject) => {
      const linksArr = files.flatMap(extractLinks)
        .filter((link) => link)
      console.log(linksArr)
      resolve(linksArr)
    })
  }
  // getLinks('./dir/text-with-links.md').then((linksObj) => console.log(linksObj))
  //   .catch((err) => {
  //     console.log(err)
  //   })
  module.exports = {
    getLinks
  }