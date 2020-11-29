<!-- Project Header -->
<div align="center">
  <h1>Vapor</h1>
  <h2>Desktop Authenticator for Steam</h2>
</div>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a>
      <ul>
        <li><a href="#project-structure">Project Structure</a></li>
      </ul>
    </li>
    <li>
    <a href="#roadmap">Contact</a></li>
  </ol>
</details>

<!-- About the Project -->
## About the Project

### Built with
* ElectronJS
* Typescript
* ReactJS
* Webpack + Babel

<!-- Getting Started -->
## Getting Started


### Installation


## Roadmap

## Contributing
This project consists of many technologies, however, I have made it as minimal as possible to avoid bloatware.

You will need `node` and `npm` to run this project as a developer and build it from source.

1. Fork this project to your own Git account - this will make a personal copy for you to make, commit and push your own edits.
2. Clone your forked version and run `npm install`. This will install all necessary dependencies, including dev-dependencies, to allow you to build the project alongside install developer tools to make development easier.
3. Run `npm start` to build and bootup the app to ensure that it is working for you. You can exit using `Ctrl + C` once you have finished testing it.
4. You can start developing and making edits to your files! You can run `npm run watch` to have Webpack and Typescript listen to your changes as to verify the correctness of your code.
5. Once done, test your code and then lint it using `npm run lint`.
6. Once the linter has approved, commit your code and make a pull request to the original repository.

### Project Structure

The project repository will follow this structure when you are working with it.

- `build/` - Built files from performing `npm run build` or any command that uses it.
- `node_modules/` - Folder to host your installed node modules for this repository. This is generated after `npm install`.
- `src/` - Source files for this project. The majority of the code you should be making edits to should be inside here.
  - `app/` - All source files related to the content of the Desktop app
    - `App.tsx` - Hoists React renderer, rendering `index.tsx`
    - `index.tsx` - The most top-level React component that is rendered for the project
  - `main.ts` - Boots up ElectronJS
  - `preload.ts` - Script for any code with Node API access to be ran before loading any of the webpage
- `.eslintrc` - ESLint configuration file
- `.gitignore` - File of paths to hide from Git tracking
- `index.html` - Base `.html` page needed by Electron to hoist its code onto
- `package.json` - Details things about the project and lets `npm` know what dependencies are needed to be installed
- `README.md` - This document!
- `tsconfig.json` - A build configuration file to let the TypeScript Compiler know how to convert our TypeScript files ending in `*.ts` into plain JavaScript `*.js` files.
- `webpack.common.js` - A build configuration file to let the Webpack Babel Compiler know how to convert out TypeScript-React files ending in `*.tsx` into a bundled and optimised `app.js` file

## Contact

You can contact me on Steam [here](https://steamcommunity.com/profiles/76561198081082634/).