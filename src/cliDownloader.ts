import * as fs from 'fs';
import * as tar from 'tar-fs';
import axios from 'axios';
import { rimraf } from 'rimraf';
import { createGunzip } from 'zlib';
import { homedir } from 'os'
import { CliVersion } from './cliCommand';

export async function CliDownloader(binaryDir: string) {
  const flagshipDir = homedir() + "/flagship";
  const cliTar = homedir() + `/flagship/flagship-${CliVersion}.tar.gz`;

  async function installDir(): Promise<void> {
    let platform = process.platform.toString();
    let cliUrl: string;
    let arch: string;
    const file = fs.createWriteStream(cliTar);
    const unzip = createGunzip();

    if (!fs.existsSync(flagshipDir)) {
      fs.mkdirSync(flagshipDir);
    }
    if (!fs.existsSync(binaryDir)) {
      fs.mkdirSync(binaryDir);
    }

    if (platform === 'win32') {
      platform = 'windows';
    }

    switch (process.arch) {
      case 'x64':
        arch = 'amd64';
        break;
      case 'ia32':
        arch = '386';
        break;
      default:
        arch = process.arch;
    }

    if (platform === 'darwin') {
      cliUrl = `https://github.com/flagship-io/flagship/releases/download/v${CliVersion}/flagship_${CliVersion}_darwin_all.tar.gz`;
    } else {
      cliUrl = `https://github.com/flagship-io/flagship/releases/download/v${CliVersion}/flagship_${CliVersion}_${platform}_${arch}.tar.gz`;
    }

    try {
      const archivedCLI = await axios.get(cliUrl, {
        responseType: 'arraybuffer',
        method: 'GET',
        headers: {
          'Content-Type': 'application/gzip',
        },
      });
      file.write(archivedCLI.data);
      file.end();
    } catch (err) {
      console.error(err);
    }
    try {
      file.on('finish', () => {
        fs.createReadStream(cliTar).pipe(unzip).pipe(tar.extract(binaryDir));
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function download(): Promise<void> {
    try {
      await rimraf(`${flagshipDir}/*`);
    } catch (err) {
      console.error(err);
    }
    await installDir();
  }

  await download();
}

