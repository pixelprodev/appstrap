import glamorous from 'glamorous'
import colors from '../colors'

export const tabsTotalHeight = 40

export const TabContainer = glamorous.nav({
  display: 'flex',
  height: tabsTotalHeight,
  padding: '0 20px',
  borderLeft: `1px solid ${colors.borderColor}`,
  borderRight: `1px solid ${colors.borderColor}`,
  borderBottom: `1px solid ${colors.borderColor}`,
  background: 'white',
  ' a': {
    fontSize: 12,
    fontWeight: 600,
    color: colors.grey.light,
    display: 'block',
    lineHeight: '40px',
    padding: '0 10px',
    textDecoration: 'none',
    marginRight: 15,
    '&.active': {
      color: colors.grey.default,
      borderBottom: '2px solid #2A9EF5'
    }
  }
})
