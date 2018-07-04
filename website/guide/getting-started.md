---
title: Getting started
---

# Getting Started
  
::: warning COMPATIBILITY NOTE
PuppyJS requires Node.js >= 8.
:::

Depending on your use case you can install both globally and locally.

## Global installation

```bash
npm install puppyjs --global
```

## Local installation

If you want PuppyJS to run on your CI/CD platforms its best to install locally as well.

```bash
npm install puppyjs --save-dev
```

In your `package.json`

```json

"scripts": {
  ...
  "puppy:serve": puppy serve,
  "puppy:test": puppy test
}
```

## Useful commands

### Help
```bash
puppy --help
```

### For development
```bash
puppy serve
```

### For testing
```bash
puppy test
```

## Sample project structure

Below you can find a sample project directory structure. The important files to notice are:

`puppy.api.js`
`puppy.ws.js` 
`puppy.config.js`

They must be located at the **root level** of the directory. Also of importance is the `.pup.js` extension of files in the **tests** folder.

```
.
|
├── puppy.config.js <optional>
├── puppy.api.js <optional>
├── puppy.ws.js <optional>
|
├── package.json
|
├── dist
|   ├── background.jpg
|   ├── index.html
|   └── fonts
|
└── tests
    ├── users.pup.js
    └── notifications.pup.js
```

These files are all **optional** and depending on your needs you can find the breakdown of each file in [configuration](./configuration.md).