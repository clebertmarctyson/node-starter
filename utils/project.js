/**
 * @fileOverview A collection of functions for creating and configuring Node.js projects.
 * @module ProjectUtils
 */

import chalk from "chalk";
import { execSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { error, log } from "console";

import {
  configureEnvVariables,
  configureGit,
  configureJest,
  configureServer,
  configureTypeScript,
} from "./config.js";

/**
 * Create a new project.
 *
 * @param {string} name - The name of the project.
 * @param {string} manager - The package manager to use (e.g., npm, yarn, pnpm).
 * @returns {Promise<void>}
 */
export async function createProject(name, manager) {
  try {
    if (existsSync(name)) {
      throw new Error(`\nThe project ${name} already exists.\n`);
    }

    mkdirSync(name);

    process.chdir(name);

    execSync(
      manager === "npm" || manager === "yarn"
        ? `${manager} init -y`
        : `${manager} init`,
      {
        stdio: "ignore",
      }
    );

    if (!existsSync("./package.json")) {
      process.chdir("../");
      rmSync(name, { recursive: true, force: true });
      throw new Error(
        `\nAn error occurred while creating the project ${name}.\n`
      );
    }

    const packageJsonFile = JSON.parse(
      readFileSync("./package.json", {
        encoding: "utf-8",
      })
    );

    const updatedPackageJsonFile = {
      ...packageJsonFile,
      scripts: {
        ...packageJsonFile.scripts,
        test: "jest",
        start: "node index.js",
        dev: "nodemon index.js",
      },
    };

    writeFileSync(
      "./package.json",
      JSON.stringify(updatedPackageJsonFile, null, 2)
    );

    log(chalk.green(`\nThe project has been created successfully.`));
  } catch (err) {
    error(chalk.red(`\n${err.message}\n`));
    process.exit(1);
  }
}

/**
 * Configure the project.
 *
 * @param {string} installScript - The installation script based on the package manager.
 * @param {string} type - The type of project (e.g., JavaScript, TypeScript).
 * @returns {Promise<void>}
 */
export async function configureProject(installScript, type) {
  const ext = type === "TypeScript" ? "ts" : "js";

  log(chalk.blue("\nStarting project configuration.\n"));

  try {
    // Configure Jest
    configureJest(installScript, ext);
    log(chalk.blue("Jest configuration completed."));

    // Configure Environment Variables
    configureEnvVariables(installScript);
    log(chalk.blue("Environment variables configuration completed."));

    // Configure Git
    configureGit();
    log(chalk.blue("Git configuration completed."));

    // Configure Server
    configureServer(type, ext);
    log(chalk.blue("Server configuration completed."));

    // Configure TypeScript
    if (type === "TypeScript") {
      configureTypeScript(installScript);
      log(chalk.blue("TypeScript configuration completed."));
    }

    log(chalk.green("\nThe project has been configured successfully."));
  } catch (err) {
    error(chalk.red(`\n${err.message}\n`));
  }
}

/**
 * Create folders for the project.
 *
 * @param {string} folders - A space-separated string of folder names.
 * @returns {Promise<void>}
 */
export async function createFolders(folders) {
  if (folders) {
    const folderNames = folders.split(" ");

    log(chalk.blue(`\nStarting folder creation...\n`));

    folderNames.forEach((folder, index) => {
      if (!existsSync(folder)) {
        execSync(`mkdir ${folder}`);
        log(
          chalk.green(`Folder ${chalk.bold.blue(folder)} created successfully.`)
        );
      } else {
        log(chalk.yellow(`Folder ${chalk.bold.blue(folder)} already exists.`));
      }

      if (index === folderNames.length - 1) {
        log(chalk.green(`\nAll folders created successfully.`));
      }
    });
  }
}

/**
 * Create files for the project.
 *
 * @param {string} files - A space-separated string of file names.
 * @returns {Promise<void>}
 */
export async function createFiles(files) {
  if (files) {
    const fileNames = files.split(" ");

    log(chalk.blue(`\nStarting file creation...\n`));

    fileNames.forEach((file, index) => {
      if (!existsSync(file)) {
        execSync(`touch ${file}`);
        log(chalk.green(`File ${chalk.bold.blue(file)} created successfully.`));
      } else {
        log(chalk.yellow(`File ${chalk.bold.blue(file)} already exists.`));
      }

      if (index === fileNames.length - 1) {
        log(chalk.green(`\nAll files created successfully.`));
      }
    });
  }
}

/**
 * Install project dependencies.
 *
 * @param {string} dependencies - A space-separated string of dependencies.
 * @param {string} installScript - The installation script based on the package manager.
 * @returns {Promise<void>}
 */
export async function installDependencies(dependencies, installScript) {
  if (dependencies) {
    const deps = dependencies.split(" ");

    log(chalk.blue(`\nStarting dependency installation...\n`));

    for (const dep of deps) {
      try {
        const packageJsonFile = JSON.parse(
          readFileSync("./package.json", {
            encoding: "utf-8",
          })
        );

        if (
          (packageJsonFile.devDependencies &&
            packageJsonFile.devDependencies[dep]) ||
          (packageJsonFile.dependencies && packageJsonFile.dependencies[dep])
        ) {
          log(
            chalk.yellow(
              `Dependency ${chalk.bold.red(
                dep
              )} is already installed in the project.`
            )
          );
        } else {
          execSync(`${installScript} ${dep}`, {
            stdio: "ignore",
          });

          log(
            chalk.green(
              `Dependency ${chalk.bold.yellow(dep)} installed successfully.`
            )
          );
        }
      } catch (err) {
        log(chalk.yellow(`Failed to install ${chalk.bold.red(dep)}.`));
      }
    }

    log(chalk.green(`\nDependency installation completed.`));
  }
}

/**
 * Install project dev dependencies.
 *
 * @param {string} devDependencies - A space-separated string of dev dependencies.
 * @param {string} installScript - The installation script based on the package manager.
 * @returns {Promise<void>}
 */
export async function installDevDependencies(devDependencies, installScript) {
  if (devDependencies) {
    const devDeps = devDependencies.split(" ");

    log(chalk.blue(`\nStarting dev dependency installation...\n`));

    for (const devDep of devDeps) {
      try {
        const packageJsonFile = JSON.parse(
          readFileSync("./package.json", {
            encoding: "utf-8",
          })
        );

        if (
          (packageJsonFile.dependencies &&
            packageJsonFile.dependencies[devDep]) ||
          (packageJsonFile.devDependencies &&
            packageJsonFile.devDependencies[devDep])
        ) {
          log(
            chalk.yellow(
              `Dev dependency ${chalk.bold.red(
                devDep
              )} is already installed in the project.`
            )
          );
        } else {
          execSync(`${installScript} ${devDep} --save-dev`, {
            stdio: "ignore",
          });

          log(
            chalk.green(
              `Dev dependency ${chalk.bold.yellow(
                devDep
              )} installed successfully.`
            )
          );
        }
      } catch (err) {
        log(
          chalk.yellow(
            `Failed to install dev dependency ${chalk.bold.red(devDep)}.`
          )
        );
      }
    }

    log(chalk.green(`\nDev dependency installation completed.`));
  }
}
