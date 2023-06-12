#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import chalkAnimation from 'chalk-animation';
import { createSpinner } from 'nanospinner';
import inquirer from "inquirer";
import { formatContent, sleep } from "./utils/utils.js";
import { execSync } from "child_process";
import { mkdirSync, writeFileSync } from "fs";

/**
 * Command-line tool for creating Node.js projects.
 */
program
    .version("1.0.0")
    .alias("-v")
    .description("A tool to create Node.js projects")
    .command("create")
    .description("Create a new project")
    .action(async () => {
        /**
         * Initialize the project.
         */
        async function initializeProject() {
            const animateInitText = chalkAnimation.rainbow(`Initializing the project...`).start();
            await sleep();
            animateInitText.stop();
        }

        /**
         * Create a new project.
         *
         * @param {string} name - The name of the project.
         * @param {string} type - The type of the project (JavaScript | TypeScript).
         * @param {string} manager - The package manager to use (npm | yarn | pnpm).
         * @param {string} initScript - The script to initialize the project.
         * @param {string} installScript - The script to install dependencies.
         * @param {string} ext - The file extension to use (js | ts).
         */
        async function createProject(name, type, manager, initScript, installScript, ext) {
            /**
             * A spinner to indicate project creation progress.
             *
             * @type {object}
             */
            const spinner = createSpinner(chalk.blue(`Creating ${name} project with ${type} using ${manager}...`)).start();

            execSync(`mkdir ${name} && ${initScript}`, { stdio: 'ignore' });
            execSync(`cd ${name} && mkdir test`, { stdio: 'ignore' });
            execSync(`${installScript} jest`, { stdio: 'ignore' });

            if (type === 'TypeScript') {
                execSync(`${installScript} -D nodemon ts-node typescript @types/node @types/jest ts-jest`, { stdio: 'ignore' });

                // Add TypeScript configuration files
                const tsConfig = {
                    "compilerOptions": {
                        "target": "es6",
                        "module": "commonjs",
                        "outDir": "dist",
                        "rootDir": "./",
                        "esModuleInterop": true,
                        "strict": true,
                        "paths": {
                            "*": ["./node_modules/*"]
                        }
                    }
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

            const testImport = type === "TypeScript" ? `
                import { method } from 'file';
                import { describe, it, expect, toBe } from 'jest';
            ` : "";

            const testCode = `${testImport}
                describe('method', () => {
                    it('Should do', () => {
                    expect(true).toBe(true);
                    });
                });
            `;

            writeFileSync(`./${name}/test/file.test.${ext}`, formatContent(ext, testCode));

            spinner.success();
        }

        /**
         * Create folders for the project.
         * @param {string} name - The name of the project.
         */
        async function createFolders(name) {
            if (folders) {
                /**
                 * A spinner to indicate folder creation progress.
                 *
                 * @type {object}
                 */
                const spinner = createSpinner(chalk.green(`Creating folders...`)).start();

                const folderNames = folders.split(' ');
                folderNames.forEach((folderName, index) => {
                    if (folderName !== "test") {
                        mkdirSync(`${name}/${folderName}`);
                    }

                    if (index === folderNames.length - 1) {
                        spinner.success(chalk.green(`Folders ${folders} have been created successfully.`));
                    }
                });
            }
        }

        /**
         * Create files for the project.
         * @param {string} name - The name of the project.
         */
        async function createFiles(name) {
            if (files) {
                /**
                 * A spinner to indicate file creation progress.
                 *
                 * @type {object}
                 */
                const spinner = createSpinner(chalk.green(`Creating files...`)).start();

                const fileNames = files.split(' ');
                fileNames.forEach((fileName, index) => {
                    writeFileSync(`${name}/${fileName}`, '');

                    if (index === fileNames.length - 1) {
                        spinner.success(chalk.green(`Files ${files} have been created successfully.`));
                    }
                });
            }
        }

        /**
         * Install project dependencies.
         *
         * @param {string} dependencies - Space-separated list of dependencies.
         * @param {string} installScript - The script to install dependencies.
         */
        async function installDependencies(dependencies, installScript) {
            if (dependencies) {
                /**
                 * A spinner to indicate dependency installation progress.
                 *
                 * @type {object}
                 */
                const spinner = createSpinner(chalk.green(`Installing dependencies...`)).start();

                const deps = dependencies.split(' ');
                deps.forEach((dep, index) => {
                    execSync(`${installScript} ${dep}`, { stdio: 'inherit' });

                    if (index === deps.length - 1) {
                        spinner.success(chalk.green(`Dependencies ${dependencies} have been installed successfully.`));
                    }
                });
            }
        }

        /**
         * Install dev dependencies.
         *
         * @param {string} devDependencies - Space-separated list of dev dependencies.
         * @param {string} installScript - The script to install dependencies.
         */
        async function installDevDependencies(devDependencies, installScript) {
            if (devDependencies) {
                /**
                 * A spinner to indicate dev dependency installation progress.
                 *
                 * @type {object}
                 */
                const spinner = createSpinner(chalk.green(`Installing dev dependencies...`)).start();

                const devDeps = devDependencies.split(' ');
                devDeps.forEach((devDep, index) => {
                    execSync(`${installScript} ${devDep}`, { stdio: 'inherit' });

                    if (index === devDeps.length - 1) {
                        spinner.success(chalk.green(`Dev dependencies ${devDependencies} have been installed successfully.`));
                    }
                });
            }
        }

        await initializeProject();

        const questions = [
            {
                type: 'input',
                name: 'projectName',
                message: 'Enter the name of your project:',
                validate: (input) => {
                    if (input.trim() !== '') {
                        return true;
                    }
                    return 'Project name is required.';
                },
                filter: (input) => {
                    // Replace spaces with hyphens and remove any invalid characters
                    return input.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '');
                },
            },
            {
                type: 'list',
                name: 'projectType',
                message: 'Select the project type:',
                choices: ['JavaScript', 'TypeScript'],
            },
            {
                type: 'list',
                name: 'packageManager',
                message: 'Select the package manager:',
                choices: ['npm', 'yarn', 'pnpm'],
            },
            {
                type: 'input',
                name: 'dependencies',
                message: 'Enter dependencies (space-separated, optional):',
                default() {
                    return ''
                },
                filter: (input) => input.trim().replace(/\s+/g, ' ')
            },
            {
                type: 'input',
                name: 'devDependencies',
                message: 'Enter dev-dependencies (space-separated, optional):',
                default: '',
                filter: (input) => input.trim().replace(/\s+/g, ' ')
            },
            {
                type: 'input',
                name: 'folders',
                message: 'Enter folders (space-separated, optional):',
                default: '',
                filter: (input) => input.trim().replace(/\s+/g, ' ')
            },
            {
                type: 'input',
                name: 'files',
                message: 'Enter files (space-separated, optional):',
                default: '',
                filter: (input) => input.trim().replace(/\s+/g, ' ')
            },
        ];

        const {
            projectName,
            projectType,
            packageManager,
            dependencies,
            devDependencies,
            folders,
            files
        } = await inquirer.prompt(questions);

        const ext = (projectType === "TypeScript") ? "ts" : "js";
        const initScript = `cd ${projectName} && ${packageManager} ${packageManager === "pnpm" ? "init" : "init -y"}`;
        const installScript = `cd ${projectName} && ${packageManager} ${packageManager === "npm" ? "i" : "add"}`;

        await createProject(projectName, projectType, packageManager, initScript, installScript, ext);
        await createFolders(projectName);
        await createFiles(projectName);
        await installDependencies(dependencies, installScript);
        await installDevDependencies(devDependencies, installScript);
    });

program.parse(process.argv);
