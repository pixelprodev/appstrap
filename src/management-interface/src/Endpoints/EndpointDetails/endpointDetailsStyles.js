import glamorous from 'glamorous'
import colors from '../../colors'

export const EndpointDetailsContainer = glamorous.section({
  flexGrow: 1,
  padding: 20,
  background: '#FAFBFC'
})

export const EndpointHandlerContainer = glamorous.section({
  marginBottom: '2rem'
})

export const Label = glamorous.div({
  fontSize: 16,
  padding: '5px 0',
  maxWidth: '50%',
  borderBottom: `1px solid ${colors.borderColor}`
}, ({method}) => {
  switch (method) {
    case 'get': return { color: '#44C164' }
    case 'post': return { color: '#2A9EF5' }
    case 'put': return { color: '#A28D00' }
    case 'patch': return { color: '#FF6812' }
    case 'delete': return { color: '#FF0A19' }
  }
})

export const Buttons = glamorous.div({
  display: 'flex',
  marginTop: '1rem'
})

const BaseBlock = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  width: 150
})
export const ErrorBlock = glamorous(BaseBlock)({})
export const LatencyBlock = glamorous(BaseBlock)({})

export const BlockDivider = glamorous.div({
  height: 28,
  margin: '0 20px',
  borderRight: `1px solid ${colors.borderColor}`
})
