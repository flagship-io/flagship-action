import * as core from '@actions/core'
import * as exec from '@actions/exec';
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import { homedir } from 'os'
import { Cli, CliVersion } from './cliCommand';
import { CliDownloader } from './cliDownloader';
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const flagshipDir = homedir() + "/flagship";
    const binaryDir = `${flagshipDir}/${CliVersion}`;

    fs.access(binaryDir, fs.constants.F_OK, async (err) => {
      if (err) {
        await CliDownloader(binaryDir);
        return;
      }
    });

    const cli = new Cli()
    const version = cli.Version()

    core.setOutput("result", version)

    
  } catch (err) {
    
  }
}
