import glamorous from 'glamorous'
import colors from '../colors'

export const headerTotalHeight = 70

export const HeaderContainer = glamorous.header({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: headerTotalHeight,
  padding: '0 20px',
  borderTopLeftRadius: 5,
  borderTopRightRadius: 5,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  border: `1px solid ${colors.borderColor}`,
  background: 'white'
})

export const IconContainer = glamorous.div({
  display: 'flex',
  paddingRight: 15
})

export const AppDetailsContainer = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  justifyConten: 'center',
  ' svg': {
    height: 10,
    width: 'auto',
    marginRight: 5,
    fill: colors.grey.light
  },
  ' > div': {
    display: 'flex',
    alignItems: 'center'
  }
})

export const AppName = glamorous.span({
  fontWeight: 600,
  color: colors.grey.default,
  display: 'block',
  marginBottom: 5
})
export const AppVersion = glamorous.span({
  fontSize: 12,
  color: colors.grey.light,
  ':before': {
    content: 'v'
  }
})
