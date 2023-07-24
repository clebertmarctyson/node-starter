import { Command } from "commander";
import { createSpinner } from "nanospinner";
import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import figlet from "figlet";

import {
  createProject,
  configureProject,
  createFolders,
  createFiles,
  installDependencies,
  installDevDependencies,
} from "./utils/project.js";

import { questions } from "./utils/questions.js";
import { sleep } from "./utils/index.js";
import { log } from "console";

const program = new Command();

program
  .version("1.0.10")
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
    const initScript =
      manager === "npm" || manager === "yarn"
        ? `${manager} init -y`
        : `${manager} init`;
    const ext = type === "TypeScript" ? "ts" : "js";

    try {
      await createProject(name, initScript, ext);
      await configureProject(installScript, ext);
      await createFolders(folders);
      await createFiles(files);
      await installDependencies(dependencies, installScript);
      await installDevDependencies(devDependencies, installScript);

      spinner.success({
        text: chalk.green(
          `Project is ready to start, run : \n\n${chalk.blue(
            `cd ${name}`
          )} \n${chalk.blue(`${manager} dev`)}\n`
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
