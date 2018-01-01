# 📦 pack

This is an opinionated approach to packaging Electron applications for distribution. It's specifically crafted for bundling applications built with Next.js ([electron-next](https://github.com/leo/electron-next)), which allows for the most minimal amount of configuration and the maximum of performance.

If you aren't familiar with the concept of such applications yet, read [this post](https://leo.im/2017/electron-next) – it will guide you through the reasoning behind it. In the case that you are (or just want to give it a shot), read on.

## Get Started

In the case that you want to build a new application, the only thing you need to do is install the package...

```bash
npm install -g pack
```

...and generate a new boilerplate like this:

```bash
pack init
```

That's it!

## Existing App

If you already have a working application that was built using [electron-next](https://github.com/leo/electron-next), simply install the package as a local dependency for development...

```bash
npm install pack
```

And then add a new [npm script](https://docs.npmjs.com/misc/scripts) like this:

```json
"scripts": {
  "build": "pack"
}
```

From here on, you only need to run this command to bundle your app:

```bash
npm run build
```

Easy as 🍰!

## Contributing

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2. Uninstall `pack` if it's already installed: `npm uninstall -g pack`
3. Link it to the global module directory by running this command in the repo directory: `npm link`

After that, you can use the `pack` command everywhere!

## Author

Leo Lamprecht ([@notquiteleo](https://twitter.com/notquiteleo))
