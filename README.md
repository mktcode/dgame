# DGame

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```


# Thoughts

## Basic Game Loop

- Mint NFT(s)
- Claim ERC20 (for NFTs, based on level/multiplier)
- Update Image (Metadata)
- Populate Space (Collect NFTs nearby, form "bigger pictures" on the grid)
- Upgrade NFT
  -> higher claim multiplier

## Random Upgrades

Through a simple bond mechanism, random upgrades can be realized. You mint the NFT. When you want to upgrade it, you make a transaction, creating a "request" and placing your NFT as the bond. A certain number of blocks later, you can fulfill the request and get your NFT back. The randomness is simply based on the previous block hash(es). So the result is known but the bond mechanism ensures execution. A certain number of blocks later, anyone can claim back the NFT for free. After even more blocks, it turns into an ERC20 that can be minted by any player.

## Update Metadata

The metadata of an NFT can be updated by its owner by paying with the ERC20, price doubles each time.

## Polish Design/UI/UX

## Misc

- bundle transactions (multisend)
- appreciate the age of the NFT
- NFTs have actual use
  - can own tokens