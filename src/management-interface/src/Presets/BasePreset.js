import React from 'react'
import glamorous from 'glamorous'
import { connect } from 'react-redux'
import colors from '../colors'

const Container = glamorous.div({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 2rem',
  background: 'white',
  height: 50,
  border: `1px solid ${colors.borderColor}`
}, ({isActive}) => {
  let obj = {}
  if (isActive) {
    obj = {
      background: '#36AF47',
      ' > span': {
        color: 'white',
        fontWeight: 700
      }
    }
  }
  return obj
})

const Name = glamorous.span({
  textTransform: 'uppercase',
  fontSize: 12,
  color: colors.grey.light
})

const Button = glamorous.button({
  height: 20,
  border: `1px solid ${colors.borderColor}`,
  borderRadius: 4,
  padding: '0 1rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer'
})

class BasePreset extends React.Component {
  render () {
    const { name, isActive, togglePresetActive } = this.props
    return (
      <Container isActive={isActive}>
        <Name>{name}</Name>
        <Button
          isActive={isActive}
          onClick={() => togglePresetActive(name)}
        >
          {isActive ? 'Deactivate' : 'Activate'}
        </Button>
      </Container>
    )
  }
}

const mapDispatch = (dispatch) => ({
  togglePresetActive: (name) => dispatch({type: 'TOGGLE_PRESET_ACTIVE', name})
})

export default connect(() => ({}), mapDispatch)(BasePreset)
