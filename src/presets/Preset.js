class Preset {
  constructor ({ path, method, data, mode = 'overwrite' }) {
    this.path = path
    this.method = method
    this.data = data
    this.mode = mode
  }
}

export default Preset
