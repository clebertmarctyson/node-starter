#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import { execSync } from "child_process";
import chalk from "chalk";
import { format } from "prettier";
import { log } from "console";

import { mkdirSync, writeFileSync } from "fs";

program
    .version("1.0.0")
    .description("A tool to create Node.js projects")
    .command("create")
    .description("Create a new project")
    .action(() => {
        // Code to initializing the project
        log(chalk.blue(`Initializing the project...`));

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
                default: '',
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

        inquirer.prompt(questions).then(answers => {
            const { projectName, projectType, dependencies, devDependencies, folders, files, packageManager } = answers;

            // Code to create the project based on user input
            const createProject = (projectName, projectType) => {

                log(chalk.blue(`Creating ${projectName} project with ${projectType} using ${packageManager}...`));

                // Create the project directory
                mkdirSync(projectName);
                process.chdir(projectName);

                const ext = projectType === "TypeScript" ? "ts" : "js";

                const testImport = projectType === "TypeScript" ? `
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

                mkdirSync("test");

                writeFileSync(`./test/file.test.${ext}`, format(testCode, {
                    parser: 'babel',
                    semi: true,
                    singleQuote: true,
                    trailingComma: 'none',
                    bracketSpacing: true,
                    arrowParens: 'avoid',
                    endOfLine: 'auto',
                }));


                // Initialize choosing package manager
                execSync(`${packageManager} init ${packageManager === "npm" || packageManager === "yarn" ? "-y" : ""}`, { stdio: 'ignore' });

                // Create additional directories based on user input
                if (folders) {
                    log(chalk.blue("Creating folders..."));
                    const folderNames = folders.split(' ');
                    folderNames.forEach(folderName => {
                        mkdirSync(folderName);
                    });
                }


                // Create additional files based on user input
                if (files) {
                    log(chalk.blue("Creating files..."));
                    const fileNames = files.split(' ');
                    fileNames.forEach(fileName => {
                        writeFileSync(fileName, '');
                    });
                }


                // Install pre-dependencies
                if (dependencies) {
                    log(chalk.blue("Installing dependencies..."));
                    const deps = dependencies.split(' ');
                    deps.forEach(dep => {
                        execSync(`${packageManager} ${packageManager === "npm" ? "i" : "add"} ${dep}`, { stdio: 'inherit' });
                    });
                }

                // Install dev-dependencies
                if (devDependencies) {
                    log(chalk.blue("Installing dev dependencies..."));
                    const devDeps = devDependencies.split(' ');
                    devDeps.forEach(dep => {
                        execSync(`${packageManager} ${packageManager === "npm" ? "i" : "add"} -D ${dep}`, { stdio: 'inherit' });
                    });
                }

                execSync(`${packageManager} ${packageManager === "npm" ? "i" : "add"} jest`, { stdio: 'ignore' });

                if (projectType === 'TypeScript') {
                    execSync(`${packageManager} ${packageManager === "npm" ? "i" : "add"} -D nodemon ts-node typescript @types/node @types/jest ts-jest`, { stdio: 'ignore' });

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

                    writeFileSync(`tsconfig.json`, JSON.stringify(tsConfig, null, 2));
                }

                const jestConfig = `
                    module.exports = {
                        preset: 'ts-jest',
                        testEnvironment: 'node',
                        testMatch: ['**/test/**/*.test.ts'],
                        roots: ['./test'],
                        moduleFileExtensions: ['ts'],
                        modulePathIgnorePatterns: ['./node_modules'],
                    };`;

                const formattedConfig = format(jestConfig, {
                    parser: 'babel',
                    semi: true,
                    singleQuote: true,
                    trailingComma: 'none',
                    bracketSpacing: true,
                    arrowParens: 'avoid',
                    endOfLine: 'auto',
                });

                writeFileSync('jest.config.js', formattedConfig);


                log(chalk.green('Project created successfully!'));
            };

            createProject(projectName, projectType);
        });
    });

program.parse(process.argv);