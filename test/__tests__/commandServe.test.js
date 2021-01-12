import * as path from 'path'

import Restapify from 'restapify'
import { cli } from '../../src/cli'

const runSpy = jest.fn()
const onSpy = jest.fn()
const onErrorSpy = jest.fn()
jest.mock('restapify')
Restapify.mockImplementation(() => {
  return {
    run: runSpy,
    on: onSpy,
    onError: onErrorSpy
  }
})

const pathToApiFolder = path.resolve(__dirname, '../api')

describe('Test `serve` command', () => {
  beforeEach(() => {
    Restapify.mockClear();
  })

  it('should init Restapify\'s instance with default options', () => {
    const expectedOptionsInConstuctor = {
      rootDir: pathToApiFolder,
      openDashboard: true, 
      baseUrl: undefined, 
      port: undefined
    }
    const args = `yarn restapify serve ${pathToApiFolder}`
    cli(args.split(' '))

    expect(Restapify.mock.calls.length).toBe(1)
    expect(Restapify.mock.calls[0][0]).toStrictEqual(expectedOptionsInConstuctor)
  })
})
