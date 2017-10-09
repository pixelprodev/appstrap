import React from 'react'
import { Flex } from './styles'
import glamorous from 'glamorous'
import VerticalNav from './components/VerticalNav'

const RoutesContainer = glamorous(Flex)({})

class Routes extends React.Component {
  render () {
    return (
      <RoutesContainer>
        <VerticalNav />
      </RoutesContainer>
    )
  }
}

export default Routes
