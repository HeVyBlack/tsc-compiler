
# Tsc-compiler
 
A typescript compiler, that use SWC.

 
- To install: `npm i -g tsc-compiler` or `npm i -D tsc-compiler`

- To use: `tsc-compiler [source] [output] [flags]` or `npx tsc-compiler [source] [output] [flags]`

By default **SWC** scan your root folder, and search the **.swcrc file**, so, configure the **.swcrc file** as you want!

  

**Tsc-compiler** will search the **tsconfig.json**, if don't found it, will use the next config:
 1. Target : **ES2016**
 2. Module : **CommonJS**
 3. ModuleResolution : **Node16**
 4. SourceMap : **True**
 5. esModuleInterop : **true**

  

**Flags:**

| flag | What it do |
|--|--|
| --copy-files | Copy no .ts files |
| --watch | Watch for changes |
| --run [file to run] | Run .js files |
| --clean-on-exit | Remove out folder on exit |
| --no-empy-files | Avoid empty .ts files |
| --type-check | Typescript check files before compilation |


  

A reason why you wanna use this, is: When you are using **allowImportTsExtensions** in your **tsconfig.json**. This compiler take the **.ts** files, compile it, and change the **.ts** to **.js** in the imports statements.