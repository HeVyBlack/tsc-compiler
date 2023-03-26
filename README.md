# TSC-COMPILER

A typescript compiler, that use SWC.

- To install: `npm i -g tsc-compiler` or `npm i -D tsc-compiler`
- To use: `tsc-compiler [source] [output] [flags]` or `npx tsc-compiler [source] [output] [flags]`

By default SWC scan your root folder, and search the .swcrc file, so, configure the .swcrc file as you want!

**FLAGS:**
|flag|what it do |
|--|--|
| --copy-files | Copy no .ts files |
| --watch | Watch for changes |
| --run [file to run] | Run .js files |
| --clean-on-exit | Remove out folder on exit |

A reason why you wanna use this, is: When you are using **allowImportTsExtensions** in your **tsconfig.json**. This compiler take the **.ts** files, compile it, and change the **.ts** to **.js** in the imports  statements.
