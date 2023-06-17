export const questions = [
  {
    type: "input",
    name: "name",
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
    name: "type",
    message: "Select the project type:",
    choices: ["JavaScript", "TypeScript"],
  },
  {
    type: "list",
    name: "manager",
    message: "Select the package manager:",
    choices: ["npm", "yarn", "pnpm"],
  },
  {
    type: "input",
    name: "dependencies",
    message: "Enter dependencies (space-separated, optional):",
    default: "",
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
