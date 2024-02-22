import * as core from '@actions/core'
import * as github from '@actions/github'
import { exec, ExecOptions } from 'child_process'
import { join } from 'path'
import { homedir } from 'os'
import * as fs from 'fs'
import { setError } from './error'

export const CliVersion = '1.0' // 'v' in v0.7.3 is added in download url
export const actionVersion = '0.0.1'

export class Cli {
  exec(
    command: string,
    options: ExecOptions
  ): Promise<{ stdout: string; stderr: string }> {
    return new Promise<{ stdout: string; stderr: string }>(
      (resolve, reject) => {
        exec(
          command + ' --user-agent=flagship-ext-action/v' + actionVersion,
          options,
          (error, stdout, stderr) => {
            if (error) {
              reject({ error, stdout, stderr })
            }
            resolve({ stdout, stderr })
          }
        )
      }
    )
  }

  async CliBin(): Promise<string> {
    try {
      const flagshipDir = 'flagship'
      const flagshipDirWindows = '\\flagship'

      if (process.platform.toString() === 'win32') {
        return `${flagshipDirWindows}\\${CliVersion}\\flagship.exe`
      }
      if (process.platform.toString() === 'darwin') {
        return `${flagshipDir}/${CliVersion}/flagship`
      }
      await fs.promises.access(join(flagshipDir, `${CliVersion}/flagship`))
      return `${flagshipDir}/${CliVersion}/flagship`
    } catch (err: any) {
      setError(`Error: ${err}`, false)
      return err.error
    }
  }

  async Resource(flags?: string): Promise<string> {
    try {
      const cliBin = await this.CliBin()
      if (!cliBin) {
        return ''
      }
      const command = `${cliBin} ${core.getInput('resource')} ${core.getInput('method')} ${flags?.replaceAll(',', ' ')}`
      const output = await this.exec(command, {})
      if (output.stderr) {
        return ''
      }
      return output.stdout
    } catch (err: any) {
      return err.toString()
    }
  }

  async Version(): Promise<string> {
    try {
      const cliBin = await this.CliBin()
      if (!cliBin) {
        setError(`Error: binary not found`, false)
      }
      const command = `${cliBin} version`
      const output = await this.exec(command, {})
      if (output.stderr) {
        setError(`Error: ${output.stderr}`, false)
      }
      return output.stdout
    } catch (err: any) {
      setError(`Error: ${err}`, false)
      return ''
    }
  }
}
