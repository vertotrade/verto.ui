# Verto Frontend

This project contains the main features of the verto application.

If you want to contribute, please refer to the [contributing guidelines](./CONTRIBUTING.md) of this project.

## Chart View

To create new transactions ES transforms used in the chart view for new pairs, you can use the script `scripts/create-es-transform-transactions.ts`
It is necessary to have an API KEY with the right privilages.
Example: `ES_NODE_URL=https://testnet.rebus.money:9200 ES_API_KEY=... TOKEN_0=WREBUS TOKEN_1=VERTO yarn create-es-transform-transactions`

## Documentation

- [Info](doc/Info.md)
- [Cypress tests](doc/Cypress.md)

> Install dependencies using **yarn**

## `apps/web`
<details>
<summary>
How to start
</summary>

```sh
yarn
```

start the development server
```sh
yarn dev
```

build with production mode
```sh
yarn build

# start the application after build
yarn start
```
</details>


## Packages

| Package                                                       | Description                                                                                                            |
|---------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| [sdk](/packages/swap-sdk)                                     | An SDK for building applications on top of Verto                                                                 |
| [swap-sdk-core](/packages/swap-sdk-core)                      | Swap SDK Shared code                                                                                                   |
| [wagmi](/packages/wagmi)                                      | Extension for [wagmi](https://github.com/wagmi-dev/wagmi), including bsc chain and binance wallet connector            |

