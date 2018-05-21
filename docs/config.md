## Config

### bundle - [Object] - (optional)

By specifying a bundle in your configuration, appstrap will enable the behavior needed to facilitate the serving of a single page app as well as client side routing.  In order to do so, you must declare the entry js file to your client side application.  In addition, the css selector for the dom element expected by your single page application is needed to ensure that element exists.

|Property|Type|Purpose| |
|--|--|--|--|
|webPath|String|Sets the `src` attribute of the script tag used to load the main js file for your single page application|required|
|host|String|Assigns id or class to an element in the dom so the single page application finds a valid target to render into|required|

#### Usage
Add this line to your config file, substituting your own path and host.
```js
bundle: {webPath: '/dist/main.js', host: '#container'},
```
This will result in the generation of an html file like this
```html
<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Appstrap</title>
  </head>
  <body>
    <div id="container"></div>
    <script src="/dist/main.js" type="text/javascript"></script>
  </body>
</html>
```

### initialState - [Object] - (optional)
As your server is started, an in-memory state is created.  This state persists for as long as your server is running.

You may access this object within any of your handlers at `req.state`.  Feel free to update it directly with any changes during post/put/delete requests etc.

If you would like to set this value initially at startup, set `initialState` to any object value and it will be preloaded for you.

#### Usage
```js
// example config.js
module.exports = {
  initialState: {
    foo: 'bar',
    zip: 'zam'
  }
  assets: [],
  endpoints: [{
    path: '/',
    get: (req, res) => {
      console.log(req.state) // => {foo: 'bar', zip: 'zam'}
      res.sendStatus(200)
    }
  }] 
}
```

### assets - [Object Array] - (required)
Does your application require static assets?  Images, fonts, js files, css stylesheets are all examples here. By specifying the folder(s) where these are located, appstrap will wrap them with express.static middleware so you may use them in your application.

|Property|Type|Purpose| |
|--|--|--|--|
|webPath|String|Indicates the subfolder a webrequest should call to reach an asset.  Mapped to a directory on the local filesystem at `directory`|required|
|directory|String|Folder location on the filesystem to map the `webPath` to.  Specified relative to the project root directory.|required|

#### Usage 
config:
```js
assets: [{webPath: '/assets', directory: '/dist'}]
```
project directory:
```
dist
  - bundle.js
  - image.png
src
...
package.json
```
You may now access bundle js at the following address:
```html
<script src='/assets/bundle.js'></script>
```

### endpoints - [Object Array] - (required)
Endpoints is a collection of objects that maps paths (or urls) to response handlers.  Each function defined should match the signature of an express route handler.

|Property|Type|Purpose| |
|--|--|--|--|
|path|String|Specifies url path for defined handlers to bind to|required|
|get|Function|Function handler that responds to http GET `path`|optional|
|put|Function|Function handler that responds to http PUT `path`|optional|
|post|Function|Function handler that responds to http POST `path`|optional|
|patch|Function|Function handler that responds to http PATCH `path`|optional|
|delete|Function|Function handler that responds to http DELETE `path`|optional|

#### Usage 
```js
endpoints: [
  {
    path: '/',
    get: (req, res) => {
      res.json({foo: 'bar'})
    }
  },
  {
    path: '/test',
    get: (req, res) => {
      res.json({test: 'test'})
    }
  }
]
```