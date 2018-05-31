import React from 'react'
import { EndpointDetailsContainer } from './endpointDetailsStyles'
import EndpointHandler from './EndpointHandler'
import { withRouter } from 'react-router-dom'

class EndpointDetails extends React.Component {
  render () {
    const { endpoints, match: {params: {group}} } = this.props
    const matchingEndpoints = endpoints.filter(endpoint => endpoint.group === +group)
    return (
      <EndpointDetailsContainer>
        {matchingEndpoints.map(endpoint =>
          <EndpointHandler key={`${endpoint.path}::${endpoint.method}`} {...endpoint} />
        )}
      </EndpointDetailsContainer>
    )
  }
}

export default withRouter(EndpointDetails)
