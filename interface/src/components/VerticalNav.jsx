import { colors, Flex } from '../styles'
import { NavLink } from 'react-router-dom'
import glamorous from 'glamorous'
import React from 'react'

const VerticalNavContainer = glamorous(Flex)({
  width: 275,
  border: `1px solid ${colors.borderColor}`,
  ' a': {
    height: 40,
    width: '100%',
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
      borderRight: '2px solid #2A9EF5'
    },
    '&:not(:last-of-type)': {
      borderBottom: `1px solid ${colors.borderColor}`,
    }
  }
})

class VerticalNav extends React.Component {
  render () {
    const { routes = [] } = this.props
    return (
      <VerticalNavContainer column>
        {routes.map(({endpoint}) =>
          <NavLink to={`/routes${endpoint}`} activeClassName='active'>{endpoint}</NavLink>)
        }
      </VerticalNavContainer>
    )
  }
}

export default VerticalNav
