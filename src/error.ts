import * as core from '@actions/core';


export const setError = (message: string, failCi: boolean): void => {
    failCi ? core.setFailed(message) : core.warning(message);
    if (failCi) {
      process.exit();
    }
};