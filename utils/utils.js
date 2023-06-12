import { format } from "prettier";

/**
 * A utility function to simulate an asynchronous sleep.
 *
 * @param {number} milliseconds - The number of milliseconds to sleep.
 * @returns {Promise<void>} A promise that resolves after the specified delay.
 */
export const sleep = (milliseconds) => {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
};

/**
 * Formats the content based on the specified type.
 *
 * @param {string} type - The type of content.
 * @param {string|object} content - The content to be formatted.
 * @returns {string} The formatted content.
 */
export const formatContent = (type, content) => {
    if (type === "ts" || type === "js") {
        return format(content, {
            parser: "babel",
            semi: true,
            singleQuote: true,
            trailingComma: "none",
            bracketSpacing: true,
            arrowParens: "avoid",
            endOfLine: "auto",
        });
    } else {
        return JSON.stringify(content, null, 2);
    }
};
