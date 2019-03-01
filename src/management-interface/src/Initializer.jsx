import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { ManagementContextProvider } from './context'
import { ThemeProvider } from 'emotion-theming'
import theme from './_theme'
import './_theme/css-reset'

const Initializer = () =>
  <ThemeProvider theme={theme}>
    <ManagementContextProvider>
      <App />
    </ManagementContextProvider>
  </ThemeProvider>

ReactDOM.render(<Initializer />, document.getElementById('host'))
