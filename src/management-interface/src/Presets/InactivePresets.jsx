import React from 'react'
import styled from 'react-emotion'
import PresetFilter from './PresetFilter'
import PresetToggle from './PresetToggle'
import managementContext from '../context'

const Container = styled.div({
  minHeight: 250
})

const TitleBox = styled.div(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing.thin,
  ' > h2': {
    fontSize: 16,
    fontWeight: 700
  }
}))

const EmptyMessage = styled.span(({theme}) => ({
  display: 'block',
  margin: `${theme.spacing.standard} 0`,
  fontSize: 14,
  color: '#7F8FA4'
}))

@managementContext
class InactivePresets extends React.Component {
  render () {
    const { getInactivePresets } = this.props
    const inactivePresets = getInactivePresets()
    return (
      <Container>
        <TitleBox>
          <h2>Inactive</h2>
          <PresetFilter />
        </TitleBox>
        {inactivePresets.length === 0 && <EmptyMessage>No active presets</EmptyMessage>}
        {inactivePresets.map(groupName => <PresetToggle key={groupName} groupName={groupName}/>)}
      </Container>
    )
  }
}

export default InactivePresets
