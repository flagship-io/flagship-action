import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as fs from 'fs'
import * as https from 'https'
import * as path from 'path'
import { homedir } from 'os'
import { Cli, CliVersion } from './cliCommand'
import { CliDownloader } from './cliDownloader'
import { CREATE_CONFIGURATION } from './const'
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
  console.log(createConfiguration)
  if (createConfiguration) {
    console.log('enter')
    commandRequests = {
      ...commandRequests,
      [CREATE_CONFIGURATION]: createConfiguration
    }
  }

  return commandRequests
}

const buildCommands = (
  commandRequests: { [s: string]: unknown } | ArrayLike<unknown>
) => {
  var cliRequests: CliRequest[] = []
  for (const [key, value] of Object.entries(commandRequests)) {
    const splitted = key.split('-')
    cliRequests.push({
      method: splitted[0],
      resource: splitted[1],
      flags: value
    } as CliRequest)
  }
  return cliRequests
}

export async function run(): Promise<void> {
  try {
    const flagshipDir = 'flagship'
    const binaryDir = `${flagshipDir}/${CliVersion}`
    const internalFlagshipDir = '/home/runner/.flagship'
    const internalConfigutations = `${internalFlagshipDir}/configurations`

    if (!fs.existsSync(binaryDir)) {
      //await CliDownloader(binaryDir)
    }

    //const cli = new Cli()

    /*     if (core.getInput('create-configuration')) {
      const commandResponse = await cli.Resource(
        core.getInput('resource'),
        core.getInput('method'),
        core.getInput('flags')
      )
      core.setOutput('COMMAND_RESPONSE', commandResponse)
    } */
    const commandRequests = buildInputs()
    const cliRequests = buildCommands(commandRequests)

    console.log(cliRequests)
    core.setOutput('COMMAND_RESPONSE', cliRequests)
  } catch (err) {
    console.log('error')
  }
}
