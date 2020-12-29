import Restapify from 'restapify'

import { getRoutesListOutput, onRestapifyInstanceError } from './utils'

export const listRoutes = (rootDir: string): void => {
  const RestapifyInstance = new Restapify({
    rootDir,
    openDashboard: false
  })

  RestapifyInstance.onError(({ error }) => {
    onRestapifyInstanceError(error, {
      rootDir: RestapifyInstance.rootDir,
      apiBaseUrl: RestapifyInstance.apiBaseUrl,
      port: RestapifyInstance.port
    })
  })

  RestapifyInstance.on('start', () => {
    const servedRoutesOutput = getRoutesListOutput(
      RestapifyInstance.getServedRoutes(),
      RestapifyInstance.apiBaseUrl
    )

    console.log(servedRoutesOutput)

    RestapifyInstance.close()
    process.exit(0)
  })

  RestapifyInstance.run({ startServer: false })
}
