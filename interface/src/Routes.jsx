import { connect } from 'react-redux'
import { Flex } from './styles'
import glamorous from 'glamorous'
import React from 'react'
import VerticalNav from './components/VerticalNav'

const RoutesContainer = glamorous(Flex)({})

class Routes extends React.Component {
  render () {
    const { routes } = this.props
    return (
      <RoutesContainer>
        <VerticalNav routes={routes}/>
      </RoutesContainer>
    )
  }
}

export const mapState = (state) => ({routes: state.routes})
export default connect(mapState)(Routes)
