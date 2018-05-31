import React from 'react'
import { connect } from 'react-redux'
import AppIcon from '../icons/ApppIcon'
import TagIcon from '../icons/TagIcon'
import { AppDetailsContainer, AppName, AppVersion, HeaderContainer, IconContainer } from './headerStyles'

class Header extends React.Component {
  render () {
    const { name = '', version = '' } = this.props
    return (
      <HeaderContainer>
        <IconContainer>
          <AppIcon />
        </IconContainer>
        <AppDetailsContainer>
          <AppName>{name}</AppName>
          <div>
            <TagIcon />
            <AppVersion>{version}</AppVersion>
          </div>
        </AppDetailsContainer>
      </HeaderContainer>
    )
  }
}

export const getState = (store) => ({
  name: store.name,
  version: store.version
})

export default connect(getState)(Header)
