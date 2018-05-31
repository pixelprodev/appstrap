import React from 'react'
import { connect } from 'react-redux'
import EndpointDetails from './EndpointDetails'
import EndpointsList from './EndpointsList'
import { EndpointsContainer } from './endpointsStyles'

class Endpoints extends React.Component {
  render () {
    const { endpoints = [] } = this.props
    const uniqueEndpoints = new Set()
    endpoints.forEach(endpoint => uniqueEndpoints.add(`${endpoint.path}::${endpoint.group}`))
    const groupedEndpoints = Array.from(uniqueEndpoints).map(row =>
      ({path: row.split('::')[0], group: row.split('::')[1]})
    )
    return (
      <EndpointsContainer>
        <EndpointsList groupedEndpoints={groupedEndpoints} />
        <EndpointDetails endpoints={endpoints} />
      </EndpointsContainer>
    )
  }
}

export const mapState = (store) => ({
  endpoints: store.endpoints
})

export default connect(mapState)(Endpoints)
