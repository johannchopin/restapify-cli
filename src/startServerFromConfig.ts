import * as fs from 'fs'
import * as path from 'path'

import { runServer } from './utils'

export const startServerFromConfig = (configFilePath: string): void => {
  // TODO: Test that file exist
  const configFileContent = fs.readFileSync(configFilePath, 'utf8')

  // TODO: Test that config is valid
  const config = JSON.parse(configFileContent)

  runServer({
    ...config,
    rootDir: path.join(path.dirname(configFilePath), config.rootDir)
  })
}
