import { RestapifyParams } from 'restapify'

import { runServer } from '../utils'

export const startServer = (options: RestapifyParams): void => {
  runServer(options)
}
