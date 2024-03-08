import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as fs from 'fs'
import * as https from 'https'
import * as path from 'path'
import { homedir } from 'os'
import { Cli, CliVersion } from './cliCommand'
import { CliDownloader } from './cliDownloader'
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */

type CliRequest = {
  method: string
  resource: string
  flags: string
}

const commandResponses: never[] = []
var commandRequests = {}
var cliRequests: CliRequest[] = []

const buildInputs = () => {
  const createConfiguration = core.getInput('create-configuration')
  if (createConfiguration) {
    commandRequests = { ...commandRequests, createConfiguration }
  }
}

const buildCommands = (
  commandRequests: { [s: string]: unknown } | ArrayLike<unknown>
) => {
  for (const [key, value] of Object.entries(commandRequests)) {
    cliRequests.push({
      method: key[0],
      resource: key[1].toLowerCase(),
      flags: value
    } as CliRequest)
  }
}

export async function run(): Promise<void> {
  try {
    const flagshipDir = 'flagship'
    const binaryDir = `${flagshipDir}/${CliVersion}`
    const internalFlagshipDir = '/home/runner/.flagship'
    const internalConfigutations = `${internalFlagshipDir}/configurations`

    if (!fs.existsSync(internalFlagshipDir)) {
      fs.mkdirSync(internalFlagshipDir)
    }

    fs.chmodSync(`${internalFlagshipDir}`, '777')

    if (!fs.existsSync(internalConfigutations)) {
      fs.mkdirSync(internalConfigutations)
    }

    fs.chmodSync(`${internalConfigutations}`, '777')

    if (!fs.existsSync(binaryDir)) {
      await CliDownloader(binaryDir)
    }

    const cli = new Cli()

    /*     if (core.getInput('create-configuration')) {
      const commandResponse = await cli.Resource(
        core.getInput('resource'),
        core.getInput('method'),
        core.getInput('flags')
      )
      core.setOutput('COMMAND_RESPONSE', commandResponse)
    } */
    buildInputs()
    buildCommands(commandResponses)

    console.log('Hi')
    console.log(cliRequests)
  } catch (err) {}
}
