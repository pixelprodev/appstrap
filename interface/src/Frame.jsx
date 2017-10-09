import { css } from 'glamor'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom'
import Header from './Header'
import './styles'
import Tabs from './components/Tabs'
import Presets from './Presets'
import Routes from './Routes'

css.global('*, *:before, *:after', {
  fontFamily: 'Proxima nova',
  boxSizing: 'border-box'
})

const DecoratedFrame = () =>
  <BrowserRouter>
    <Frame />
  </BrowserRouter>

class Frame extends React.Component {
  render () {
    return (
      <div>
        <Header />
        <Tabs />
        <Switch>
          <Route path='/presets' component={Presets} />
          <Route path='/routes' component={Routes} />
          <Redirect to='/routes' />
        </Switch>
      </div>
    )
  }
}

ReactDOM.render(<DecoratedFrame />, document.getElementById('react-host'))
