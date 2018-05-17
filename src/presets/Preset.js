class Preset {
  constructor ({ name, path, method, data, mode = 'replace', description = '' }) {
    this.name = name
    this.description = description
    this.path = path
    this.method = method
    this.data = data
    this.mode = mode
  }
}

export default Preset
