import * as path from 'path'
import * as chalk from 'chalk'

import Restapify, { RestapifyParams } from 'restapify'

import { getInstanceOverviewOutput, getRoutesListOutput, onRestapifyInstanceError } from './utils'

export const startServer = (options: RestapifyParams): void => {
  const {
    rootDir,
    port,
    baseUrl,
    openDashboard
  } = options

  const RestapifyInstance = new Restapify({
    rootDir: path.resolve(rootDir),
    port: port,
    baseUrl: baseUrl,
    openDashboard: openDashboard
  })
  RestapifyInstance.on('server:start', () => {
    console.log(`\n🏗 Try to serve on port ${RestapifyInstance.port}`)
  })

  RestapifyInstance.onError(({ error }) => {
    onRestapifyInstanceError(error, {
      rootDir: RestapifyInstance.rootDir,
      apiBaseUrl: RestapifyInstance.apiBaseUrl,
      port: RestapifyInstance.port
    })
  })

  RestapifyInstance.on('start', () => {
    const servedRoutesOutput = getRoutesListOutput(RestapifyInstance.getServedRoutes())

    console.log(servedRoutesOutput)
    console.log(getInstanceOverviewOutput(
      RestapifyInstance.port,
      RestapifyInstance.apiBaseUrl
    ))
  })

  RestapifyInstance.on('server:restart', () => {
    console.log(chalk.green('✅ API updated!'))
  })

  RestapifyInstance.run()
}
