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
    const binaryDir = `flagship/0.7.3`;
    fs.access(binaryDir, fs.constants.F_OK, async (err) => {
      if (err) {
        await CliDownloader(binaryDir);
      }
      
      const cli = new Cli();
      console.log(await cli.CliBin())
      const version = await cli.Version()
      const version1 = cli.Version()
      console.log(version)
      console.log(version1)
          
      core.setOutput("result", version)
    });

        
  } catch (err) {
    
  }
}
