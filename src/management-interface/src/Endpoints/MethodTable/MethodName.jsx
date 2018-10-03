/* eslint-disable indent */
import React from 'react'
import styled from 'react-emotion'

const Method = styled.span(({ methodType }) => ({
  textTransform: 'uppercase',
  fontSize: 14,
  fontWeight: 900,
  color: methodType === 'get'
       ? '#44C164'
       : methodType === 'post'
       ? '#2A9EF5'
       : methodType === 'put'
       ? '#A28D00'
       : methodType === 'patch'
       ? '#FF6812'
       : methodType === 'delete'
       ? '#FF0A19'
       : null
}))

class MethodName extends React.Component {
  render () {
    const { type } = this.props
    return <Method methodType={type}>{type}</Method>
  }
}

export default MethodName
