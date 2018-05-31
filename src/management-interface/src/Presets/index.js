import React from 'react'
import glamorous from 'glamorous'
import colors from '../colors'
import ActivePresets from './ActivePresets'
import AvailablePresets from './AvailablePresets'

const PresetContainer = glamorous.div({
})
const MessageContainer = glamorous.div({
  background: '#FAFBFC',
  padding: '1rem',
  ' > p': {
    fontSize: 14,
    color: colors.grey.default
  },
  border: `1px solid ${colors.borderColor}`,
  borderTop: 'none',
  marginBottom: 10
})

class Presets extends React.Component {
  render () {
    return (
      <PresetContainer>
        <MessageContainer>
          <p>
            Presets, commonly referred to as "Fixtures" allow you to snapshot your app to a specific point in time.  Presets are composable, meaning you can activate as many or as few as needed to achieve your goal.  Active presets in the list below with the same endpoint/method combinations are merged from top to bottom.  More information can be found (here).
          </p>
        </MessageContainer>
        <ActivePresets />
        <AvailablePresets />
      </PresetContainer>
    )
  }
}

export default Presets
