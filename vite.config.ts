import path from 'node:path'
import { paraglideVitePlugin } from '@inlang/paraglide-js'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'

const JSX_FILE_REGEX = /\.(tsx|jsx)$/
const CLASS_ATTR_REGEX = /\bclass=/g

function reactClassPlugin(): Plugin {
  return {
    name: 'react-class-to-classname',
    enforce: 'pre',
    transform(code, id) {
      if (!JSX_FILE_REGEX.test(id)) {
        return null
      }

      return {
        code: code.replace(CLASS_ATTR_REGEX, 'className='),
        map: null,
      }
    },
  }
}

export default defineConfig({
  plugins: [
    reactClassPlugin(),
    react(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/lib/paraglide',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
})
