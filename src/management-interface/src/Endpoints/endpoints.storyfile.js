import { storiesOf } from '@storybook/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import Endpoints from './'

const endpoints = [
  { path: '/endpointOne',
    method: 'get',
    handler: () => {},
    error: false,
    errorCode: 500,
    latency: false,
    latencyMS: 0 },
  { path: '/endpointOne',
    method: 'post',
    handler: () => {},
    error: false,
    errorCode: 500,
    latency: false,
    latencyMS: 0 },
  { path: '/endpointTwo',
    method: 'get',
    handler: () => {},
    error: true,
    errorCode: 500,
    latency: false,
    latencyMS: 0 },
  { path: '/endpointTwo',
    method: 'post',
    handler: () => {},
    error: false,
    errorCode: 500,
    latency: true,
    latencyMS: 0 },
  { path: '/endpointThree',
    method: 'get',
    handler: () => {},
    error: false,
    errorCode: 500,
    latency: false,
    latencyMS: 0 }
]

storiesOf('Endpoints', module)
  .add('main', () =>
    <MemoryRouter initialEntries={['/endpoints/endpointTwo']}>
      <Endpoints endpoints={endpoints} />
    </MemoryRouter>)
