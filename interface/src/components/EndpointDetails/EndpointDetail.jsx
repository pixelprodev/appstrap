import { colors, Flex } from '../../styles'
import glamorous from 'glamorous'
import React from 'react'
import Button from '../Button'

const EndpointDetailContainer = glamorous(Flex)({
  padding: 20
})
const EndpointLabel = glamorous.div({
  width: '50%',
  fontSize: 16,
  padding: '5px 0',
  borderBottom: `1px solid ${colors.borderColor}`
}, ({method}) => {
  switch (method) {
    case 'GET': return { color: '#44C164' }
  }
})
const EndpointActions = glamorous(Flex)({ marginTop: 20 })
const VerticalDivider = glamorous.div({
  height: 25,
  width: 1,
  margin: '0 20px',
  borderRight: `1px solid ${colors.borderColor}`
})
const ToggleErrorButton = glamorous(Button)({ width: 155 })
const ToggleLatencyButton = glamorous(Button)({ width: 155, marginRight: 20 })
const LatencyMS = glamorous.input({
  height: 30,
  border: `1px solid ${colors.borderColor}`,
  borderRadius: 4,
  outline: 'none',
  width: 175,
  color: colors.text.greyDark,
  padding: '0 10px',
  fontWeight: 600
})

class EndpointDetail extends React.Component {
  render () {
    const { endpoint, method } = this.props
    return (
      <EndpointDetailContainer column>
        <EndpointLabel method={method}>{`${method} ${endpoint}`}</EndpointLabel>
        <EndpointActions center>
          <ToggleErrorButton>Return Error</ToggleErrorButton>
          <VerticalDivider />
          <ToggleLatencyButton>Simulate Latency</ToggleLatencyButton>
          <LatencyMS />
        </EndpointActions>
      </EndpointDetailContainer>
    )
  }
}

export default EndpointDetail
