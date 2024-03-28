import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as fs from 'fs'
import * as https from 'https'
import * as path from 'path'
import { homedir } from 'os'
import { Cli, CliVersion } from './cliCommand'
import { CliDownloader } from './cliDownloader'
import {
  CREATE_CONFIGURATION,
  DELETE_CONFIGURATION,
  EDIT_CONFIGURATION,
  LIST_FLAG,
  USE_CONFIGURATION
} from './const'
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */

type CliRequest = {
  method: string
  resource: string
  flags: string
}

const buildInputs = () => {
  var commandRequests = {}
  const createConfiguration = core.getMultilineInput(CREATE_CONFIGURATION)
  if (core.getInput(CREATE_CONFIGURATION)) {
    commandRequests = {
      ...commandRequests,
      [CREATE_CONFIGURATION]: createConfiguration
    }
  }

  const editConfiguration = core.getMultilineInput(EDIT_CONFIGURATION)
  if (core.getInput(EDIT_CONFIGURATION)) {
    commandRequests = {
      ...commandRequests,
      [EDIT_CONFIGURATION]: editConfiguration
    }
  }

  const deleteConfiguration = core.getMultilineInput(DELETE_CONFIGURATION)
  if (core.getInput(DELETE_CONFIGURATION)) {
    commandRequests = {
      ...commandRequests,
      [DELETE_CONFIGURATION]: deleteConfiguration
    }
  }

  const useConfiguration = core.getMultilineInput(USE_CONFIGURATION)
  if (core.getInput(USE_CONFIGURATION)) {
    commandRequests = {
      ...commandRequests,
      [USE_CONFIGURATION]: useConfiguration
    }
  }

  const listFlag = core.getMultilineInput(LIST_FLAG)
  if (core.getInput(LIST_FLAG)) {
    commandRequests = {
      ...commandRequests,
      [LIST_FLAG]: listFlag
    }
  }

  return commandRequests
}

const buildCommands = (
  commandRequests: { [s: string]: any } | ArrayLike<any>
) => {
  var cliRequests: CliRequest[] = []
  for (const [key, value] of Object.entries(commandRequests)) {
    var args: string = ''
    value?.map((f: string) => {
      var f_ = f.replaceAll(' ', '').split(':')
      args =
        f_.length > 1
          ? args.concat(`--${f_[0]}=${f_[1]} `)
          : args.concat(`--${f_[0]} `)
    })

    const splitted = key.split('-')
    cliRequests.push({
      method: splitted[0],
      resource: splitted[1],
      flags: args
    } as CliRequest)
  }
  return cliRequests
}

export async function run(): Promise<void> {
  try {
    const flagshipDir = 'flagship'
    const binaryDir = `${flagshipDir}/${CliVersion}`
    const internalFlagshipDir = '/home/runner/.flagship'
    //const internalFlagshipDir = '.flagship'

    const internalConfigutations = `${internalFlagshipDir}/configurations`
    var cliResponse: string[] = []

    if (!fs.existsSync(internalFlagshipDir)) {
      fs.mkdirSync(internalFlagshipDir)
    }

    fs.chmodSync(`${internalFlagshipDir}`, '777')

    if (!fs.existsSync(internalConfigutations)) {
      fs.mkdirSync(internalConfigutations)
    }

    fs.chmodSync(`${internalConfigutations}`, '777')

    if (!fs.existsSync(binaryDir)) {
      console.log('download')
      await CliDownloader(binaryDir)
    }

    const cli = new Cli()

    const commandRequests = buildInputs()
    const cliRequests = buildCommands(commandRequests)

    cliRequests.map(async r => {
      const resp = await cli.Resource(r.resource, r.method, r.flags)
      console.log(resp)
      cliResponse.push(resp)
    })
    core.setOutput('COMMAND_RESPONSE', cliResponse)
  } catch (err) {
    console.log(err)
  }
}
