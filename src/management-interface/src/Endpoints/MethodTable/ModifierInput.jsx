import React from 'react'
import styled from 'react-emotion'
import managementContext from '../../context'

const Input = styled.input(({theme}) => ({
  width: 70,
  height: 20,
  textAlign: 'center',
  border: `1px solid ${theme.border.color}`,
  fontSize: 11,
  fontWeight: 600
}))

@managementContext
class ModifierInput extends React.Component {
  render () {
    const { propertyKey, property, setModifier, initialValue } = this.props
    return (
      <Input
        type={'text'}
        onChange={(e) => {
          const value = e.target.value
          setModifier({ key: propertyKey, property, value })
        }}
        innerRef={input => this.field = input}
        onFocus={() => this.field.value = ''}
        defaultValue={initialValue} />
    )
  }
}

export default ModifierInput
