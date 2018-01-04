# bundle

This is an opinionated approach to packaging Electron applications for distribution. It's specifically crafted for bundling applications built with Next.js ([electron-next](https://github.com/leo/electron-next)), which allows for the most minimal amount of configuration and the maximum of performance.

As an example, these are all the commands you'll ever need:

- `bundle init` generates a new boilerplate
- `bundle start` or `npm start` run your app for development
- `bundle` compiles your final app bundle

Isn't that magical? 💫

If you aren't familiar with the concept of such applications yet, read [this post](https://leo.im/2017/electron-next) – it will guide you through the reasoning behind it. In the case that you are (or just want to give it a shot), read on.

## Get Started

In the case that you want to build a new application, firstly install the package:

```bash
npm install -g bundle
```

Once that's done, generate a new boilerplate like this:

```bash
bundle init
```

That's it!

## Existing App

If you already have a working application into which [electron-next](https://leo.im/2017/electron-next) was implemented, simply install the package as a local dependency for development...

```bash
npm install bundle
```

And then add a new [npm script](https://docs.npmjs.com/misc/scripts) like this:

```json
"scripts": {
  "pack": "bundle"
}
```

From here on, you only need to run this command to bundle your app:

```bash
npm run pack
```

Easy as 🍰!

## Configuration

By default, `bundle` will work just fine without any addition configuration. However, you can add a property named `bundle` to the `package.json` file of your application for changing the behaviour:

```json
"bundle": {
  "name": "Test"
}
```

It can hold the following properties (the dot in property names indicates a sub property):

| Property         | Description                                                                                                                                                                                                                                                            |
|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`           | Holds the name of your application on all platforms.                                                                                                                                                                                                                   |
| `macOS.id`       | The string that identifies your application to the system. As an example: If your company is called "ZEIT" (zeit.co) and your application is called "Now", the `id` should be "co.zeit.now".                                                                           |
| `macOS.category` | The type of application you're building ([possible values](https://developer.apple.com/library/content/documentation/General/Reference/InfoPlistKeyReference/Articles/LaunchServicesKeys.html#//apple_ref/doc/uid/TP40009250-SW8)).                                    |
| `macOS.info`     | This property lets you extend the information contained within the `Info.plist` files in your bundle. It holds an object made of key value pairs to include in those files. As an example, adding `LSUIElement` with a value of  `1` would hide the dock icon forever. |

## Contributing

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2. Uninstall `bundle` if it's already installed: `npm uninstall -g bundle`
3. Link it to the global module directory by running this command in the repo directory: `npm link`

After that, you can use the `bundle` command everywhere!

## Author

Leo Lamprecht ([@notquiteleo](https://twitter.com/notquiteleo)) - [ZEIT](https://zeit.co)
