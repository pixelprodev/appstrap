import { css } from 'glamor'
import { connect, Provider } from 'react-redux'
import { BrowserRouter, Redirect, Route, Switch, withRouter } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom'
import Header from './Header'
import './styles'
import Tabs from './components/Tabs'
import Presets from './Presets'
import Routes from './Routes'
import Store from './state/index'

css.global('*, *:before, *:after', {
  fontFamily: 'Proxima nova',
  boxSizing: 'border-box'
})

class Frame extends React.Component {
  componentWillMount () { this.props.loadAppData() }
  render () {
    return (
      <div>
        <Header {...this.props} />
        <Tabs />
        <Switch>
          <Route path='/presets' component={Presets} />
          <Route path='/routes/:endpoint?' component={Routes} />
          <Redirect to='/routes' />
        </Switch>
      </div>
    )
  }
}

const mapState = ({appName, appVersion}) => ({appName, appVersion})
const mapDispatch = (dispatch) => ({
  loadAppData: () => dispatch({type: 'LOAD_APP_DATA'}),
  reloadConfig: () => dispatch({type: 'RELOAD_CONFIG'})
})
const ConnectedFrame = withRouter(connect(mapState, mapDispatch)(Frame))

const DecoratedFrame = () =>
  <Provider store={Store}>
    <BrowserRouter>
      <ConnectedFrame />
    </BrowserRouter>
  </Provider>


ReactDOM.render(<DecoratedFrame />, document.getElementById('react-host'))
