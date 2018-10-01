import React from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'

const CellContainer = styled.div(({ _align = 'flex-start' }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: _align,
  fontSize: 14,
  fontWeight: 600,
  color: '#354052'
}))

class Cell extends React.Component {
  render () {
    const { children, position, align } = this.props
    return (
      <CellContainer _align={align} position={position}>{children}</CellContainer>
    )
  }
}

export default Cell
