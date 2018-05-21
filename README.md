# Appstrap

Appstrap is an interactive tool for REST api mocking.  It is powered by node.js and express.

Driven by a simple but powerful configuration, your mock api can adapt its complexity to the needs of your application.  From a single endpoint that responds with a simple json payload, to an in-depth set of functions that provide a realistic stand-in for your production server - you can do it with appstrap.

Appstrap's mission:
  - Isolate applications or services at their REST boundaries
  - Ensure easy reproduction of bugs in local from other environment sources
  - Ensure higher code quality before the code even hits your ci/cd pipeline
  - Eliminate reliance on other services/tiers to be in place

As in all good things, Appstrap was born from necessity.  I often found myself spending more time setting up data, waiting on unreliable environments, or even waiting on other services to be ready than I spent developing my code. 

I wanted something that was dead simple to use, could effectively mock any external service without my app knowing the difference, and something that would help make my integration tests easy to transition to qa and production.

Previous attempts to solve this problem included creating a bunch of json files for "fake" data to inject.  Although it was servicable for getting data back from a service, it did nothing in terms of interaction between a service.  I found I was pushing bugs into qa that had more to do about what happens after I interact with a service than anything else.  Something had to change.

With Appstrap, all data can now be mocked on the fly.  Changes as a result of a service interaction are now reflected the next time data is retrieved.  The same integration tests we run against qa and production can run right along side of my unit tests.  Life is better with Appstrap.  Follow the getting started guide below to use Appstrap in your project today!


## Getting started

### Install via NPM
```
npm install --save-dev @pixelprodotco/appstrap
```
### Set up your config file
At the root of your project, run the following command
```
appstrap init
```
After answering the prompts, a new configuration file will be created for you.

If you prefer to make your own config file instead, you may do so.  When the server is started, it looks for the config at`.appstrap/config.js` relative to the root of your project directory.  This can be overridden by invoking the appstrap constructor with the property `configPath: './your/path/here'` or via command line with `-c ./your/path/here`

The table below illustrates the building blocks of a config file.

|Property|Type|Purpose| |
|---|---|---|---|
|bundle|Object|If you are developing a single page application, by specifying a bundle, the server will add the necessary logic to serve the single page app and enable client side routing. |(optional)|
|initialState|Object|When the server is started, req.state will be set to an empty object - {} -  by default.  Override that behavior and prime in some initial state here.|(optional)|
|assets|Array|Any folders that contain static files that may be requested from your server should be declared here. If you arent serving any static files, provide an empty array.|required|
|endpoints|Array|Specify a collection of endpoints here.  These will be used to respond to requests passed to your server.  Each handler shares an identical signature to express route handlers.|required|

For detailed information about the configuration setup, follow [this link](./docs/config.md)

### Add a start script to your package json
```
"scripts": {
  ...
  "appstrap": "appstrap start"
  ...
}
```

### Launch!
```
npm run appstrap
```
This will start your server and assign a port.  By default, 5000 is preferred, however you may override this by passing the `-p 3000` argument into your startup script.  If the port is already taken, Appstrap will automatically find an open port and bind to it instead.  You may now access your server.

#### Don't forget about the management ui!
When your server is created via `appstrap start`, a mangement interface is also created for you.  This interface is accessible via `appstrap.localhost:{yourport}` - with `yourport` being the same port that we bound your server to.

From here, you can toggle errors, simulate latency, and even load/unload presets.  More information on the management ui can be found [here](https://www.github.com/pixelprodotco/appstrap-management-interface)


## API reference
For api documentation follow [this link](/docs/api.md).

## Features
### Error Mocking
### Latency Mocking
### Presets
### Headless Mode