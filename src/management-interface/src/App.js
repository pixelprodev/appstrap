import React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router'
import { withRouter } from 'react-router-dom'
import Endpoints from './Endpoints'
import Header from './Header'
import Loader from './Loader'
import Presets from './Presets'
import Tabs from './Tabs'
import './cssDefaults'
import glamorous from 'glamorous'

const PageContainer = glamorous.section({
  background: '#EFF3F6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflowY: 'scroll'
})
const AppContainer = glamorous.div({
  padding: '1rem',
  maxWidth: 850,
  width: '100%',
  height: '100vh'
})

class App extends React.Component {
  componentDidMount () {
    this.props.initialize()
  }
  render () {
    const { initialized } = this.props
    if (!initialized) {
      return <Loader />
    }
    return (
      <PageContainer>
        <AppContainer>
          <Header />
          <Tabs />
          <Switch>
            <Route path={'/presets'} component={Presets} />
            <Route path={'/endpoints/:group?'} component={Endpoints} />
            <Redirect to={'/endpoints'} />
          </Switch>
        </AppContainer>
      </PageContainer>
    )
  }
}

export const mapState = (store) => ({
  initialized: store.initialized
})

export const mapDispatch = (dispatch) => ({
  initialize: () => dispatch({type: 'INITIALIZE'})
})

export default withRouter(connect(mapState, mapDispatch)(App))
