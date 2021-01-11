import * as chalk from 'chalk'
import * as boxen from 'boxen'
import { Validator, ValidatorResult } from 'jsonschema'

import Restapify, { RestapifyParams, HttpVerb, RestapifyErrorName } from 'restapify'

export const getMethodOutput = (method: HttpVerb): string => {
  let methodOutput

  switch (method) {
  case 'DELETE':
    methodOutput = chalk.red
    break
  case 'POST':
    methodOutput = chalk.yellow
    break
  case 'PUT':
    methodOutput = chalk.blue
    break
  case 'PATCH':
    methodOutput = chalk.gray
    break

  default: case 'GET':
    methodOutput = chalk.green
    break
  }

  let methodName = method
  let methodNameLength = method.length

  for (let index = 0; index < (6 - methodNameLength); index += 1) {
    methodName += ' '
  }

  methodOutput = methodOutput.bold(`${methodName}`)

  return methodOutput
}

export const consoleError = (message: string): void => {
  const errorPrepend = chalk.red.bold.underline('❌ERROR:')
  console.log(`${errorPrepend} ${message}`)
}

export const getInstanceOverviewOutput = (port: number, apiBaseURL: string): string => {
  const runningTitle = chalk.magenta('🚀 Restapify is running:')
  const apiBaseURLTitle = chalk.bold('- 📦API base url:')
  const apiBaseURLLink = chalk.blueBright(`http://localhost:${port}${apiBaseURL}`)
  const dashboardURLTitle = chalk.bold('- 🎛 Dashboard:')
  const dashboardURLLink = chalk.blueBright(`http://localhost:${port}/restapify`)
  const apiBaseURLOutput = `${apiBaseURLTitle} ${apiBaseURLLink}`
  const dashboardURLOutput = `${dashboardURLTitle} ${dashboardURLLink}`
  return boxen(`${runningTitle}\n\n${apiBaseURLOutput}\n${dashboardURLOutput} `, { padding: 1, borderColor: 'magenta' })
}

export const onRestapifyInstanceError = (
  error: RestapifyErrorName,
  instanceData: Pick<Restapify, 'apiBaseUrl' | 'port' | 'rootDir'>
): void => {
  const { rootDir, port, apiBaseUrl } = instanceData

  if (error.startsWith('MISS:ROOT_DIR')) {
    consoleError(`The given folder ${rootDir} doesn't exist!`)
  } else if (error.startsWith('MISS:PORT')) {
    consoleError(`port ${port} is already in use!`)
  } else if (error.startsWith('INV:API_BASEURL')) {
    consoleError(`Impossible to use ${apiBaseUrl} as the API base URL since it's already needed for internal purposes!`)
  } else if (error.startsWith('INV:JSON_FILE')) {
    const filePath = error.split(' ')[1]
    consoleError(`Impossible to parse the JSON file ${filePath}!`)
  }
}

export const getRoutesListOutput = (
  routesList: { route: string; method: HttpVerb; }[],
  apiBaseUrl: string
): string => {
  let output = ''

  routesList.forEach(servedRoute => {
    let methodOutput = getMethodOutput(servedRoute.method)

    output += `\n${methodOutput} ${apiBaseUrl}${servedRoute.route}`
  })

  return output
}

export const runServer = (config: RestapifyParams): void => {
  const RestapifyInstance = new Restapify(config)

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
    const servedRoutesOutput = getRoutesListOutput(
      RestapifyInstance.getServedRoutes(),
      RestapifyInstance.apiBaseUrl
    )

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

export const validateConfig = (config: object): ValidatorResult => {
  const jsonValidor = new Validator()
  const CONFIG_FILE_SCHEMA = {
    type: 'object',
    rootDir: { type: 'string' },
    apiBaseUrl: { type: 'string' },
    port: { type: 'number' },
    states: {
      properties: {
        route: 'string',
        method: 'string',
        state: 'string'
      },
      required: ['route', 'method', 'state']
    },
    required: ['rootDir']
  }

  return jsonValidor.validate(config, CONFIG_FILE_SCHEMA)
}
