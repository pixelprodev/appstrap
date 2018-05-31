import React from 'react'
import glamorous from 'glamorous'
import { connect } from 'react-redux'
import colors from './colors'
import DebouncedInput from 'react-debounce-input'

const Label = glamorous.label({
  fontSize: 12,
  marginBottom: 3
})
const InputWrapper = glamorous.div({
  width: '100%',
  marginTop: 10,
  ' > input[type="text"]': {
    width: '100%',
    height: 30,
    borderRadius: 4,
    border: `1px solid ${colors.borderColor}`,
    padding: '0 10px',
    fontWeight: 500
  }
})

class LabeledInput extends React.Component {
  constructor () {
    super()
    this.onChange = this.onChange.bind(this)
  }

  onChange (e) {
    const { setModifier, property, method, path } = this.props
    setModifier({path, method, property, value: e.target.value})
  }

  render () {
    const { label, property, error, latency } = this.props
    if ((property === 'errorStatus' && !error) || (property === 'latencyMS' && !latency)) {
      return null
    }
    return (
      <InputWrapper>
        <Label>{label}</Label>
        <DebouncedInput debounceTimeout={750} onChange={this.onChange} value={this.props[property]} />
      </InputWrapper>
    )
  }
}

export const mapDispatch = (dispatch) => ({
  setModifier: (data) => dispatch({ type: 'SET_MODIFIER', ...{...data, toggle: false} })
})

export default connect(() => ({}), mapDispatch)(LabeledInput)
