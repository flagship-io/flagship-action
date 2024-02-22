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

    if (!fs.existsSync(binaryDir)) {
      await CliDownloader(binaryDir)
    }

    const cli = new Cli()
    const result = await cli.Resource(core.getInput('flags'))
    core.setOutput('result', result)
  } catch (err) {}
}
