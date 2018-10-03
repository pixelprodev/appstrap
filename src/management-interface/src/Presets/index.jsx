import React from 'react'
import styled from 'react-emotion'
import ActivePresets from './ActivePresets'
import InactivePresets from './InactivePresets'

const Container = styled.div(({ theme }) => ({
  padding: theme.spacing.standard,
  flexGrow: 1
}))

const TitleBox = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 50,
  marginBottom: theme.spacing.standard,
  ' > h1': {
    margin: 0,
    fontSize: 24,
    fontWeight: 700
  }
}))

class Presets extends React.Component {
  render () {
    return (
      <Container>
        <TitleBox>
          <h1>Presets</h1>
        </TitleBox>
        <ActivePresets />
        <InactivePresets />
      </Container>
    )
  }
}

export default Presets
