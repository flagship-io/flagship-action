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
    const commandResponse = await cli.Resource(
      core.getInput('resource'),
      core.getInput('method'),
      core.getInput('flags')
    )

    /*     const commandResponse = await cli.Resource(
      'configuration',
      'create',
      '-n,config-name,-i,ciAction,-s,csAction,-a,aAction,-e,eAction'
    ) */
    console.log(commandResponse)
    core.setOutput('COMMAND_RESPONSE', commandResponse)
  } catch (err) {}
}
