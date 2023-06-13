#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import { createSpinner } from "nanospinner";
import inquirer from "inquirer";
import { formatContent, sleep } from "./utils/utils.js";
import { execSync } from "child_process";
import { mkdirSync, writeFileSync } from "fs";

const questions = [
  {
    type: "input",
    name: "projectName",
    message: "Enter the name of your project:",
    validate: (input) => {
      if (input.trim() !== "") {
        return true;
      }
      return "Project name is required.";
    },
    filter: (input) => {
      // Replace spaces with hyphens and remove any invalid characters
      return input
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-_]/g, "");
    },
  },
  {
    type: "list",
    name: "projectType",
    message: "Select the project type:",
    choices: ["JavaScript", "TypeScript"],
  },
  {
    type: "list",
    name: "packageManager",
    message: "Select the package manager:",
    choices: ["npm", "yarn", "pnpm"],
  },
  {
    type: "input",
    name: "dependencies",
    message: "Enter dependencies (space-separated, optional):",
    default() {
      return "";
    },
    filter: (input) => input.trim().replace(/\s+/g, " "),
  },
  {
    type: "input",
    name: "devDependencies",
    message: "Enter dev-dependencies (space-separated, optional):",
    default: "",
    filter: (input) => input.trim().replace(/\s+/g, " "),
  },
  {
    type: "input",
    name: "folders",
    message: "Enter additional folders (space-separated, optional):",
    default: "",
    filter: (input) => input.trim().replace(/\s+/g, " "),
  },
  {
    type: "input",
    name: "files",
    message: "Enter additional files (space-separated, optional):",
    default: "",
    filter: (input) => input.trim().replace(/\s+/g, " "),
  },
];

/**
 * Command-line tool for creating Node.js projects.
 */

// Initialize the project.
async function initializeProject() {
  const animateInitText = chalkAnimation
    .rainbow(`Initializing the project...`)
    .start();
  await sleep();
  animateInitText.stop();
}

// Create a new project.
async function createProject(
  name,
  type,
  manager,
  initScript,
  installScript,
  ext
) {
  // A spinner to indicate project creation progress.
  const spinner = createSpinner(
    chalk.blue(`Creating ${name} project with ${type} using ${manager}...`)
  ).start();

  execSync(`mkdir ${name} && ${initScript}`, { stdio: "ignore" });
  execSync(`cd ${name} && mkdir test`, { stdio: "ignore" });
  execSync(`${installScript} jest`, { stdio: "ignore" });

  if (type === "TypeScript") {
    execSync(
      `${installScript} -D nodemon ts-node typescript @types/node @types/jest ts-jest`,
      { stdio: "ignore" }
    );

    // Add TypeScript configuration files
    const tsConfig = {
      compilerOptions: {
        target: "es6",
        module: "commonjs",
        outDir: "dist",
        rootDir: "./",
        esModuleInterop: true,
        strict: true,
        paths: {
          "*": ["./node_modules/*"],
        },
      },
    };

    writeFileSync(`./${name}/tsconfig.json`, formatContent("json", tsConfig));
  }

  const jestConfig = `
        module.exports = {
            preset: 'ts-jest',
            testEnvironment: 'node',
            testMatch: ['**/test/**/*.test.ts'],
            roots: ['./test'],
            moduleFileExtensions: ['ts'],
            modulePathIgnorePatterns: ['./node_modules'],
        };
    `;

  writeFileSync(`./${name}/jest.config.${ext}`, formatContent(ext, jestConfig));

  const testImport =
    type === "TypeScript"
      ? `
            import { method } from 'file';
            import { describe, it, expect, toBe } from 'jest';
        `
      : "";

  const testCode = `${testImport}
        describe('method', () => {
            it('Should do', () => {
            expect(true).toBe(true);
            });
        });
    `;

  writeFileSync(
    `./${name}/test/file.test.${ext}`,
    formatContent(ext, testCode)
  );

  spinner.success();
}

// Create folders for the project.
async function createFolders(name, folders) {
  if (folders) {
    // A spinner to indicate folder creation progress.
    const spinner = createSpinner(chalk.green(`Creating folders...`)).start();

    try {
      const folderNames = folders.split(" ");

      folderNames.forEach((folderName, index) => {
        if (folderName !== "test") {
          mkdirSync(`${name}/${folderName}`);

          if (index === folderNames.length - 1) {
            spinner.success({
              mark: "✅",
              text: chalk.green(`Folders have been created successfully.`),
            });
          }
        }
      });
    } catch (error) {
      spinner.error({
        mark: "❌",
        text: chalk.red(`Error while creating folders.`),
      });
    }
  }
}

// Create files for the project.
async function createFiles(name, files) {
  if (files) {
    // A spinner to indicate file creation progress.
    const spinner = createSpinner(chalk.green(`Creating files...`)).start();

    try {
      const fileNames = files.split(" ");
      fileNames.forEach((fileName, index) => {
        writeFileSync(`${name}/${fileName}`, "");

        if (index === fileNames.length - 1) {
          spinner.success({
            mark: "✅",
            text: chalk.green(`Files have been created successfully.`),
          });
        }
      });
    } catch (error) {
      spinner.error({
        mark: "❌",
        text: chalk.red(`Error while creating files.`),
      });
    }
  }
}

// Install project dependencies.
async function installDependencies(dependencies, installScript) {
  if (dependencies) {
    const deps = dependencies.split(" ");

    // A spinner to indicate dependency installation progress.
    const spinner = createSpinner(
      chalk.green(`Installing dependencies...`)
    ).start();

    try {
      for (const dep of deps) {
        execSync(`${installScript} ${dep}`, { stdio: "inherit" });
      }

      spinner.success({
        mark: "✅",
        text: chalk.green(
          `Dependencies ${dependencies} have been installed successfully.`
        ),
      });
    } catch (error) {
      spinner.error({
        mark: "❌",
        text: chalk.red(`Failed to install some dependencies.`),
      });
    }
  }
}

// Install dev dependencies.
async function installDevDependencies(devDependencies, installScript) {
  if (devDependencies) {
    const devDeps = devDependencies.split(" ");

    // A spinner to indicate dev dependency installation progress.
    const spinner = createSpinner(
      chalk.green(`Installing dev dependencies...`)
    ).start();

    try {
      for (const devDep of devDeps) {
        execSync(`${installScript} ${devDep}`, { stdio: "inherit" });
      }

      spinner.success({
        mark: "✅",
        text: chalk.green(
          `Dev dependencies ${devDependencies} have been installed successfully.`
        ),
      });
    } catch (error) {
      spinner.error({
        mark: "❌",
        text: chalk.red(`Failed to install some dev dependencies.`),
      });
    }
  }
}

program
  .version("1.0.1")
  .alias("v")
  .description("A tool to create Node.js projects")
  .command("create")
  .description("Create a new project")
  .action(async () => {
    try {
      await initializeProject();

      const {
        projectName,
        projectType,
        packageManager,
        dependencies,
        devDependencies,
        folders,
        files,
      } = await inquirer.prompt(questions);

      const initScript =
        packageManager === "npm" || packageManager === "yarn"
          ? `cd ${projectName} && npm init -y`
          : `cd ${projectName} && ${packageManager} init`;

      const installScript =
        packageManager === "npm"
          ? `cd ${projectName} && ${packageManager} i`
          : `cd ${projectName} && ${packageManager} add`;

      const fileExtension = projectType === "TypeScript" ? "ts" : "js";

      await createProject(
        projectName,
        projectType,
        packageManager,
        initScript,
        installScript,
        fileExtension
      );

      await createFolders(projectName, folders);
      await createFiles(projectName, files);
      await installDependencies(dependencies, installScript);
      await installDevDependencies(devDependencies, installScript);

      console.log(
        chalk.green(`\nProject ${projectName} created successfully!`)
      );
    } catch (error) {
      console.error(chalk.red("\nAn error occurred during project creation:"));
      console.error(error.message);
    }
  });

program.parse(process.argv);
