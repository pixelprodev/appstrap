import { colors, Flex } from '../styles'
import { NavLink } from 'react-router-dom'
import glamorous from 'glamorous'
import React from 'react'

const TabContainer = glamorous(Flex)({
  height: 40,
  padding: '0 20px',
  borderBottom: `1px solid ${colors.borderColor}`,
  ' a': {
    fontSize: 12,
    fontWeight: 600,
    color: colors.text.greyMedium,
    display: 'block',
    lineHeight: '40px',
    padding: '0 10px',
    textDecoration: 'none',
    marginRight: 15,
    '&.active': {
      color: colors.text.greyDark,
      borderBottom: '2px solid #2A9EF5'
    }
  }
})

class Tabs extends React.Component {
  render () {
    return (
      <TabContainer>
        <NavLink to='/presets' activeClassName='active'>Preset Configurations</NavLink>
        <NavLink to='/routes' activeClassName='active'>Routes</NavLink>
      </TabContainer>
    )
  }
}

export default Tabs
