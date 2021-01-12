import * as path from 'path'

import Restapify from 'restapify'
import { cli } from '../../src/cli'

import config from '../restapify.config.json'

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
const pathToConfigFile = path.resolve(__dirname, '../restapify.config.json')

describe('Test `restapify` command', () => {
  beforeEach(() => {
    Restapify.mockClear();
  })

  it('should init Restapify\'s instance with options in config files', () => {
    const expectedOptionsInConstuctor = {
      ...config,
      rootDir: pathToApiFolder
    }
    const args = `yarn restapify ${pathToConfigFile}`
    cli(args.split(' '))

    expect(Restapify.mock.calls.length).toBe(1)
    expect(Restapify.mock.calls[0][0]).toStrictEqual(expectedOptionsInConstuctor)
  })
})
