import PropTypes from 'prop-types'
import React from 'react'
import styled from 'react-emotion'

const Container = styled.div(({ _align = 'flex-start', _width = '100%' }) => ({
  width: _width,
  flexShrink: 0,
  flexWrap: 'wrap',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: _align,
  color: '#7F8FA4',
  fontSize: 11,
  fontWeight: 600,
  justifyContent: 'center',
  ' > svg': {
    fill: '#7F8FA4'
  }
}))

class HeaderCell extends React.Component {
  render () {
    const { content, align, width } = this.props
    return (
      <Container _align={align} _width={width}>
        {content}
      </Container>
    )
  }
}

export default HeaderCell
