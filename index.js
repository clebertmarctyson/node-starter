import { program } from "commander";
import { createSpinner } from "nanospinner";
import chalk from "chalk";
import inquirer from "inquirer";
import figlet from "figlet";
import gradient from "gradient-string";

import { log } from "console";

import {
  configureProject,
  createFiles,
  createFolders,
  createProject,
  installDependencies,
  installDevDependencies,
} from "./utils/project.js";
import { questions } from "./utils/questions.js";
import { sleep } from "./utils/index.js";

program
  .version("1.0.4")
  .description("A tool to create Node.js projects")
  .command("create")
  .description("Create a new project")
  .action(async () => {
    const spinner = createSpinner(
      chalk.blue(`Initializing the project ...\n`)
    ).start();

    await sleep(3000);

    spinner.success();

    const {
      name,
      type,
      manager,
      folders,
      files,
      dependencies,
      devDependencies,
    } = await inquirer.prompt(questions);

    const installScript = `${manager} ${manager === "npm" ? "i" : "add"}`;

    try {
      await createProject(name, manager);
      await configureProject(installScript, type);
      await createFolders(folders);
      await createFiles(files);
      await installDependencies(dependencies, installScript);
      await installDevDependencies(devDependencies, installScript);

      spinner.success({
        text: chalk.green(
          `Project is ready to start, run : \n\n${chalk.blue(
            `cd ${name}`
          )} \n${chalk.blue(`${manager} start`)}\n`
        ),
      });

      figlet("Node Starter", (err, data) => {
        if (!err) {
          log(gradient.pastel.multiline(data));
        }
      });
    } catch (err) {
      spinner.error({
        text: chalk.red(err.message),
      });
    }
  });

program.parse(process.argv);
