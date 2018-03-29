import { colors, Flex } from '../styles'
import glamorous from 'glamorous'
import React from 'react'
import { connect } from 'react-redux'

const VerticalNavContainer = glamorous(Flex)({
  width: 275,
  border: `1px solid ${colors.borderColor}`,
  ' div': {
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
      borderBottom: `1px solid ${colors.borderColor}`
    }
  }
})

class VerticalNav extends React.Component {
  render () {
    const { routes = [], activeRoute } = this.props
    return (
      <VerticalNavContainer column>
        {routes.map(({endpoint}, indx) =>
          <div
            key={endpoint}
            className={activeRoute === indx ? 'active' : null}
            onClick={() => this.props.setActiveRoute(indx)}>
            {endpoint}
          </div>
        )}
      </VerticalNavContainer>
    )
  }
}

export const mapState = (state) => ({activeRoute: state.activeRoute})
export const mapDispatch = (dispatch) => ({
  setActiveRoute: (indx) => dispatch({type: 'SET_ACTIVE_ROUTE', activeRoute: indx})
})
export default connect(mapState, mapDispatch)(VerticalNav)
