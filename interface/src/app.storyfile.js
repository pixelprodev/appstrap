import { storiesOf } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import Header from './Header'
import React from 'react'
import Tabs from './components/Tabs'

storiesOf('Frame', module)
  .add('Header', () => <Header />)

storiesOf('Tabs', module)
  .add('presets', () =>
    <MemoryRouter initialEntries={['/presets']}>
      <Tabs />
    </MemoryRouter>
  )
