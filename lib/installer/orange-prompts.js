import { createRequire } from 'module';
import chalk from 'chalk';

const require = createRequire(import.meta.url);
const ORANGE = chalk.hex('#ffa203');

export function applyOrangeTheme() {
  const colors = require('yoctocolors-cjs');
  colors.green = (t) => ORANGE(t);
  colors.cyan = (t) => ORANGE(t);
}

export const ORANGE_PREFIX = '';
