import { defineConfig } from 'tsdown'

export default defineConfig({
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    sourcemap: false,
})
