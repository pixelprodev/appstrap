import React from 'react'
import styled from 'react-emotion'
import managementContext from '../../context'

const Button = styled.button(({property, active}) => ({
  cursor: 'pointer',
  height: 20,
  minWidth: 75,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textTransform: 'uppercase',
  fontSize: 10,
  fontWeight: 600,
  border: 'none',
  padding: 0,
  outline: 'none',
  borderRadius: 3,
  background: !active ? '#DFE3E9' : property === 'error' ? '#FF0A19' : '#A28D00',
  color: active ? '#FFF' : '#425161'
}))

@managementContext
class ModifierToggle extends React.Component {
  render () {
    const { active, property, propertyKey, toggleModifier } = this.props
    return (
      <Button
        onClick={() => toggleModifier({key: propertyKey, property})}
        active={active}
        property={property}>
        {active ? 'Active' : 'Inactive'}
      </Button>
    )
  }
}

export default ModifierToggle
