import { createRollupConfig, createTypeConfig } from 'rollup-library-template';

const baseConfig = {
  filesize: true,
  minify: true,
  extra: {
    treeshake: true,
  },
};

const external = ['@iiif/helpers/vault'];
const bundled = ['@iiif/parser', '@iiif/helpers/vault/actions'];
const nodeExternal = [];

// Roll up configs
export default [
  createTypeConfig({
    source: './.build/types/index.d.ts',
  }),

  // UMD bundle will have everything.
  createRollupConfig({
    ...baseConfig,
    inlineDynamicImports: true,
    input: './src/index.ts',
    output: {
      name: 'IIIFBuilder',
      file: `dist/index.umd.js`,
      format: 'umd',
    },
    nodeResolve: {
      browser: true,
    },
  }),

  // import {} from '@iiif/vault';
  createRollupConfig({
    ...baseConfig,
    input: './src/index.ts',
    distPreset: 'esm',
    external,
  }),
  createRollupConfig({
    ...baseConfig,
    input: './src/index.ts',
    distPreset: 'cjs',
    external,
  }),
];
