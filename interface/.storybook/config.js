import 'babel-polyfill'
import { configure } from '@storybook/react'
import { css } from 'glamor'

css.global('*, *:before, *:after', {
  fontFamily: 'proxima-nova',
  fontStyle: 'normal',
  boxSizing: 'border-box'
})

const req = require.context('../src', true, /\.storyfile\.js$/)

function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module)
