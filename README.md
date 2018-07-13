InsurChain-UI
============

This is a light wallet that connects to a Graphene based API server such as the InsurChain *witness_node* executable.

It *stores all keys locally* in the browser, *never exposing your keys to anyone* as it signs transactions locally before transmitting them to the API server which then broadcasts them to the blockchain network. The wallet is encrypted with a password of your choosing and encrypted in a browser database.

### Getting started

InsurChain-UI depends node Node.js, and version 6+ is required. It has not yet been tested with v7.

On Ubuntu and OSX, the easiest way to install Node is to use the [Node Version Manager](https://github.com/creationix/nvm).

To install NVM for Linux/OSX, simply copy paste the following in a terminal:
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.30.2/install.sh | bash
nvm install v6
nvm use v6
```

Once you have Node installed, you can clone the repo:
```
git clone git@github.com:InsurChain/insur-wallet-ui.git
cd graphene-ui
```

Before launching the GUI you will need to install the npm packages for each subdirectory:
```
cd web
npm install
```

## Running the dev server

The dev server uses Express in combination with Wepback 2.

Once all the packages have been installed you can start the development server by going to the `web` folder and running:
```
npm start
```

Once the compilation is done the GUI will be available in your browser at: `localhost:8080` or `127.0.0.1:8080`. Hot Reloading is enabled so the browser will live update as you edit the source files.


## Production
If you'd like to host your own wallet somewhere, you should create a production build and host it using NGINX or Apache. In order to create a prod bundle, simply run the following command:
```
npm run build
```
This will create a bundle in the /dist folder that can be hosted with the web server of your choice.

### Installable wallets
We use Electron to provide installable wallets, available for Windows, OSX and Linux Debian platforms such as Ubuntu. First, install the required packages in the `electron` folder. Then go to the `web` folder and run `npm run electron`. This will compile the UI with some special modifications for use with Electron, and copy the result to the root `electron/build` folder. Now go back to the `electron` folder and run `npm run release` in order to build a wallet for your platform. 

## Contributing
InsurChain-UI is open source and anyone is free to contribute,and it is based on Graphene-UI.


### Coding style guideline

Our style guideline is based on 'Airbnb JavaScript Style Guide' (https://github.com/airbnb/javascript), with few exceptions:

- Strings are double quoted
- Additional trailing comma (in arrays and objects declaration) is optional
- 4 spaces tabs
- Spaces inside curly braces are optional

We strongly encourage to use _eslint_ to make sure the code adhere to our style guidelines.

