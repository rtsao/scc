const { test } = require("node:test");
const assert = require("node:assert");

const tarjan = require("./index.js");

test("empty graph", () => {
  const graph = new Map();
  const result = tarjan(graph);
  assert.deepStrictEqual(result, []);
});

test("single node graph", () => {
  const graph = new Map([["A", []]]);
  const result = tarjan(graph);
  assert.deepStrictEqual(result, [new Set(["A"])]);
});

test("two disconnected nodes", () => {
  const graph = new Map([
    ["A", []],
    ["B", []],
  ]);
  const result = tarjan(graph);
  assert.deepStrictEqual(result, [new Set(["A"]), new Set(["B"])]);
});

test("single node self-loop", () => {
  const graph = new Map([["A", ["A"]]]);
  const result = tarjan(graph);
  assert.deepStrictEqual(result, [new Set(["A"])]);
});

test("simple cycle", () => {
  const graph = new Map([
    ["A", ["B"]],
    ["B", ["C"]],
    ["C", ["A"]],
  ]);
  const result = tarjan(graph);
  assert.deepStrictEqual(result, [new Set(["A", "B", "C"])]);
});

test("linear chain", () => {
  const graph = new Map([
    ["A", ["B"]],
    ["B", ["C"]],
    ["C", []],
  ]);
  const result = tarjan(graph);
  assert.deepStrictEqual(result, [
    new Set(["C"]),
    new Set(["B"]),
    new Set(["A"]),
  ]);
});

test("graph with nested cycles", () => {
  const graph = new Map([
    ["A", ["B"]],
    ["B", ["C"]],
    ["C", ["A", "D"]],
    ["D", ["E"]],
    ["E", ["D"]],
  ]);
  const result = tarjan(graph);
  assert.deepStrictEqual(result, [
    new Set(["D", "E"]),
    new Set(["A", "B", "C"]),
  ]);
});

test("disconnected graph with cycles", () => {
  const graph = new Map([
    ["A", ["B"]],
    ["B", ["A"]],
    ["C", ["D"]],
    ["D", ["C"]],
  ]);
  const result = tarjan(graph);
  assert.deepStrictEqual(result, [new Set(["A", "B"]), new Set(["C", "D"])]);
});

test("single edge cycle", () => {
  const graph = new Map([
    ["A", ["B"]],
    ["B", ["A"]],
  ]);
  const result = tarjan(graph);
  assert.deepStrictEqual(result, [new Set(["A", "B"])]);
});

test("graph with isolated nodes", () => {
  const graph = new Map([
    ["A", ["B"]],
    ["B", ["C"]],
    ["C", ["A"]],
    ["D", []],
    ["E", []],
  ]);
  const result = tarjan(graph);
  assert.deepStrictEqual(result, [
    new Set(["A", "B", "C"]),
    new Set(["D"]),
    new Set(["E"]),
  ]);
});

test("dense graph with one SCC", () => {
  const graph = new Map([
    ["A", ["B", "C", "D"]],
    ["B", ["C", "D", "A"]],
    ["C", ["D", "A", "B"]],
    ["D", ["A", "B", "C"]],
  ]);
  const result = tarjan(graph);
  assert.deepStrictEqual(result, [new Set(["A", "B", "C", "D"])]);
});

test("sparse graph", () => {
  const graph = new Map([
    ["A", ["B"]],
    ["B", []],
    ["C", ["D"]],
    ["D", []],
    ["E", []],
  ]);
  const result = tarjan(graph);
  assert.deepStrictEqual(result, [
    new Set(["B"]),
    new Set(["A"]),
    new Set(["D"]),
    new Set(["C"]),
    new Set(["E"]),
  ]);
});

test("large chain with cycles", () => {
  const graph = new Map([
    ["A", ["B"]],
    ["B", ["C"]],
    ["C", ["D"]],
    ["D", ["E"]],
    ["E", ["C"]],
  ]);
  const result = tarjan(graph);
  assert.deepStrictEqual(result, [
    new Set(["C", "D", "E"]),
    new Set(["B"]),
    new Set(["A"]),
  ]);
});

test("chain ending in a self-loop", () => {
  const graph = new Map([
    ["A", ["B"]],
    ["B", ["C"]],
    ["C", ["C"]],
  ]);
  const result = tarjan(graph);
  assert.deepStrictEqual(result, [
    new Set(["C"]),
    new Set(["B"]),
    new Set(["A"]),
  ]);
});

test("graph with multiple independent cycles", () => {
  const graph = new Map([
    ["A", ["B"]],
    ["B", ["A"]],
    ["C", ["D"]],
    ["D", ["C"]],
    ["E", ["F"]],
    ["F", ["G"]],
    ["G", ["E"]],
  ]);
  const result = tarjan(graph);
  assert.deepStrictEqual(result, [
    new Set(["A", "B"]),
    new Set(["C", "D"]),
    new Set(["E", "F", "G"]),
  ]);
});

test("complex graph with no cycles", () => {
  const graph = new Map([
    ["A", ["B"]],
    ["B", ["C"]],
    ["C", []],
    ["D", ["E"]],
    ["E", []],
  ]);
  const result = tarjan(graph);
  assert.deepStrictEqual(result, [
    new Set(["C"]),
    new Set(["B"]),
    new Set(["A"]),
    new Set(["E"]),
    new Set(["D"]),
  ]);
});

test("complex graph with cycles and chains", () => {
  const graph = new Map([
    ["A", ["B"]],
    ["B", ["C"]],
    ["C", ["A", "D"]],
    ["D", ["E"]],
    ["E", ["F"]],
    ["F", ["D", "G"]],
    ["G", []],
  ]);
  const result = tarjan(graph);
  assert.deepStrictEqual(result, [
    new Set(["G"]),
    new Set(["D", "E", "F"]),
    new Set(["A", "B", "C"]),
  ]);
});

test("graph with set iterators", () => {
  const graph = new Map([
    ["A", new Set(["B", "C"])],
    ["B", new Set(["C"])],
    ["C", new Set()],
  ]);
  const result = tarjan(graph);
  assert.deepStrictEqual(result, [
    new Set(["C"]),
    new Set(["B"]),
    new Set(["A"]),
  ]);
});

test("mixed iterator types", () => {
  const graph = new Map([
    ["A", ["B", "C"]],
    ["B", new Set(["C", "D"])],
    ["C", ["D"]],
    ["D", new Set()],
  ]);
  const result = tarjan(graph);
  assert.deepStrictEqual(result, [
    new Set(["D"]),
    new Set(["C"]),
    new Set(["B"]),
    new Set(["A"]),
  ]);
});

test("graph with arrays forming a cycle", () => {
  const graph = new Map([
    ["A", ["B"]],
    ["B", ["C"]],
    ["C", ["A"]],
  ]);
  const result = tarjan(graph);
  assert.deepStrictEqual(result, [new Set(["A", "B", "C"])]);
});

test("graph with sets forming a cycle", () => {
  const graph = new Map([
    ["A", new Set(["B"])],
    ["B", new Set(["C"])],
    ["C", new Set(["A"])],
  ]);
  const result = tarjan(graph);
  assert.deepStrictEqual(result, [new Set(["A", "B", "C"])]);
});

test("mixed iterators forming nested cycles", () => {
  const graph = new Map([
    ["A", ["B"]],
    ["B", new Set(["C"])],
    ["C", ["A", "D"]],
    ["D", new Set(["E"])],
    ["E", ["D"]],
  ]);
  const result = tarjan(graph);
  assert.deepStrictEqual(result, [
    new Set(["D", "E"]),
    new Set(["A", "B", "C"]),
  ]);
});
