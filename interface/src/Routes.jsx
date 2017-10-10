import { connect } from 'react-redux'
import { Flex } from './styles'
import glamorous from 'glamorous'
import React from 'react'
import VerticalNav from './components/VerticalNav'
import { Redirect } from 'react-router-dom'

const RoutesContainer = glamorous(Flex)({})

class Routes extends React.Component {
  render () {
    const { endpoint, routes } = this.props
    return (
      <RoutesContainer>
        <VerticalNav routes={routes}/>
        { !endpoint && routes && routes.length > 0 && <Redirect to={`/routes${routes[0].endpoint}`} /> }

      </RoutesContainer>
    )
  }
}

export const mapState = (state) => ({routes: state.routes})
export default connect(mapState)(Routes)
