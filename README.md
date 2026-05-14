# local-pkg-bin

Easily retrieve the absolute paths of executable binaries provided by your project's local npm packages.

## Install

```bash
pnpm add local-pkg-bin
```

## Usage

```ts
const bins = await resolvePackageBin('my-tools')
// { 'my-tool': '/path/to/bin/tool.js', 'my-helper': '/path/to/bin/helper.js' }
```

If the package does not exist or has no `bin` field, it returns an empty object `{}`.

## License

[MIT](./LICENSE) · [lonewolfyx](https://github.com/lonewolfyx)
