import React from 'react'
import styled from 'react-emotion'
import managementContext from '../context'
import Endpoint from './Endpoint'
import EndpointFilter from './EndpointFilter'

const Container = styled.div(({theme}) => ({
  flexBasis: '60%',
  padding: theme.spacing.standard,
  borderRight: `1px solid ${theme.border.color}`
}))

const TitleBox = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 50,
  marginBottom: theme.spacing.standard,
  ' > h1': {
    margin: 0,
    fontSize: 24,
    fontWeight: 700
  }
}))

@managementContext
class Endpoints extends React.Component {
  render () {
    const { getUniqueEndpoints } = this.props
    return (
      <Container>
        <TitleBox>
          <h1>Endpoints</h1>
          <EndpointFilter />
        </TitleBox>
        {getUniqueEndpoints().map(endpoint => <Endpoint key={endpoint} path={endpoint} />)}
      </Container>
    )
  }
}

export default Endpoints
