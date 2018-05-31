import glamorous from 'glamorous'
import colors from '../colors'
import { headerTotalHeight } from '../Header/headerStyles'
import { tabsTotalHeight } from '../Tabs/tabStyles'

export const EndpointsContainer = glamorous.section({
  display: 'flex',
  height: `calc(100vh - ${headerTotalHeight + tabsTotalHeight}px)`,
  width: '100%',
  border: `1px solid ${colors.borderColor}`,
  ' aside': {
    width: '33%',
    maxWidth: 275,
    background: 'white',
    borderRight: `1px solid ${colors.borderColor}`,
    ' a': {
      display: 'flex',
      width: '100%',
      height: 40,
      fontWeight: 600,
      textDecoration: 'none',
      alignItems: 'center',
      color: colors.grey.light,
      padding: '0 15px',
      borderBottom: `1px solid ${colors.borderColor}`,
      '&.active': {
        color: colors.grey.default,
        borderRight: '2px solid #2A9EF5'
      }
    }
  }
})
