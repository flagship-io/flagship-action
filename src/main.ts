import * as core from '@actions/core'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('resource')
    const ms1: string = core.getInput('method')
    const ms2: string = core.getInput('flags')

    const o: string = `Hello ${ms} ${ms1} ${ms2}`
    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(o)

    // Log the current timestamp, wait, then log the new timestamp

    // Set outputs for other workflow steps to use
    core.setOutput('result', o)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
