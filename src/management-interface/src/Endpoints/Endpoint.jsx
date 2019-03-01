import React from 'react'
import styled from 'react-emotion'
import MethodTable from './MethodTable'
import managementContext from '../context'

const Container = styled.div(({theme}) => ({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: theme.spacing.standard
}))

const PathBlock = styled.div(({theme}) => ({
  padding: `${theme.spacing.thin} ${theme.spacing.standard}`,
  borderBottom: `1px solid ${theme.border.color}`,
  ' > span': {
    display: 'inline-block',
    fontSize: 16,
    fontWeight: 700
  }
}))

@managementContext
class Endpoint extends React.Component {
  render () {
    const { path, endpoints } = this.props
    const methods = endpoints.filter(endpoint => endpoint.path === path)
    return (
      <Container>
        <PathBlock>
          <span>{path}</span>
        </PathBlock>
        <MethodTable collection={methods} />
      </Container>
    )
  }
}

export default Endpoint
