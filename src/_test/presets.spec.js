const Appstrap = require('../Appstrap')
const callService = require('./callService')
const path = require('path')
const furiousFrog = require('./_testConfig/presets/furious-frog')
const laughingLeopard = require('./_testConfig/presets/laughing-leopard')
const leapingDolphin = require('./_testConfig/presets/leaping-dolphin')
const curiousCoyote = require('./_testConfig/presets/curious-coyote')

describe('Preset influenced responses', () => {
  describe('Multiple presets applied - ordering', () => {
    // m = merge, r = replace, dm = deep merge

    test('combined combos with m + m + m end up as m<-m<-m', async () => {
      const srv = new Appstrap({ useDirectory: path.join(__dirname, '_testConfig') })
      await srv.start()
      const baseResponse = await callService('GET', `${srv.address}`)
      srv.activatePresets(['furious-frog', 'laughing-leopard', 'curious-coyote'])

      const desiredPath = '/'
      const furiousFrogPayload = furiousFrog.find(endpoint => endpoint.path = desiredPath).get
      const laughingLeopardPayload = laughingLeopard.find(endpoint => endpoint.path = desiredPath).get
      const curiousCoyotePayload = curiousCoyote.find(endpoint => endpoint.path = desiredPath).get

      const result = await callService('GET', `${srv.address}`)
      expect(result).toEqual(
        Object.assign({}, baseResponse, furiousFrogPayload, laughingLeopardPayload, curiousCoyotePayload)
      )
      await srv.stop()
    })

    test('combined combos with m + r + m end up as r<-m', async () => {
      const srv = new Appstrap({ useDirectory: path.join(__dirname, '_testConfig') })
      await srv.start()
      const baseResponse = await callService('GET', `${srv.address}`)
      srv.activatePresets(['furious-frog', 'leaping-dolphin', 'curious-coyote'])

      const desiredPath = '/'
      const leapingDolphinPayload = leapingDolphin.find(endpoint => endpoint.path = desiredPath).get
      const curiousCoyotePayload = curiousCoyote.find(endpoint => endpoint.path = desiredPath).get

      const result = await callService('GET', `${srv.address}`)
      expect(result).toEqual(
        Object.assign({}, baseResponse, leapingDolphinPayload, curiousCoyotePayload)
      )
      await srv.stop()
    })

    test('combined combos with m + m + r end up as r', async () => {
      const srv = new Appstrap({ useDirectory: path.join(__dirname, '_testConfig') })
      await srv.start()
      srv.activatePresets(['furious-frog', 'curious-coyote', 'leaping-dolphin'])

      const desiredPath = '/'
      const leapingDolphinPayload = leapingDolphin.find(endpoint => endpoint.path = desiredPath).get

      const result = await callService('GET', `${srv.address}`)
      expect(result).toEqual(leapingDolphinPayload)
      await srv.stop()
    })
  })
})
