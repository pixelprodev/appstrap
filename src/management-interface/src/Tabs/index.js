import React from 'react'
import { NavLink } from 'react-router-dom'
import { TabContainer } from './tabStyles'

class Tabs extends React.Component {
  render () {
    return (
      <TabContainer>
        <NavLink to='/presets' activeClassName='active'>Preset Configurations</NavLink>
        <NavLink to='/endpoints' activeClassName='active'>Endpoints</NavLink>
      </TabContainer>
    )
  }
}

export default Tabs
