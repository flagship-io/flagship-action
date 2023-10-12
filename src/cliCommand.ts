import * as core from '@actions/core';
import * as github from '@actions/github';
import { exec, ExecOptions } from 'child_process';
import { join } from 'path';
import { homedir } from 'os'
import * as fs from 'fs';

export const CliVersion = '0.7.3'; // 'v' in v0.7.3 is added in download url
export const actionVersion = '0.0.1'

export class Cli {
    
    exec(command: string, options: ExecOptions): Promise<{ stdout: string; stderr: string }> {
        return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
          exec(command + ' --user-agent=flagship-ext-action/v' + actionVersion, options, (error, stdout, stderr) => {
            if (error) {
              reject({ error, stdout, stderr });
            }
            resolve({ stdout, stderr });
          });
        });
      }
    
      async CliBin(): Promise<string> {
        try {
        const flagshipDirWindows = homedir() + "/flagship";
        const flagshipDir = homedir() + "\\flagship";

          if (process.platform.toString() === 'win32') {
            return `${flagshipDirWindows}\\${CliVersion}\\flagship.exe`;
          }
          if (process.platform.toString() === 'darwin') {
            return `${flagshipDir}/${CliVersion}/flagship`;
          }
          await fs.promises.access(join(flagshipDir, `${CliVersion}/flagship`));
          return `${flagshipDir}/${CliVersion}/flagship`;
        } catch (err: any) {
          console.error(err);
          return err.error;
        }
      }

      async Resource(): Promise<string> {
        try {
          const cliBin = await this.CliBin();
          if (!cliBin) {
            return '';
          }
          const command = `${cliBin} ${core.getInput("resource")} ${core.getInput("method")}`;
          const output = await this.exec(command, {});
          if (output.stderr) {
            return '';
          }
          return output.stdout;
        } catch (err: any) {
            return err.toString()
        }
      }

      async Version(): Promise<string> {
        try {
          const cliBin = await this.CliBin();
          if (!cliBin) {
            return '';
          }
          const command = `${cliBin} version`;
          const output = await this.exec(command, {});
          if (output.stderr) {
            return '';
          }
          return output.stdout;
        } catch (err: any) {
            return err.toString()
        }
      }
}