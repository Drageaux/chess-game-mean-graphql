import chalk from 'chalk';

const logger = console.log;
// log colors
export const system = chalk.cyan;
export const success = chalk.green;
export const error = chalk.bold.red;
export const warning = chalk.keyword('orange');

export default logger;
