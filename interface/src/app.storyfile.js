import { storiesOf } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import Header from './Header'
import React from 'react'
import Tabs from './components/Tabs'
import VerticalNav from './components/VerticalNav'

const routes = [
  {endpoint: '/loadInitialData'},
  {endpoint: '/loadSecondaryData'},
  {endpoint: '/loadAlternateData'}
]

storiesOf('Frame', module)
  .add('Header', () => <Header />)
  .add('Tabs', () =>
    <MemoryRouter initialEntries={['/presets']}>
      <Tabs />
    </MemoryRouter>
  )
  .add('Vertical Navigation', () =>
    <MemoryRouter initialEntries={['/routes']}>
      <VerticalNav routes={routes} />
    </MemoryRouter>
  )
