const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  tests: './',
  output: './output',
  helpers: {
    Playwright: {
      browser: 'electron',
      electron: {
        executablePath: '// require("electron") or require("electron-forge")',
        args: ['path/to/your/main.js']
      }
    }
  },
  include: {
    I: './steps_file.js'
  },
  name: 'SnapRevive'
}