import React from 'react'
import styled from 'react-emotion'
import Table from './Table'
import HeaderCell from './Table/HeaderCell'
import MethodName from './MethodName'
import ModifierToggle from './ModifierToggle'
import ModifierInput from './ModifierInput'

const Container = styled.div(({ theme }) => ({
  padding: `0 ${theme.spacing.standard}`
}))

class MethodTable extends React.Component {
  constructor () {
    super()
    this.formatRows = this.formatRows.bind(this)
  }

  formatRows () {
    const { collection } = this.props
    return collection.map(({ key, method, error, errorStatus, latency, latencyMS }) => ({
      method: <MethodName type={method} />,
      error: <ModifierToggle property={'error'} active={error} propertyKey={key} />,
      errorStatus: <ModifierInput property={'errorStatus'} propertyKey={key} initialValue={errorStatus} />,
      latency: <ModifierToggle property={'latency'} active={latency} propertyKey={key} />,
      latencyMS: <ModifierInput property={'latencyMS'} propertyKey={key} initialValue={latencyMS} />
    }))
  }

  render () {
    return (
      <Container>
        <Table
          header={[
            <HeaderCell key={'method'} name={'method'} content={'Method'} />,
            <HeaderCell key={'error'} name={'error'} content={'Return Error'} align={'center'} />,
            <HeaderCell key={'errorStatus'} name={'errorStatus'} content={'Error Status'} align={'center'} />,
            <HeaderCell key={'latency'} name={'latency'} content={'Latency'} align={'center'} />,
            <HeaderCell key={'latencyMS'} name={'latencyMS'} content={'LatencyMS'} align={'center'} />
          ]}
          rows={this.formatRows()} />
      </Container>
    )
  }
}

export default MethodTable
