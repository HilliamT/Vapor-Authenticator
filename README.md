<!-- Project Header -->

<div align="center">
  <img src="https://i.ibb.co/prBfJPg/vapor.png" width=100 height=100 />
  <h1>Vapor - Desktop Authenticator for Steam</h1>
</div>

<hr>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li>
      <a href="#about">About</a>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#technicals">Technicals</a></li>
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

<hr>

<!-- About the Project -->
## About

![Vapor Demo](https://s8.gifyu.com/images/VaporDemo2.gif)

Vapor is a 3rd party open-source authenticator app for Steam, operating as a Desktop application to allow for players who don't have access to a smartphone to install the [Steam Mobile Authenticator](https://play.google.com/store/apps/details?id=com.valvesoftware.android.steam.community&hl=en_GB&gl=US) to be able to use Steam and trade video game items on the platform with minimal limitations.

Because the project is open-source utilising APIs offered by Steam, additional features can be added in by the community to build an application that not only provides what the current existing mobile authenticator app offers but more to help Steam traders, gamers and players.

### Features
#### `General`
* Use the app as your main authenticator!
* Generate Steam Guard codes to login to different websites using your Steam account
* Revoke the authenticator with little hassle

#### `Trading`
* See all your trades with minimal delay
* Accept or decline your trades from the app
* View your trade confirmations
* Confirm or cancel confirmations from the app

#### `Gaming`
* Coming soon
#### `Market Listing`
* Coming soon
#### `Inventory Management`
* Coming soon

### Technicals
Vapor is developed in `TypeScript` using `ElectronJS` to produce the application for desktop. `ReactJS` and `TailwindCSS` has been integrated into the project to make frontend development easier.

There are several tools including `Babel` to compile `TypeScript` into plain `JavaScript` and `Webpack` to build the project into a development build that can be ran and tested locally.

<!-- Getting Started -->
## Getting Started

### Installation

#### `Stable`
The project is not yet in a state to be classed as stable for public usage.

#### `Development`
You will need `node` and `npm` to run this project as a developer and build it from source.

1. Clone this project from GitHub and `cd` into the project directory.
This will install all necessary dependencies, including dev-dependencies, to allow you to build the project alongside install developer tools to make development easier.
3. Run `npm start` to build and bootup the app to ensure that it is working for you. You can exit using `Ctrl + C` once you have finished testing it.

## Roadmap

These planned features have been sourced from discussions with users and communities. Some may also be features that are missing from Vapor that exist in the current version of the Steam Mobile Authenticator app.

`*` - Provided by the Steam Mobile Authenticator App
#### `General`
* Export your secrets for other applications e.g trading bots
* Display all new Steam account notifications e.g gifts, new items `*`

#### `Social`
* View your friends `*`
* Send and receive messages to your friends `*`
* View your Steam profile `*`
* View any Steam profile `*`
#### `Trading`
* Notify you of new trades via a desktop notification
* View the details of an incoming trade offer `*`
* Option to auto-accept all (incoming) trade confirmations

#### `Gaming`
* Play all games on your account (to farm Steam game cards)
#### `Market Listings`
* Option to auto-accept all (incoming) market confirmations
* Create a Market listing for your item `*`
#### `Inventory Management`
* View your in-game inventory for `TF2`, `CS:GO`, `Dota2` and other games `*`

#### `Meta`
* Repository badges
* GitHub Wiki
* GitHub CI/CD Pipeline Setup

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
    - `screens/` - A set of `React` components that define a top-level non-Root `JSX` components
    - `components/` - A set of `React` components that are served on top of screens
    - `App.tsx` - Hoists React renderer, rendering `index.tsx`
    - `index.tsx` - The most top-level `React` component that is rendered for the project
  - `lib/` - Library of custom-made functions interacting with Steam APIs to perform procedures or get data.
    - `steam/` - Library to interact with Steam
    - `store/` - Library to interact with `Electron-Store` to store user data persistently 
  - `main.ts` - Boots up `ElectronJS`
  - `preload.ts` - Script for any code with `Node` API access to be ran before loading any of the webpage
- `.eslintrc` - ESLint configuration file to lint your code via `npm run lint`
- `.gitignore` - File of paths to hide from `Git` tracking
- `LICENSE` - MIT license
- `index.html` - Base `.html` page needed by Electron to hoist its code onto
- `package-lock.json` - Details the versions of each `npm` dependency to install to minimise configuration and installation issues
- `package.json` - Details things about the project and lets `npm` know what dependencies are needed to be installed
- `postcss.config.js` - Needed by our `PostCSS` loader to recognise that we are using `TailwindCSS` to minify it
- `README.md` - This document!
- `tailwind.config.js` - `TailwindCSS` configuration file
- `tailwind.css` - File denoting which `TailwindCSS` directives are being used
- `tsconfig.json` - A build configuration file to let the `TypeScript` Compiler know how to convert our TypeScript files ending in `*.ts` into plain JavaScript `*.js` files.
- `webpack.common.js` - A build configuration file to let the Webpack Babel Compiler know how to convert our `TypeScript-React-TailwindCSS` `src/` files into an optimised `build/` file of plain old `JS`, `HTML` and `CSS`.

## Contact

You can contact me on Steam [here](https://steamcommunity.com/profiles/76561198081082634/).