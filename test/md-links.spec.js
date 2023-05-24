const { mdLinks } = require('../src/md-links.js')
const { getLinks, validateLinks, linkStats } = require('../src/links-handler.js')
const { mainReader } = require('../src/fs-reader.js')

jest.mock('../src/links-handler.js') // Mockando as funções de links-handler
jest.mock('../src/fs-reader.js') // Mockando a função de fs-reader

describe('mdLinks', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return linksArr when options validate and stats are false', () => {
    const filePath = '/path/to/file.md'
    const fileContent = '...'
    const linksArr = [{ href: 'https://example.com', text: 'Example' }]

    mainReader.mockResolvedValue(fileContent)
    getLinks.mockReturnValue(linksArr)

    const options = { validate: false, stats: false }

    return mdLinks(filePath, options).then(result => {
      expect(mainReader).toHaveBeenCalledWith(filePath)
      expect(getLinks).toHaveBeenCalledWith(fileContent)
      expect(validateLinks).not.toHaveBeenCalled()
      expect(linkStats).not.toHaveBeenCalled()
    })
  })

  it('should return fetchLinkObjResolved when options validate is true and stats is false', () => {
    const filePath = '/path/to/file.md'
    const fileContent = '...'
    const linksArr = [{ href: 'https://example.com', text: 'Example' }]
    const fetchLinkObjResolved = [{ href: 'https://example.com', text: 'Example', status: 200 }]

    mainReader.mockResolvedValue(fileContent)
    getLinks.mockReturnValue(linksArr)
    validateLinks.mockResolvedValue(fetchLinkObjResolved)

    const options = { validate: true, stats: false }

    return mdLinks(filePath, options).then(result => {
      expect(mainReader).toHaveBeenCalledWith(filePath)
      expect(getLinks).toHaveBeenCalledWith(fileContent)
      expect(validateLinks).toHaveBeenCalledWith(linksArr)
      expect(linkStats).not.toHaveBeenCalled()
      expect(result).toEqual(fetchLinkObjResolved)
    })
  })

  it('should return statsObj when options validate is false and stats is true', () => {
    const filePath = '/path/to/file.md'
    const fileContent = '...'
    const linksArr = [{ href: 'https://example.com', text: 'Example' }]
    const statsObj = { total: 1, unique: 1 }

    mainReader.mockResolvedValue(fileContent)
    getLinks.mockReturnValue(linksArr)
    linkStats.mockResolvedValue(statsObj)

    const options = { validate: false, stats: true }

    return mdLinks(filePath, options).then(result => {
      expect(mainReader).toHaveBeenCalledWith(filePath)
      expect(getLinks).toHaveBeenCalledWith(fileContent)
      expect(validateLinks).toHaveBeenCalledTimes(1)
      expect(linkStats).toHaveBeenCalledWith(linksArr)
      expect(result).toEqual(statsObj)
    })
  })

  it('should return { links: fetchLinkObjResolved, stats: statsObj } when options validate and stats are true', () => {
    const filePath = '/path/to/file.md'
    const fileContent = '...'
    const linksArr = [{ href: 'https://example.com', text: 'Example' }]
    const fetchLinkObjResolved = [{ href: 'https://example.com', text: 'Example', status: 200 }]
    const statsObj = { total: 1, unique: 1 }

    mainReader.mockResolvedValue(fileContent)
    getLinks.mockReturnValue(linksArr)
    validateLinks.mockResolvedValue(fetchLinkObjResolved)
    linkStats.mockResolvedValue(statsObj)

    const options = { validate: true, stats: true }

    return mdLinks(filePath, options).then(result => {
      expect(mainReader).toHaveBeenCalledWith(filePath)
      expect(getLinks).toHaveBeenCalledWith(fileContent)
      expect(validateLinks).toHaveBeenCalledWith(linksArr)
      expect(linkStats).toHaveBeenCalledWith(fetchLinkObjResolved)
      expect(result).toEqual({ links: fetchLinkObjResolved, stats: statsObj })
    })
  })
})
