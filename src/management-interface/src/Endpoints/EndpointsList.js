import React from 'react'
import { NavLink } from 'react-router-dom'

class EndpointsList extends React.Component {
  render () {
    const { groupedEndpoints = [] } = this.props
    return (
      <aside>
        {groupedEndpoints.map(endpoint =>
          <NavLink
            exact
            key={endpoint.path}
            to={`/endpoints/${endpoint.group}`}
            isActive={(match, location) => location.pathname.endsWith(endpoint.group)}
            activeClassName={'active'}>{endpoint.path}</NavLink>
        )}
      </aside>
    )
  }
}

export default EndpointsList
