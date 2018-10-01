import React from 'react'
import styled from 'react-emotion'
import managementContext from '../context'
import PresetToggle from './PresetToggle'

const Container = styled.div(({theme}) => ({
  minHeight: 150,
  marginBottom: theme.spacing.standard
}))

const Title = styled.h2(({theme}) => ({
  fontSize: 16,
  fontWeight: 700,
  marginBottom: theme.spacing.standard
}))

const EmptyMessage = styled.span({
  display: 'block',
  margin: 0,
  fontSize: 14,
  color: '#7F8FA4'
})

@managementContext
class ActivePresets extends React.Component {
  render () {
    const { activePresets } = this.props
    return (
      <Container>
        <Title>Active</Title>
        {activePresets.length === 0 && <EmptyMessage>No active presets</EmptyMessage>}
        {activePresets.map(groupName => <PresetToggle active groupName={groupName}/>)}
      </Container>
    )
  }
}

export default ActivePresets
