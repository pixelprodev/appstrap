import { storiesOf } from '@storybook/react'
import Header from './'
import React from 'react'

storiesOf('Header', module)
  .add('main', () => <Header name={'Test Package Name'} version={'1.0.1'} />)
