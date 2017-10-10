import { Flex, colors } from './styles'
import glamorous from 'glamorous'
import AppIcon from './icons/AppIcon'
import React from 'react'
import Tag from './icons/Tag'
import Button from './components/Button'

const HeaderContainer = glamorous(Flex)({
  height: 80,
  padding: 20,
  borderBottom: `1px solid ${colors.borderColor}`,
  justifyContent: 'space-between'
})
const AppDetails = glamorous(Flex)({marginLeft: 30})
const AppName = glamorous.span({
  color: colors.text.greyDark,
  fontWeight: 600,
  display: 'block',
  marginBottom: 5
})
const AppVersion = glamorous(Flex)({
  color: colors.text.greyMedium,
  fontSize: 12,
  ' svg': {
    width: 10,
    height: 10,
    fill: colors.text.greyMedium,
    marginRight: 5
  }
})

const ReloadConfigButton = glamorous(Button)({ width: 155 })

const Header = ({appName, appVersion}) =>
  <HeaderContainer center>
    <Flex center>
      <AppIcon />
      <AppDetails column>
        <AppName>{appName}</AppName>
        <AppVersion center>
          <Tag />
          {appVersion}
        </AppVersion>
      </AppDetails>
    </Flex>
    <ReloadConfigButton onClick={() => console.log('clicked')}>Reload Global Config</ReloadConfigButton>
  </HeaderContainer>

export default Header
