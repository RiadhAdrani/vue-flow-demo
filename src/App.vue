<script lang="ts" setup>
import { VueFlow, useVueFlow, GraphNode, Edge, Connection } from "@vue-flow/core";
import CustomEdge from "./components/CustomEdge.vue";
import CustomNode from "./components/CustomNode.vue";

const { onConnect, findNode, findEdge, addEdges } = useVueFlow({
  nodes: [
    {
      type: "custom",
      id: "age-input",
      position: { x: 20, y: 20 },
      data: {
        name: "RandomNumber",
        subName: "randomNumber",
        output: { color: "yellow", dataType: "number", name: "number" },
      },
    },
    {
      type: "custom",
      id: "email-input",
      position: { x: 20, y: 200 },
      data: {
        name: "RandomEmail",
        subName: "randomEmail",
        output: { color: "green", dataType: "string", name: "email" },
      },
    },
    {
      type: "custom",
      id: "password-input",
      position: { x: 20, y: 400 },
      data: {
        name: "RandomString",
        subName: "randomString",
        output: { color: "red", dataType: "string", name: "password" },
      },
    },
    {
      id: "auth",
      type: "custom",
      position: { x: 300, y: 200 },
      data: {
        name: "Auth",
        subName: "auth",
        inputs: [
          { color: "magenta", dataType: "number", name: "age" },
          { color: "cyan", dataType: "string", name: "email" },
          { color: "orange", dataType: "string", name: "password" },
        ],
        output: { color: "gray", dataType: "string", name: "auth" },
      },
    },
    {
      id: "redirect",
      type: "custom",
      position: { x: 600, y: 200 },
      data: {
        name: "Redirect",
        subName: "redirect",
        inputs: [{ color: "pink", dataType: "object", name: "token" }],
      },
    },
  ],
  edges: [],
  // create links automatically
  // not what we want really
  autoConnect: false,
});

onConnect((connection) => {
  const source = connection.source;
  const target = connection.target;

  const sourceNode = findNode(source) as GraphNode;
  const targetNode = findNode(target) as GraphNode;

  const targetColor = targetNode.data.color;
  const sourceColor = sourceNode.data.color;

  const id = `from-${source}-to-${target}`;

  const edge = findEdge(id);

  if (edge) {
    return;
  }

  addEdges([
    {
      id,
      type: "custom",
      source,
      target,
      data: { targetColor, sourceColor },
      style: { "stroke-width": "2px" },
    },
  ]);
});

const onEdgeUpdate = ({ edge, connection }: { edge: Edge; connection: Connection }) => {
  console.log(connection, edge);
};
</script>
<template>
  <div style="height: 700px; width: 900px; background-color: #1e1e1e">
    <VueFlow @edge-update="onEdgeUpdate">
      <template #node-custom="props">
        <CustomNode :data="props.data" :id="props.id" :position="props.position" />
      </template>
      <template #edge-custom="props">
        <CustomEdge v-bind="props" />
      </template>
    </VueFlow>
  </div>
</template>

<style>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";
</style>
