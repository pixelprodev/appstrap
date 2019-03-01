import React from 'react'
import managementContext from '../context'
import BaseInput from '../_theme/BaseInput'

@managementContext
class EndpointFilter extends React.Component {
  render () {
    const { setFilter } = this.props
    return (
      <BaseInput
        placeholder={'Filter'}
        onChange={(e) => {
          const value = e.target.value
          setFilter({type: 'endpoint', value})
        }}
      />
    )
  }
}

export default EndpointFilter
