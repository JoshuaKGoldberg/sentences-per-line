import { markdownlintSentencesPerLine } from "./markdownlintSentencesPerLine.js";

// Ideally, Markdownlint CLIs should support default exports...
export default markdownlintSentencesPerLine;

// ...but practically, at least markdownlint-cli doesn't at time of writing.
// It assumes the CJS-style module.exports = { ... } object shape.
export const description = markdownlintSentencesPerLine.description;
export const names = markdownlintSentencesPerLine.names;
export const parser = markdownlintSentencesPerLine.parser;
export const tags = markdownlintSentencesPerLine.tags;

// Additionally, 'function' is an expected property name - and a reserved word.
const ruleFunction = markdownlintSentencesPerLine.function;
export { ruleFunction as function };
