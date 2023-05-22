const fs = require('fs')

const { mainReader } = require('../src/fs-reader.js')

jest.mock('fs', () => ({
  promises: {
    stat: jest.fn(),
    readdir: jest.fn(),
    readFile: jest.fn()
  }
}))

fs.promises.readdir.mockResolvedValue(['file1.md', 'file2.txt', 'dir1'])
fs.promises.readFile.mockResolvedValue('Mocked file data')

describe('mainReader', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should read a directory and its .md files', () => {
    fs.promises.stat.mockResolvedValueOnce({ isDirectory: () => true })

    return mainReader('/path/to/dir').then((result) => {
      expect(fs.promises.stat).toHaveBeenCalledWith('/path/to/dir')
      expect(fs.promises.readdir).toHaveBeenCalledWith('/path/to/dir')
      expect(fs.promises.readFile).toHaveBeenCalledTimes(1)

      expect(result).toEqual([{ file: expect.stringContaining('file1.md'), data: 'Mocked file data' }])
    })
  })

  it('should read an empty directory', () => {
    fs.promises.stat.mockResolvedValueOnce({ isDirectory: () => true })
    fs.promises.readdir.mockResolvedValueOnce(['dir1'])

    return mainReader('/path/to/empty-dir').then((result) => {
      expect(fs.promises.stat).toHaveBeenCalledWith('/path/to/empty-dir')
      expect(fs.promises.readdir).toHaveBeenCalledWith('/path/to/empty-dir')

      expect(result).toEqual([])
    })
  })

  it('should read a single file', () => {
    fs.promises.stat.mockResolvedValueOnce({ isDirectory: () => false })

    return mainReader('/path/to/file.md').then((result) => {
      expect(fs.promises.stat).toHaveBeenCalledWith('/path/to/file.md')
      expect(fs.promises.readdir).not.toHaveBeenCalled()

      expect(result).toEqual([{ file: '/path/to/file.md', data: 'Mocked file data' }])
    })
  })

  it('deve ler um arquivo individual', () => {
    fs.promises.stat.mockResolvedValueOnce({ isDirectory: () => false })

    return expect(mainReader('/path/to/file.txt')).rejects.toThrow('file is not .md')
  })
})
