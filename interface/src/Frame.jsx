import { css } from 'glamor'
import React from 'react'
import ReactDOM from 'react-dom'
import Header from './Header'
import './styles'

css.global('*, *:before, *:after', {
  fontFamily: 'Proxima nova',
  boxSizing: 'border-box'
})

class Frame extends React.Component {
  render () {
    return (
      <div>
        <Header />
      </div>
    )
  }
}

ReactDOM.render(<Frame />, document.getElementById('react-host'))
