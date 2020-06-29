import * as watcher from 'chokidar'
export class FileWatcher {
  start(file: string, cb: () => {}): void {
    watcher
      .watch(file, {
        persistent: true
      })
      .on('ready', () => {
        console.log(`watching file for changes: ${file}`)
      })
      .on('change', () => {
        cb()
      })
  }
}
