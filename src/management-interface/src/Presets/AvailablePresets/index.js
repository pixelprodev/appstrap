import React from 'react'
import { connect } from 'react-redux'
import colors from '../../colors'
import selNonActivePresets from '../../store/selectors/selNonActivePresets'
import BasePreset from '../BasePreset'
import glamorous from 'glamorous'

const HeaderRow = glamorous.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 10
})
const Title = glamorous.h1({
  fontSize: 18,
  fontWeight: 300
})
const FilterBox = glamorous.div({})
const FilterInput = glamorous.input({
  minWidth: 300,
  height: 32,
  border: `1px solid ${colors.borderColor}`,
  borderRadius: 4,
  outline: 'none',
  padding: '0 15px'
})
const PresetList = glamorous.div({
  ' > div:not(:last-of-type)': {
    borderBottom: 'none'
  }
})

class AvailablePresets extends React.Component {
  render () {
    const { availablePresets = [], setAvailablePresetFilter } = this.props
    return (
      <React.Fragment>
        <HeaderRow>
          <Title>Available Presets</Title>
          <FilterBox>
            <FilterInput
              placeholder={'Filter preset by name'}
              onChange={(e) => setAvailablePresetFilter(e.target.value)} />
          </FilterBox>
        </HeaderRow>
        <PresetList>
          {availablePresets.map(preset =>
            <BasePreset key={preset.name} {...preset} />
          )}
        </PresetList>
      </React.Fragment>
    )
  }
}

const mapState = (store) => ({
  availablePresets: selNonActivePresets(store)
})
const mapDispatch = (dispatch) => ({
  setAvailablePresetFilter: (value) => dispatch({type: 'SET_AVAILABLE_PRESET_FILTER', value})
})

export default connect(mapState, mapDispatch)(AvailablePresets)
