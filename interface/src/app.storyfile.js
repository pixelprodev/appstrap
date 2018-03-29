import { storiesOf } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import Header from './Header'
import React from 'react'
import Tabs from './components/Tabs'
import VerticalNav from './components/VerticalNav'
import EndpointDetail from './components/EndpointDetail'

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
  .add('Endpoint Detail', () =>
    <EndpointDetail method='GET' endpoint='/loadInitialData' />
  )
