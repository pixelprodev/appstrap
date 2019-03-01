import React from 'react'
import managementContext from './context'
import Loader from './svgs/Loader'
import styled from 'react-emotion'
import Header from './Header'
import Endpoints from './Endpoints'
import Presets from './Presets'

const AppContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100vw',
  height: '100vh',
  maxWidth: 1440,
  margin: '0 auto'
})

const Content = styled.div({
  display: 'flex'
})

@managementContext
class App extends React.Component {
  componentDidMount () { this.props.initialize() }
  render () {
    const { initialized } = this.props
    if (!initialized) { return <Loader /> }

    return (
      <AppContainer>
        <Header />
        <Content>
          <Endpoints />
          <Presets />
        </Content>
      </AppContainer>
    )
  }
}

export default App
