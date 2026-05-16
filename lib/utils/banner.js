const LOGO_LINES = [
  '______',
  '| ___ \\',
  '| |_/ /_____   _____ _ __ ___  __ _',
  "|    // _ \\ \\ / / _ \\ '__/ __|/ _` |",
  '| |\\ \\  __/\\ V /  __/ |  \\__ \\ (_| |',
  '\\_| \\_\\___| \\_/ \\___|_|  |___/\\__,_|',
];

const LOGO_COLOR = '#ffa203';
const SIGNATURE_LINE = 5;
const SIGNATURE_MARGIN = 3;

export function clearTerminalForLogo() {
  if (process.stdout.isTTY) {
    process.stdout.write('\x1b[2J\x1b[H');
  }
}

export function renderReversaLogo(chalk) {
  const logo = chalk.hex(LOGO_COLOR);
  const maxWidth = Math.max(...LOGO_LINES.map(line => line.length));

  return LOGO_LINES
    .map((line, index) => {
      const logoLine = logo(line.padEnd(maxWidth));

      if (index !== SIGNATURE_LINE) {
        return logoLine;
      }

      return `${logoLine}${' '.repeat(SIGNATURE_MARGIN)}${chalk.white('by sandeco')}`;
    })
    .join('\n');
}
