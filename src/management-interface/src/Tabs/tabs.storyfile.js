import { storiesOf } from '@storybook/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import Tabs from './'

storiesOf('Tabs', module)
  .add('main', () =>
    <MemoryRouter initialEntries={['/endpoints']}>
      <Tabs />
    </MemoryRouter>)
