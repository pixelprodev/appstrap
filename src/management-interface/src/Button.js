import React from 'react'
import glamorous from 'glamorous'
import colors from './colors'

const StyledButton = glamorous.button({
  border: `1px solid ${colors.borderColor}`,
  outline: 'none',
  width: '100%',
  height: 30,
  borderRadius: 4,
  '&:hover': {
    cursor: 'pointer'
  },
  '.error-active': {
    background: 'red',
    color: 'white'
  },
  '.latency-active': {
    background: '#D4AC0D',
    color: 'white'
  }
})

class Button extends React.Component {
  render () {
    return (
      <StyledButton {...this.props}>{this.props.children}</StyledButton>
    )
  }
}

export default Button
