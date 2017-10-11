import { colors, Flex } from '../../styles'
import glamorous from 'glamorous'
import React from 'react'
import Button from '../Button'
import { connect } from 'react-redux'

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
    case 'POST': return { color: '#2A9EF5' }
  }
})
const EndpointActions = glamorous(Flex)({ marginTop: 20 })
const VerticalDivider = glamorous.div({
  height: 25,
  width: 1,
  margin: '0 20px',
  borderRight: `1px solid ${colors.borderColor}`
})
const ToggleErrorButton = glamorous(Button)({
  width: 155,
  '.active':{
    background: 'red',
    color: '#ffffff'
  }
})
const ToggleLatencyButton = glamorous(Button)({
  width: 155,
  marginRight: 20,
  '.active':{
    background: '#D4AC0D',
    color: '#ffffff'
  }
})
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
    const { endpoint, error, latency, latencyMS, method, toggleError, toggleLatency, setLatencyMS } = this.props
    return (
      <EndpointDetailContainer column>
        <EndpointLabel method={method}>{`${method} ${endpoint}`}</EndpointLabel>
        <EndpointActions center>
          <ToggleErrorButton
            className={error ? 'active' : null }
            onClick={() => toggleError()}>
            Return Error
          </ToggleErrorButton>
          <VerticalDivider />
          <ToggleLatencyButton
            className={latency ? 'active' : null }
            onClick={() => toggleLatency()}>
            Simulate Latency
          </ToggleLatencyButton>
          {latency &&
            <LatencyMS value={latencyMS} onChange={(e) => setLatencyMS(e.target.value)}/>
          }
        </EndpointActions>
      </EndpointDetailContainer>
    )
  }
}

export const mapState = (state) => ({})
export const mapDispatch = (dispatch, {method}) => ({
  toggleError: () => dispatch({type: 'SET_ROUTE_MODIFIER', op: 'toggle', property: 'error', method}),
  toggleLatency: () => dispatch({type: 'SET_ROUTE_MODIFIER', op: 'toggle', property: 'latency', method}),
  setLatencyMS: (value) => dispatch({type: 'SET_ROUTE_MODIFIER', op: 'set', property: 'latencyMS', value, method}),
})
export default connect(mapState, mapDispatch)(EndpointDetail)
