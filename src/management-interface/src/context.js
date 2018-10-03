import React from 'react'
import { callService } from './api'

const { Provider, Consumer } = React.createContext()

export class ManagementContextProvider extends React.Component {
  constructor () {
    super()
    this.state = {}
  }

  async initialize () {
    let { version, presets, name, endpoints } = await callService('GET', 'state')
    const presetGroups = Array.from(new Set(presets.collection.map(p => p.group)))
    this.setState({
      initialized: true,
      version,
      name,
      endpoints,
      endpointFilter: '',
      presetFilter: '',
      uniqueEndpoints: Array.from(new Set(endpoints.map(e => e.path))),
      activePresets: presetGroups.filter(group => presets.sequence.includes(group)),
      inactivePresets: presetGroups.filter(group => !presets.sequence.includes(group)),
      presetSequence: presets.sequence
    })
  }

  getUniqueEndpoints () {
    const { uniqueEndpoints, endpointFilter } = this.state
    if (endpointFilter === '/') { return ['/'] }
    let matchExp = new RegExp(RegExp.escape(endpointFilter), 'i')
    return uniqueEndpoints.filter(v => matchExp.test(v))
  }
  getInactivePresets () {
    const { inactivePresets, presetFilter } = this.state
    let matchExp = new RegExp(RegExp.escape(presetFilter), 'i')
    return inactivePresets.filter(v => matchExp.test(v))
  }

  async toggleModifier ({ key, property }) {
    const endpointIndex = this.state.endpoints.findIndex(endpoint => endpoint.key === key)
    const endpointToUpdate = this.state.endpoints[endpointIndex]
    await callService('PUT', 'endpoint', { key, [property]: !endpointToUpdate[property] })
    const { endpoints } = await callService('GET', 'state')
    this.setState({ endpoints })
  }

  async setModifier ({ key, property, value }) {
    await callService('PUT', 'endpoint', { key, [property]: value })
    const { endpoints } = await callService('GET', 'state')
    this.setState({ endpoints })
  }

  setFilter ({ type, value }) {
    this.setState({ [type === 'endpoint' ? 'endpointFilter' : 'presetFilter']: value })
  }

  async togglePreset ({ groupName }) {
    const presets = await callService('PUT', 'preset', { groupName })
    const presetGroups = Array.from(new Set(presets.collection.map(p => p.group)))
    this.setState({
      activePresets: presetGroups.filter(group => presets.sequence.includes(group)),
      inactivePresets: presetGroups.filter(group => !presets.sequence.includes(group))
    })
  }

  render () {
    const thisContext = {
      setFilter: this.setFilter.bind(this),
      initialize: this.initialize.bind(this),
      setModifier: this.setModifier.bind(this),
      togglePreset: this.togglePreset.bind(this),
      toggleModifier: this.toggleModifier.bind(this),
      getInactivePresets: this.getInactivePresets.bind(this),
      getUniqueEndpoints: this.getUniqueEndpoints.bind(this),
      ...this.state
    }
    return (
      <Provider value={thisContext}>
        {this.props.children}
      </Provider>
    )
  }
}

export default function ManagementContextConsumer (WrappedComponent) {
  return (defaultProps) =>
    <Consumer>{ props => {
      const combinedProps = { ...props, ...defaultProps }
      return <WrappedComponent {...combinedProps} />
    }}</Consumer>
}
