const { mdLinks } = require('../src/md-links.js')
const { getLinks, validateLinks, linkStats } = require('../src/links-handler.js')
const { mainReader } = require('../src/fs-reader.js')

jest.mock('../src/links-handler.js') // Mockando as funções de links-handler
jest.mock('../src/fs-reader.js') // Mockando a função de fs-reader

describe('mdLinks', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return just a list of links when options validate and stats are false', () => {
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

  it('should return a list of validated links when options validate is true and stats is false', () => {
    const filePath = '/path/to/file.md'
    const fileContent = '...'
    const linksArr = [{ href: 'https://example.com', text: 'Example' }]
    const validatedLinksArr = [{ href: 'https://example.com', text: 'Example', status: 200 }]

    mainReader.mockResolvedValue(fileContent)
    getLinks.mockReturnValue(linksArr)
    validateLinks.mockResolvedValue(validatedLinksArr)

    const options = { validate: true, stats: false }

    return mdLinks(filePath, options).then(result => {
      expect(mainReader).toHaveBeenCalledWith(filePath)
      expect(getLinks).toHaveBeenCalledWith(fileContent)
      expect(validateLinks).toHaveBeenCalledWith(linksArr)
      expect(linkStats).not.toHaveBeenCalled()
      expect(result).toEqual(validatedLinksArr)
    })
  })

  it('should return statistics when options validate is false and stats is true', () => {
    const filePath = '/path/to/file.md'
    const fileContent = '...'
    const linksArr = [{ href: 'https://example.com', text: 'Example' }]
    const validatedLinksArr = [{ href: 'https://example.com', text: 'Example', ok: true, status: 200 }]
    const statsObj = { total: 1, unique: 1 }

    mainReader.mockResolvedValue(fileContent)
    getLinks.mockReturnValue(linksArr)
    validateLinks.mockResolvedValue(validatedLinksArr)
    linkStats.mockResolvedValue(statsObj)

    const options = { validate: false, stats: true }

    return mdLinks(filePath, options).then(result => {
      expect(mainReader).toHaveBeenCalledWith(filePath)
      expect(getLinks).toHaveBeenCalledWith(fileContent)
      expect(validateLinks).toHaveBeenCalledTimes(1)
      expect(linkStats).toHaveBeenCalledWith(validatedLinksArr)
      expect(result).toEqual(statsObj)
    })
  })

  it('should return links and statistics when options validate and stats are true', () => {
    const filePath = '/path/to/file.md'
    const fileContent = '...'
    const linksArr = [{ href: 'https://example.com', text: 'Example' }]
    const validatedLinksArr = [{ href: 'https://example.com', text: 'Example', ok: true, status: 200 }]
    const statsObj = { links: linksArr, stats: { total: 1, unique: 1 } }

    mainReader.mockResolvedValue(fileContent)
    getLinks.mockReturnValue(linksArr)
    validateLinks.mockResolvedValue(validatedLinksArr)
    linkStats.mockResolvedValue(statsObj)

    const options = { validate: true, stats: true }

    return mdLinks(filePath, options).then(result => {
      expect(mainReader).toHaveBeenCalledWith(filePath)
      expect(getLinks).toHaveBeenCalledWith(fileContent)
      expect(validateLinks).toHaveBeenCalledWith(linksArr)
      expect(linkStats).toHaveBeenCalledWith(validatedLinksArr)
      expect(result).toEqual(statsObj)
    })
  })
})
