import React from 'react'
import styled from 'react-emotion'

const Container = styled.div(({ theme, gridColumns }) => ({
  label: 'thead',
  display: 'grid',
  gridTemplateColumns: gridColumns.join(' '),
  gridTemplateRows: '25px',
  alignItems: 'center',
  padding: `0 ${theme.spacing.standard}`
}))

class THeader extends React.Component {
  render () {
    const { children } = this.props
    return (
      <Container gridColumns={children.map(cell => `${cell.props.width || '1fr'}`)}>
        {children}
      </Container>
    )
  }
}

export default THeader
