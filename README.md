# `@rtsao/scc`

Find strongly connected components of a directed graph using Tarjan's algorithm.

## Installation

```
yarn add @rtsao/scc
```

```
npm install @rtsao/scc
```

## Usage

```js
const scc = require("@rtsao/scc");

const digraph = new Map([
  ["a", new Set(["c", "d"])],
  ["b", new Set(["a"])],
  ["c", new Set(["b"])],
  ["d", new Set(["e"])],
  ["e", new Set()]
]);

const components = scc(digraph);
// [ Set { 'e' }, Set { 'd' }, Set { 'b', 'c', 'a' } ]
```
