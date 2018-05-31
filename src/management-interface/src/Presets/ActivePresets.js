import React from 'react'
import glamorous from 'glamorous'
import { connect } from 'react-redux'
import colors from '../colors'
import selActivePresets from '../store/selectors/selActivePresets'
import BasePreset from './BasePreset'

const ActivePresetContainer = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 50,
  color: colors.grey.light,
  border: `1px solid ${colors.borderColor}`,
  marginBottom: 10
})

const EmptyActivePresets = () =>
  <ActivePresetContainer>
    You have no active presets.  Please activate one or more from the list below.
  </ActivePresetContainer>

class ActivePresets extends React.Component {
  render () {
    const { activePresets } = this.props
    if (activePresets.length === 0) {
      return <EmptyActivePresets />
    }
    return (
      <ActivePresetContainer>
        {activePresets.map(preset =>
          <BasePreset key={preset.name} {...preset} />
        )}
      </ActivePresetContainer>
    )
  }
}

const mapState = (store) => ({
  activePresets: selActivePresets(store)
})

export default connect(mapState)(ActivePresets)
