

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Absolute path to the Python script
const pythonScriptPath = join(__dirname, '..', 'modelWrapper', 'model.py');

// Absolute path to Python inside your conda environment
// const pythonExePath = 'C:\\Users\\munna\\miniconda3\\envs\\myenv\\python.exe';
const pythonExePath = 'python3'; // or just 'python' if Render has only one version

export function runPythonScript(inputData) {
  return new Promise((resolve, reject) => {
    const inputStr = JSON.stringify(inputData);

    const process = spawn(pythonExePath, [pythonScriptPath, inputStr]);

    let output = '';
    let error = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      error += data.toString();
    });

    process.on('close', (code) => {
      console.log("Python stdout:", output);
      console.log("Python stderr:", error);

      if (code !== 0) {
        reject(`Python script failed with error: ${error}`);
      } else {
        try {
          // Extract the last line assuming it's the JSON output
          const lines = output.trim().split('\n');
          const lastLine = lines[lines.length - 1];

          const jsonOutput = JSON.parse(lastLine);
          resolve(jsonOutput);
        } catch (err) {
          reject("Error parsing Python output: " + output);
        }
      }
    });
  });
}
