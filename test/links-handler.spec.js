const { getLinks, validateLinks, linkStats } = require('../src/links-handler.js')

describe('getLinks', () => {
  it('should extract links from files', () => {
    const files = [
      { file: 'file1.md', data: '[Example 1](https://example.com)' },
      { file: 'file2.md', data: '[Example 2](https://example.com)' }
    ]

    const expectedLinks = [
      { file: 'file1.md', text: 'Example 1', href: 'https://example.com' },
      { file: 'file2.md', text: 'Example 2', href: 'https://example.com' }
    ]

    const result = getLinks(files)

    expect(result).toEqual(expectedLinks)
  })
})

describe('validateLinks', () => {
  it('should validate links and return fetchLinkObjResolved', async () => {
    const linksArr = [
      { file: 'file1.md', text: 'Example 1', href: 'https://example.com' },
      { file: 'file2.md', text: 'Example 2', href: 'https://example.com' }
    ]

    const fetchResponse = { status: 200, ok: true }
    const fetchMock = jest.fn().mockResolvedValue(fetchResponse)
    global.fetch = fetchMock

    const expectedFetchLinkObjResolved = [
      { file: 'file1.md', text: 'Example 1', href: 'https://example.com', status: 200, ok: true },
      { file: 'file2.md', text: 'Example 2', href: 'https://example.com', status: 200, ok: true }
    ]

    const result = await validateLinks(linksArr)

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledWith('https://example.com')
    expect(result).toEqual(expectedFetchLinkObjResolved)
  })

  it('should handle invalid fetch responses and return fetchLinkObjResolved with status and ok fields', async () => {
    const linksArr = [
      { file: 'file1.md', text: 'Example 1', href: 'https://example.com' },
      { file: 'file2.md', text: 'Example 2', href: 'https://example.com' }
    ]

    const fetchError = new Error('Invalid fetch response')
    const fetchMock = jest.fn().mockRejectedValue(fetchError)
    global.fetch = fetchMock

    const expectedFetchLinkObjResolved = [
      { file: 'file1.md', text: 'Example 1', href: 'https://example.com', status: fetchError.message, ok: false },
      { file: 'file2.md', text: 'Example 2', href: 'https://example.com', status: fetchError.message, ok: false }
    ]

    const result = await validateLinks(linksArr)

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenCalledWith('https://example.com')
    expect(result).toEqual(expectedFetchLinkObjResolved)
  })
})

describe('linkStats', () => {
  it('should calculate link statistics', async () => {
    const linksArr = [
      { file: 'file1.md', text: 'Example 1', href: 'https://example.com', status: 200, ok: true },
      { file: 'file2.md', text: 'Example 2', href: 'https://example.com', status: 404, ok: false },
      { file: 'file3.md', text: 'Example 3', href: 'https://example.com', status: 200, ok: true }
    ]

    const expectedStats = {
      total: 3,
      unique: 1,
      broken: 1
    }

    const result = await linkStats(linksArr)

    expect(result).toEqual({ links: linksArr, stats: expectedStats })
  })

  it('should handle empty linksArr and return statistics with zeros', async () => {
    const linksArr = []

    const expectedStats = {
      total: 0,
      unique: 0,
      broken: 0
    }

    const result = await linkStats(linksArr)

    expect(result).toEqual({ links: linksArr, stats: expectedStats })
  })
})