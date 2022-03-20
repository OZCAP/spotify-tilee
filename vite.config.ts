import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'build') {
    return {
      base: path.resolve(__dirname, "./dist/"),
      plugins: [react()]
    }
  } else {
    return {
      base: '.',
      plugins: [react()]
    }
    
  }
})
