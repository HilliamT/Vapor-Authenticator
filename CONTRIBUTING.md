## Contributing
This project consists of many technologies, however, I have made it as minimal as possible to avoid bloatware.

You will need `node` and `npm` to run this project as a developer and build it from source.

1. Fork this project to your own `Git` account - this will make a personal copy for you to make, commit and push your own edits.
2. Clone your forked version and run `npm install`. This will install all necessary dependencies, including dev-dependencies, to allow you to build the project alongside install developer tools to make development easier.
3. Run `npm start` to build and bootup the app to ensure that it is working for you. You can exit using `Ctrl + C` once you have finished testing it.
4. You can start developing and making edits to your files! You can run `npm run watch` to have Webpack and Typescript listen to your changes as to verify the correctness of your code.
5. Once done, test your code and then lint it using `npm run lint`.
6. Once the linter has approved, commit your code and make a pull request to the original repository. A GitHub action will verify that your code is linted against the rules set for the repository as well as check for any build errors.

### Project Structure

The project repository will follow this structure when you are working with it.

- `assets/` - Any visual assets needed for this `README.md` document
- `build/` - Built files from performing `npm run build` or any command that uses it.
- `icons/` - Production-ready icons and logos generated from `npm run icon-gen`
- `node_modules/` - Folder to host your installed node modules for this repository. This is generated after `npm install`.
- `out/` - Output directory for production build of Vapor. This is created by running `npm run make`
- `src/` - Source files for this project. The majority of the code you should be making edits to should be inside here.
  - `app/` - All source files related to the content of the Desktop app
    - `screens/` - A set of `React` components that define a top-level non-Root `JSX` components
    - `components/` - A set of `React` components that are served on top of screens
    - `App.tsx` - Hoists `React` renderer, rendering `index.tsx`
    - `index.tsx` - The most top-level `React` component that is rendered for the project
  - `lib/` - Library of custom-made functions interacting with Steam APIs to perform procedures or get data.
    - `steam/` - Library to interact with Steam
    - `store/` - Library to interact with `Electron-Store` to store user data persistently 
  - `main.ts` - Boots up `ElectronJS`
  - `preload.ts` - Script for any code with `Node` API access to be ran before loading any of the webpage
- `.eslintrc` - `ESLint` configuration file to lint your code via `npm run lint`
- `.gitignore` - File of paths to hide from `Git` tracking
- `icon.svg` - App Icon
- `LICENSE` - MIT license
- `index.html` - Base `.html` page needed by Electron to hoist its code onto
- `package-lock.json` - Details the versions of each `npm` dependency to install to minimise configuration and installation issues
- `package.json` - Details things about the project and lets `npm` know what dependencies are needed to be installed
- `postcss.config.js` - Needed by our `PostCSS` loader to recognise that we are using `TailwindCSS` to minify it
- `README.md` - This document!
- `tailwind.config.js` - `TailwindCSS` configuration file
- `tailwind.css` - File denoting which `TailwindCSS` directives are being used
- `tsconfig.json` - A build configuration file to let the `TypeScript` Compiler know how to convert our `TypeScript` files ending in `*.ts` into plain `JavaScript` `*.js` files.
- `webpack.common.js` - A build configuration file to let the Webpack Babel Compiler know how to convert our `TypeScript-React-TailwindCSS` `src/` files into an optimised `build/` file of plain old `JS`, `HTML` and `CSS`.