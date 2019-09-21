#!/usr/bin/node

require('@babel/register')({
  presets: [require.resolve('@babel/preset-env')],
  plugins: [
    require.resolve('@babel/plugin-transform-runtime'), // require('@babel/runtime')
  ],
})

global.ROOT = __dirname

require('./scripts/update')
