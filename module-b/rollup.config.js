export default {
  input: 'dist/out-module/module.js',
  output: {
    file: 'dist/bundle/module.js',
    format: 'umd',
    name: 'module-b',
    globals: {
      '@angular/core': 'ng.core',
      '@angular/common': 'ng.common',
      '@angular/router': 'ng.router'
    }
  },
  // This is only to suppress the warning
  external: [
    '@angular/core',
    '@angular/common',
    '@angular/router'
  ]
}
