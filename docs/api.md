## Appstrap API

### (Constructor) Appstrap({options}) => Appstrap
Create an instance of an appstrap server.

Options:
|Property|Type|Purpose|Default|
|--|--|--|--|
|configPath|String|Specify a config path if your appstrap config is not located at `{projectRoot}/.appstrap/config.js`.  Expects a relative path from project root | `./.appstrap/config.js`
|port|Number|Specifies preferred port to start the server on.  If this port is already taken, a random port will be assigned instead.|5000|

#### Usage
```js
// Using defaults
const server = new Appstrap()

// With specified options
const server = new Appstrap({port: 3000, configPath: './_test/_testConfig/config.js'})
```

### Appstrap.start() => Promise
Starts your appstrap server

#### Usage
```js
await server.start()
```

### Appstrap.stop() => Promise
Stops your appstrap server

#### Usage
```js
await server.stop()
```

### Appstrap.reset() => undefined
Resets your appstrap server to the initial state it was in at startup.  

**Things that are reset**:
  - active modifiers
  - active presets

**Things that are NOT reset**:
  - endpoints
  - in memory state

#### Usage
```js
server.reset()
```


### Appstrap.setModifier({path, method, ...modifiers}) => undefined
Sets or unsets modifier(s) for an endpoint handler.  This allows you to toggle errors, set error codes, toggle latency simulation, and set latency delay.

Possible modifiers:

|Property|Type|Purpose|Default|
|--|--|--|--|
|error|Boolean|When true, endpoint will return an error when called|false|
|errorCode|Number| Specifies the type of http error code to return|500|
|latency|Boolean|When true, endpoint will pause before continuing|false|
|latencyMS|Number|Specifies number of miliseconds to wait when `latency` is true|0|

#### Usage
```js
// Enabling an error with an unauthorized error code
server.setModifier({path: '/', method: 'get', error: true, errorCode: 401})

// Enabling latency in a response
server.setModifier({path: '/', method: 'post', latency: true, latencyMS: 3000})
```
This behavior can also be affected with the management interface.  For more information, please follow [this link]()

## Presets
For a full explanation of presets and how they work, follow [this link](/docs/presets.md)

### Appstrap.loadPreset(name) => Promise
Activates a preset by name. The name must match a file located in the presets folder.

#### Usage
```js
await server.loadPreset('my-preset-name')
```

### Appstrap.loadPresets([presetnames]) => Promise
Activates a collection of presets by name in specified order.  Presets are evaluated from left to right.  

Properties in the first preset loaded will be overwritten by properties in the following presets if they have the same key.  Later presets' properties will similarly overwrite earlier ones.  

#### Usage
```js
await server.loadPresets(['preset-one', 'preset-two', 'preset-three'])
```

For a full explanation of presets and how they work, follow [this link](/docs/presets.md)