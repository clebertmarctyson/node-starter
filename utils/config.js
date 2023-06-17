import { execSync } from "child_process";
import { existsSync, writeFileSync } from "fs";
import { formatContent } from "./index.js";

/**
 * Configure Jest for testing.
 *
 * @param {string} installScript - The installation script based on the package manager.
 */
export function configureJest(installScript, ext) {
  execSync(`${installScript} jest`, {
    stdio: "ignore",
  });

  if (!existsSync("test")) {
    execSync(`mkdir test`, { stdio: "ignore" });
  }

  // Create Test Config File
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

  writeFileSync(`./jest.config.js`, formatContent("js", jestConfig));

  // Create Test Example File
  const testCode = `
    import { method } from 'file';

    describe('method', () => {
      it('Should do', () => {
        expect(true).toBe(true);
      });
    });
  `;

  writeFileSync(`./test/file.test.${ext}`, formatContent(ext, testCode));
}

/**
 * Configure environment variables.
 */
export function configureEnvVariables(installScript) {
  execSync(`${installScript} -D dotenv`, { stdio: "ignore" });

  const envVars = `
    PORT=8000
    NODE_ENV=development
    DATABASE_URI=url_of_your_database
    SECRET=super_secret_value
  `;

  writeFileSync(`./.env`, formatContent(null, envVars));
}

/**
 * Configure Git.
 */
export function configureGit() {
  execSync(`git init`, { stdio: "ignore" });

  const ignoreFiles = `
    .env
    node_modules
  `;

  writeFileSync(`./.gitignore`, formatContent(null, ignoreFiles));
}

/**
 * Configure the server.
 *
 * @param {string} type - The type of project (e.g., JavaScript, TypeScript).
 * @param {string} ext - The file extension (js or ts).
 */
export function configureServer(type, ext) {
  const serverCode =
    type === "TypeScript"
      ? `
    import dotenv from "dotenv";
    import express, { Express } from "express";
    import { log } from "console";

    dotenv.config();

    const app: Express = express();
    const port: number = Number.parseInt(process.env.PORT);

    app.listen(port, () => {
      log(\`[Server] Server is running on http://localhost:\${port}\`);
    });
    `
      : `
    import dotenv from "dotenv";
    import express from "express";
    import { log } from "console";

    dotenv.config();

    const app = express();
    const port = process.env.PORT;

    app.listen(port, () => {
      log(\`[Server] Server is running on http://localhost:\${port}\`);
    });
  `;

  writeFileSync(`./index.${ext}`, formatContent(ext, serverCode));
}

/**
 * Configure TypeScript.
 *
 * @param {string} installScript - The installation script based on the package manager.
 */
export function configureTypeScript(installScript) {
  execSync(
    `${installScript} -D typescript nodemon ts-node @types/node @types/jest ts-jest @types/express`,
    { stdio: "ignore" }
  );

  // Add TypeScript configuration files
  const tsConfig = {
    compilerOptions: {
      target: "es6",
      module: "commonjs",
      outDir: "./dist",
      rootDir: "./",
      esModuleInterop: true,
      strict: true,
      paths: {
        "*": ["./node_modules/*"],
      },
    },
  };

  writeFileSync(`./tsconfig.json`, formatContent("json", tsConfig));
}
