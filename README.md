<!-- Project Header -->

<div align="center">
  <img src="https://i.ibb.co/prBfJPg/vapor.png" width=100 height=100 />
  <h1>Vapor - Desktop Authenticator for Steam</h1>
</div>


<div align="center">
<img src="https://badgen.net/github/tag/hilliamt/vapor-authenticator" />
<img src="https://badgen.net/github/commits/hilliamt/vapor-authenticator" />
<img src="https://visitor-badge.laobi.icu/badge?page_id=hilliamt.vapor-authenticator" alt="visitor badge"/>
<img alt="GitHub forks" src="https://img.shields.io/github/forks/HilliamT/vapor-authenticator">
<img alt="GitHub stars" src="https://img.shields.io/github/stars/HilliamT/vapor-authenticator">

<a href="https://github.com/HilliamT/vapor-authenticator/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/HilliamT/vapor-authenticator"></a> <img alt="GitHub all releases" src="https://img.shields.io/github/downloads/HilliamT/vapor-authenticator/total"> <a href="https://github.com/HilliamT/vapor-authenticator/network"> <img src="https://badgen.net/github/last-commit/hilliamt/vapor-authenticator"> <a href="https://github.com/HilliamT/vapor-authenticator/blob/master/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/HilliamT/vapor-authenticator"></a>
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
    </li>
    <li>
    <a href="#roadmap">Contact</a></li>
  </ol>
</details>

<hr>

<!-- About the Project -->
## About
<img src="https://i.imgur.com/Rkt6xOb.png" />

Vapor is a 3rd party open-source authenticator app for Steam, operating as a Desktop application to allow for players who don't have access to a smartphone to install the [Steam Mobile Authenticator](https://play.google.com/store/apps/details?id=com.valvesoftware.android.steam.community&hl=en_GB&gl=US) to be able to use Steam and trade video game items on the platform with minimal limitations.

You don't have to use the app as your authenticator! There are several features that can be utilised without replacing your old mobile or device authenticator, including accessing web sessions logged in as any of your accounts at the click of a button.

Because the project is open-source utilising APIs offered by Steam, additional features can be added in by the community to build an application that not only provides what the current existing mobile authenticator app offers but more to help Steam traders, gamers and players.

### Features
#### `General`

<div style="text-align: center;">
  <img src="/assets/VaporGeneralDemo.gif" text-align="center">
</div>

* Use the app as your main device authenticator
* Generate Steam Guard codes to login to different websites using your Steam account
* Revoke the authenticator with little hassle
* View and switch between all of your accounts
* Access proxy Steamcommunity.com web sessions as your other accounts
* View your Steam profile in a jiffy
* Login to the app passwordless via OAuth using just a previous username
#### `Trading`

<div style="text-align: center;">
  <img src="/assets/VaporTradeDemo.gif" text-align="center">
</div>

* See all your trades via web session
* View your trade confirmations
* Confirm or cancel confirmations from the app

#### `Gaming`

<div style="text-align: center;">
  <img src="/assets/VaporIdleDemo.gif" text-align="center">
</div>

* Idle all of your games at the click of a button
* Send and receive messages to your friends in an instant via Steam Web Chat as any saved account
#### `Inventory Management`

<div style="text-align: center;">
  <img src="/assets/VaporInventoryDemo.gif" text-align="center">
</div>

* View your in-game inventory for `TF2`, `CS:GO`, `Dota2` and other games at the click of a button

### Technicals
Vapor is developed in `TypeScript` using `ElectronJS` to produce the application for desktop. `ReactJS` and `TailwindCSS` has been integrated into the project to make frontend development easier.

There are several tools including `Babel` to compile `TypeScript` into plain `JavaScript` and `Webpack` to build the project into a development build that can be ran and tested locally.

<!-- Getting Started -->
## Getting Started

### Installation

#### `Stable`

You can download your system's respective installer (`.exe` for `Windows`, `.dmg` for `MacOSX`, and `.AppImage` for `Linux`) for the latest stable version in [Releases](https://github.com/HilliamT/Vapor-Authenticator/releases).

You can always install the latest version of the application here to replace your current version. Download the installer, delete your shortcut of the application and load the installer.

Unless it is stated explicitly that your previous config file containing account information is incompatible with the latest version (which a converter will be provided for), you will be able to access your accounts as normal after installation.

#### `Development`
You will need `node` and `npm` to run this project as a developer and build it from source.

1. Clone or download this project from GitHub and `cd` into the project directory.
This will install all necessary dependencies, including dev-dependencies, to allow you to build the project alongside install developer tools to make development easier.
3. Run `npm start` to build and bootup the app to ensure that it is working for you. You can exit using `Ctrl + C` once you have finished testing it.

## Roadmap

These planned features have been sourced from discussions with users and communities. Some may also be features that are missing from Vapor that exist in the current version of the Steam Mobile Authenticator app.

`*` - Provided by the existing Steam Mobile Authenticator App
#### `General`
* Export your secrets for other applications e.g trading bots
* Display all new Steam account notifications e.g gifts, new items `*`
* Remove logged accounts from the authenticator
#### `Trading`
* Notify you of new trades via a desktop notification
* Option to auto-accept all (incoming) trade confirmations
* Option to auto-accept all (incoming) market confirmations

## Contributing
You can read details on how to contribute [here](https://github.com/HilliamT/vapor-authenticator/blob/master/CONTRIBUTING.md).

## Contact

You can contact me on Steam [here](https://steamcommunity.com/profiles/76561198081082634/).
