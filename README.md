  

# Tsc-compiler

A typescript compiler, that use SWC.

  

- To install: `npm i -g tsc-compiler` or `npm i -D tsc-compiler`

  

- To use: `tsc-compiler [source] [output] [flags]` or `npx tsc-compiler [source] [output] [flags]`

  

**Flags:**

|flag| What it do |
|--------------|--|
| --copy-files | Copy no .ts files |
| --watch | Watch for changes |
| --run [file to run] | Run .js files |
| --clean-on-exit | Remove out folder on exit |
| --no-empy-files | Avoid empty .ts files |
| --type-check | Typescript check files before compilation |
| --no-tsconfig | Dont save a basic tsconfig |
  

A reason why you wanna use this, is: When you are using **allowImportTsExtensions** in your **tsconfig.json**. This compiler take the **.ts** files, compile it, and change the **.ts** to **.js** in the imports statements.

  

**Please read!**

  

**Tsc-compiler** will search the **tsconfig.json**, if don't found it, will use the next config:

- target : **ES2022**

- module : **NodeNext**

- moduleResolution : **NodeNext**

- allowImportingTsExtensions : **true**

- noEmit : **true**

- stric : **true**

- experimentalDecorators : **true**

- emitDecoratorMetadata : **true**

  

And, will **save a tsconfig.json** with that config, if you **don't want to save it**, use the **--no-tsconfig flag**

  

**Tsc-compiler** will search the **.swcrc**, if don't found it, will use the next config:

  

- syntax : **typescript**

- tsx : **false**

- decorators : **true**

- target : **es2022**

- decoratorMetadata: **true**