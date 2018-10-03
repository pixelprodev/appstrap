import React from 'react'
import styled from 'react-emotion'
import managementContext from '../context'
import RemoveIcon from '../svgs/RemoveIcon'
import AddIcon from '../svgs/AddIcon'

const Button = styled.button(({theme, active}) => ({
  outline: 'none',
  padding: 0,
  background: 'none',
  border: 'none',
  height: 26,
  width: '100%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  ' > svg': {
    fill: active ? '#44C164' : '#7F8FA4',
    width: 12,
    height: 12,
    display: 'inline-block',
    marginRight: theme.spacing.thin
  },
  ' > span': {
    color: active ? '#44C164' : '#7F8FA4',
    textTransform: 'uppercase',
    fontSize: 13,
    fontWeight: 700
  }
}))

const TogglePrompt = styled.p(({theme}) => ({
  color: '#BDBFC1',
  fontSize: 10,
  margin: 0,
  fontWeight: 600,
  display: 'inline-block',
  marginLeft: theme.spacing.standard
}))

@managementContext
class PresetToggle extends React.Component {
  constructor () {
    super()
    this.state = {hovered: false}
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }

  handleMouseEnter () {
    this.setState({hovered: true})
  }
  handleMouseLeave () {
    this.setState({hovered: false})
  }
  render () {
    const { hovered } = this.state
    const { togglePreset, groupName, active } = this.props
    return (
      <Button
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        active={active} onClick={() => togglePreset({groupName})}>
        {active ? <RemoveIcon /> : <AddIcon />}
        <span>{groupName}</span>
        {hovered && <TogglePrompt>{`Click to ${active ? 'Deactivate' : 'Activate'}`}</TogglePrompt>}
      </Button>
    )
  }
}

export default PresetToggle
