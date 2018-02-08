# neutron

---

Still in beta, will be announced once fully stable (ask [@leo](https://github.com/leo)).

---

This package provides you with a belt full of all the tools you need for building a [Electron](https://electronjs.org) application.

Aside from making the creation of a new application as easy as baking 🥞, it even ensures you won't get any trouble when the codebase gets huge.

While the [main process](https://electronjs.org/docs/tutorial/quick-start#main-process) is kept free from any form of transpilation setup (since [Electron](https://electronjs.org) ships with a up-to-date version of [Node.js](https://nodejs.org/en/)), the [renderer process](https://electronjs.org/docs/tutorial/quick-start#renderer-process) is backed by [Next.js](https://github.com/zeit/next.js), a framework for building React applications which has already seen tremendous growth and acceptance among the community.

## Features

- **Create a New App with a Single Command:** The only thing you need to do in order to create a new boilerplate with everything necessary already installed is running `neutron init`. That's all.

- **Compiler Included:** Once you've finished developing your application, the `neutron build` command is the only thing needed for generating application bundles (`.app` for macOS, `.exe` for Windows, etc).

- **No Need to Set up Any Tooling:** Things like hot code reloading, transpiling and bundling are all taken care of. No further tools required, just run `neutron`.

Isn't that magical? 💫

No matter if you're already familiar with the concept of building Electron applications backed by Next.js or not, I highly recommend at least giving it a shot. Just read on, it's very easy!

## Get Started

To create a fresh app, you only need to have [Node.js](https://nodejs.org/en/) installed. Then run this command:

```bash
npx neutron init
```

That's it – now follow the instructions shown! 🚀

**To be clear:** If your friend (who hasn't developed any mac applications at all yet) wants to get started with building such applications, these are litterally the only steps to follow:

1. Buy computer
2. Install [Node.js](https://nodejs.org/en/)
3. Run `npx neutron init`
4. 🎉

## Commands & Options

To get a list of all available sub commands and options, run this command:

```bash
neutron --help
```

This also works for sub commands. Here's an example for `build`:

```bash
neutron build --help
```

## Configuration

By default, `neutron` will work just fine without any addition configuration. However, you can add a property named `neutron` to the `package.json` file of your application for changing the behaviour:

```json
"neutron": {
  "name": "Test"
}
```

**IMPORTANT:** All of these configuration properties are **optional**.

It can hold the following properties (the dot in property names indicates a sub property):

### All Operating Systems

| Property             | Description                                                                                                                                                                                                                                                                        |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`               | Holds the name of your application on all platforms.                                                                                                                                                                                                                               |
| `asar`               | By default, this is set to `true`, which bundles the application into an [ASAR archive](https://electronjs.org/docs/tutorial/application-packaging#using-asar-archives). Set it to `false` to disable it (can be useful for debugging, but should always be `true` in production). |

### macOS

| Property             | Description                                                                                                                                                                                                                                                                        |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `macOS.id`           | The string that identifies your application to the system. As an example: If your company is called "ZEIT" (zeit.co) and your application is called "Now", the `id` should be "co.zeit.now".                                                                                       |
| `macOS.category`     | The type of application you're building ([possible values](https://developer.apple.com/library/content/documentation/General/Reference/InfoPlistKeyReference/Articles/LaunchServicesKeys.html#//apple_ref/doc/uid/TP40009250-SW8)).                                                |
| `macOS.info`         | This property lets you extend the information contained within the `Info.plist` files in your bundle. It holds an object made of key value pairs to include in those files. As an example, adding `LSUIElement` with a value of  `1` would hide the dock icon forever.             |
| `macOS.icon`         | The path to a `.icns` file, which acts as the icon of your macOS application (relative to working directory).                                                                                                                                                                      |

### Windows

| Property             | Description                                                                                                                                                                                                                         |
|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `windows.msi`        | By default, a `.exe` installer without any wizard steps will be generated. If you want to also receive a [MS installer](https://en.wikipedia.org/wiki/Windows_Installer) in addition, you can set this option to `true`.            |
| `windows.loadingGIF` | A custom path to a GIF that shows while your Windows application is being installed using the `.exe` installer (relative to working directory).                                                                                     |
| `windows.icon`       | The path to a `.ico` file, which acts as the icon of your Windows application (relative to working directory).                                                                                                                      |
| `windows.setupIcon`  | By default, the installer for your Windows application will have the same icon as the application itself. If you want a separate one for it, this property can be set to the path to a `.ico` file (relative to working directory). |

## Badge

Do you want to help us spread the word? Feel free to add this badge to your repository:

[![badge][neutron-badge]][neutron-link]

[neutron-badge]: https://img.shields.io/badge/built%20with-neutron-ff69b4.svg?style=flat
[neutron-link]: https://github.com/zeit/neutron

Simply embed this markdown code in your `readme.md` file:

```markdown
<!-- Below or next to the top heading -->
[![badge][neutron-badge]][neutron-link]

<!-- At the bottom of the file -->
[neutron-badge]: https://img.shields.io/badge/built%20with-neutron-ff69b4.svg?style=flat
[neutron-link]: https://github.com/zeit/neutron
```

## Contributing

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2. Uninstall `neutron` if it's already installed: `yarn global remove neutron`
3. Link it to the global module directory by running this command in the repo directory: `yarn link`

After that, you can use the `neutron` command everywhere!

## Author

Leo Lamprecht ([@notquiteleo](https://twitter.com/notquiteleo)) - [ZEIT](https://zeit.co)
