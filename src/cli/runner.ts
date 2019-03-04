import { transformSync, TransformOptions } from '@babel/core';
import chalk from 'chalk';
import fs from 'fs';
import glob from 'glob';
import path from 'path';

import { printError } from '../util/print';
import { Stats, sortNumberMap } from '../util/stats';
import overflowPlugin, { OverflowOptions } from '../plugin';

export interface RunnerArgs {
  dryRun?: boolean;
  globPattern: string;
  verbose?: boolean;
  stats?: boolean;
  src: string[];
}

function getGlobOptions(options: object): object {
  const defaults = {
    absolute: true,
    ignore: 'node_modules/**',
    strict: true,
  };

  return Object.assign(defaults, options);
}

/**
 * Create the Babel configuration for the runner
 * @param options Plugin options for Overflow
 */
function getTransformOptions(options: OverflowOptions): TransformOptions {
  return {
    configFile: false,
    plugins: [[overflowPlugin, options]],
    retainLines: true,
  };
}

function transpileFiles(args: RunnerArgs): void {
  const { globPattern, src, verbose } = args;

  const babelOptions = getTransformOptions({ verbose });

  src.forEach(src => {
    const isDir = fs.statSync(src).isDirectory();
    const globOptions = getGlobOptions({ cwd: src });

    // Create a list of to be transpiled files
    const fileList = isDir ? glob.sync(globPattern, globOptions) : [path.resolve(src)];

    fileList.forEach(filePath => {
      console.log(chalk.magenta(`Transpiling ${filePath}...`));

      const src = fs.readFileSync(filePath).toString();
      const out = transformSync(src, babelOptions);

      if (out === null) {
        printError(`Unable to transpile ${filePath}`);
      }
    });

    console.log(sortNumberMap(Stats.typeCounter.getCount()));
    console.log();
  });
}

export function run(args: RunnerArgs): void {
  transpileFiles(args);
}
