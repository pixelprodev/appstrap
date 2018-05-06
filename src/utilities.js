import fs from 'fs-extra'
import path from 'path'

export function locateProjectRoot (level = process.cwd()) {
  if (fs.existsSync(path.resolve(level, 'package.json'))) {
    return level
  } else {
    let splitLevel = level.split(path.sep)
    splitLevel.pop()
    let levelUp = splitLevel.join(path.sep)
    return locateProjectRoot(levelUp)
  }
}
