const { CONFIG_LOAD } = require('../constants')
module.exports = function filesReducer (state = [], action) {
  if (action.type === CONFIG_LOAD) {
    return action.fileList
  }
  return state
}
