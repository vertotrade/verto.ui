# 🥞 Verto UIkit

[![Version](https://img.shields.io/npm/v/@verto/uikit)](https://www.npmjs.com/package/@verto/uikit) [![Size](https://img.shields.io/bundlephobia/min/@verto/uikit)](https://www.npmjs.com/package/@verto/uikit)

Verto UIkit is a set of React components and hooks used to build pages on Verto's apps. It also contains a theme file for dark and light mode.

## Install

`yarn add @verto/uikit`

***Note**: In case you want to use the older version of the Verto UIkit, you should install @vertotrade-libs/uikit, instead, but we recommend using the latest version of the UIkit.*


## Setup

### Providers

Before using Verto UIkit, you need to provide the theme file to uikit provider.

```
import { UIKitProvider, light, dark } from '@verto/uikit'
...
<UIKitProvider theme={isDark ? dark : light}>...</UIKitProvider>
```

### Reset

A reset CSS is available as a global styled component.

```
import { ResetCSS } from '@verto/uikit'
...
<ResetCSS />
```

### Types

This project is built with Typescript and export all the relevant types.

