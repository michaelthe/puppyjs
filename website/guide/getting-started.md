---
title: Getting started
---

# Getting Started
  
::: warning COMPATIBILITY NOTE
PuppyJS requires Node.js >= 8.
:::

Depending on your use case you can install both globally and locally.

## Local installation

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

## Global installation

```bash
npm install puppyjs --global
```



### Get some help
```bash
puppy --help
```

### Run mocking servers
```bash
puppy serve
```

### Run tests
```bash
puppy test
```