import React from 'react'
import { connect } from 'react-redux'
import { selActiveRoute } from '../../state/selectors'
import EndpointDetail from './EndpointDetail'

class EndpointDetails extends React.Component {
  render () {
    const { activeRoute: {handlers, endpoint} } = this.props
    return (
      <div>
        {handlers.map(handler =>
          <EndpointDetail key={`${endpoint}::${handler.method}`} endpoint={endpoint} {...handler} />
        )}
      </div>
    )
  }
}

export const mapState = (state) => ({activeRoute: selActiveRoute(state)})
export default connect(mapState)(EndpointDetails)
