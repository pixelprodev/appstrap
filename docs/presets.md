## Presets

Presets exist to allow flexibility to override responses from the original handlers.

### Important things to know
1) **Naming is important**.
  The name of the file is also considered to be the preset name as far as the appstrap server is concerned.  When the preset is loaded, the string that is passed in must match that of the filename you intend to load.  The preset names displayed in the management UI are also based directly on the filename.
2) **Each preset file must export an array of preset objects**. This allows the creation of "scenarios" that  can override multiple endpoints to provide all of the necessary data that may be needed to replicate application state at a point in time.
3) **Preset modes are simple but powerful**.  Presets can be tailored to behave differently depending on how you want to override your data.  Whether you are looking for a complete replacement of the original response, or whether you would like to change just a couple of properties, presets can help you do it.
4) **Presets are composable**.  You can combine multiple preset files together to achieved the desired result without risk of duplicating payload data.  Active presets are evaluated in order of activation and updated everytime a load is performed.  This allows us to activate and deactivate presets at will and have predictable results to test against.

### Preset file format
Below is a simple preset that affects only one path.  If you would like your preset to affect other paths, such as `/test` or `/test/foo`, add an additional object to the array following the same format.
```js
module.exports = [
  {
    path: '/',
    mode: 'merge',
    get: {
      zip: 'zow'
    }
  }
]
```

### Preset modes
As you implement presets into your scenarios, you'll quickly learn adaptation is key.  The more flexible your tests are, the more productive you will be.  Presets have been given the ability to either replace payloads alltogether, or modify the base response to change behavior.

#### merge
Properties in the response object will be overwritten by properties in the preset object if they have the same key. It works the same way as `Object.assign`

#### replace
Instead of combining properties with the base response, as the name suggests, the response is replaced by the preset payload instead.

#### Mixing modes
Consider the following presets:
```js
// preset-one.js
module.exports = [{
  path: '/',
  mode: 'merge',
  get: {
    foo: 'bar'
  }
}]

// preset-two.js
module.exports = [{
  path: '/',
  mode: 'replace',
  get: {
    zip: 'zap',
    whiz: 'bang'
  }
}]

// preset-three.js
module.exports = [{
  path: '/',
  mode: 'merge',
  get: {
    pow: 'wow',
    whiz: 'flop',
    jump: 'jam'
  }
}]
```

The result of `await server.loadPresets(['preset-one', 'preset-two', 'preset-three])` will be 
```js
{zip: 'zap', whiz: 'flop', pow: 'wow', jump: 'jam'}
```
This is because `preset-two` had a mode of replace.  This negates `preset-one` and it is totally replaced.  Since `preset-three` has a mode of merge, it is then combined with `preset-two` and duplicate keys are overridden.
