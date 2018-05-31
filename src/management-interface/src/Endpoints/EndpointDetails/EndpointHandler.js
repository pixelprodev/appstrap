import React from 'react'
import { connect } from 'react-redux'
import Button from '../../Button'
import LabeledInput from '../../LabeledInput'
import {
  BlockDivider,
  Buttons,
  EndpointHandlerContainer,
  ErrorBlock,
  Label,
  LatencyBlock
} from './endpointDetailsStyles'

class EndpointHandler extends React.Component {
  constructor () {
    super()
    this.toggle = this.toggle.bind(this)
  }

  toggle (type) {
    this.props.toggleModifier(type)
  }

  render () {
    const { path, method, error, latency } = this.props
    return (
      <EndpointHandlerContainer>
        <Label method={method}>{`${method.toUpperCase()} ${path}`}</Label>
        <Buttons>
          <ErrorBlock>
            <Button
              onClick={() => this.toggle('error')}
              className={error ? 'error-active' : null}>
              Return Error
            </Button>
            <LabeledInput label={'Error Code'} property={'errorStatus'} {...this.props} />
          </ErrorBlock>
          <BlockDivider />
          <LatencyBlock>
            <Button
              onClick={() => this.toggle('latency')}
              className={latency ? 'latency-active' : null}>
              Simulate Latency
            </Button>
            <LabeledInput label={'Latency MS'} property={'latencyMS'} {...this.props} />
          </LatencyBlock>
        </Buttons>
      </EndpointHandlerContainer>
    )
  }
}

export const mapDispatch = (dispatch, {path, method}) => ({
  toggleModifier: (type) => dispatch({type: 'SET_MODIFIER', property: type, path, method})
})

export default connect(() => ({}), mapDispatch)(EndpointHandler)
