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

const EndpointScrollContainer = styled.div(({theme}) => ({
  marginRight: `-${theme.spacing.standard}`,
  marginLeft: `-${theme.spacing.standard}`,
  height: 'calc(100vh - 250px)',
  overflowY: 'auto'
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
        <EndpointScrollContainer>
          {getUniqueEndpoints().map(endpoint => <Endpoint key={endpoint} path={endpoint} />)}
        </EndpointScrollContainer>
      </Container>
    )
  }
}

export default Endpoints
