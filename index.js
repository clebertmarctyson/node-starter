#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import { exec, execSync } from "child_process";
import chalk from "chalk";

import fs from "fs";
import path from "path";
import { log } from "console";

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
            const { projectName, projectType, dependencies, devDependencies, folders, files } = answers;

            // Code to create the project based on user input
            const createProject = (projectName, projectType) => {
                log(chalk.blue(`Creating ${projectName} project with ${projectType}...`));

                // Create the project directory
                fs.mkdirSync(projectName);
                process.chdir(projectName);

                // Initialize pnpm
                execSync('pnpm init', { stdio: 'inherit' });

                // Create additional directories based on user input
                if (folders) {
                    const folderNames = folders.split(' ');
                    folderNames.forEach(folderName => {
                        fs.mkdirSync(folderName);
                    });
                }

                // Create additional files based on user input
                if (files) {
                    const fileNames = files.split(' ');
                    fileNames.forEach(fileName => {
                        fs.writeFileSync(fileName, '');
                    });
                }

                // Install pre-dependencies
                if (dependencies) {
                    const deps = dependencies.split(' ');
                    deps.forEach(dep => {
                        execSync(`pnpm install ${dep}`, { stdio: 'inherit' });
                    });
                }

                // Install dev-dependencies
                if (devDependencies) {
                    const devDeps = devDependencies.split(' ');
                    devDeps.forEach(dep => {
                        execSync(`pnpm add -D ${dep}`, { stdio: 'inherit' });
                    });
                }

                if (projectType === 'TypeScript') {
                    execSync(`pnpm add -D typescript ts-node`, { stdio: 'inherit' });

                    // Add TypeScript configuration files
                    const tsConfig = {
                        compilerOptions: {
                            target: 'es6',
                            module: 'commonjs',
                            strict: true,
                        },
                        exclude: ['node_modules/']
                    };

                    fs.writeFileSync(`tsconfig.json`, JSON.stringify(tsConfig, null, 2));
                }

                log(chalk.green('Project created successfully!'));
            };
            createProject(projectName, projectType);
        });
    });

program.parse(process.argv);
