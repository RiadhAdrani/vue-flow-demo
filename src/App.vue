<script lang="ts" setup>
import { VueFlow, useVueFlow, GraphNode, ConnectionLineProps } from "@vue-flow/core";
import { onMounted, ref } from "vue";
import CustomEdge from "./components/CustomEdge.vue";
import CustomNode from "./components/CustomNode.vue";
import GUI from "data-gui";
import CustomConnection from "./components/CustomConnection.vue";

const {
  onConnect,
  findNode,
  findEdge,
  addEdges,
  onEdgeContextMenu,
  removeEdges,
  onConnectStart,
  connectionLineOptions,
} = useVueFlow({
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
      position: { x: 10, y: 150 },
      data: {
        name: "RandomEmail",
        subName: "randomEmail",
        output: { color: "green", dataType: "string", name: "email" },
      },
    },
    {
      type: "custom",
      id: "password-input",
      position: { x: 5, y: 300 },
      data: {
        name: "RandomString",
        subName: "randomString",
        output: { color: "red", dataType: "string", name: "password" },
      },
    },
    {
      type: "custom",
      id: "get-token",
      position: { x: 10, y: 450 },
      data: {
        name: "GetToken",
        subName: "getToken",
        output: { color: "fuchsia", dataType: "string", name: "token" },
      },
    },
    {
      type: "custom",
      id: "get-url",
      position: { x: 20, y: 600 },
      data: {
        name: "GetURL",
        subName: "getUrl",
        output: { color: "gold", dataType: "string", name: "url" },
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
          { color: "aquamarine", dataType: "string", name: "currentToken" },
          { color: "cornflowerblue", dataType: "string", name: "url" },
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
        output: { color: "blue", dataType: "string", name: "response" },
      },
    },
    {
      id: "render",
      type: "custom",
      position: { x: 800, y: 400 },
      data: {
        name: "Render",
        subName: "render",
        inputs: [{ color: "blueviolet", dataType: "object", name: "response" }],
        output: { color: "coral", dataType: "string", name: "html" },
      },
    },
    {
      id: "get-root",
      type: "custom",
      position: { x: 800, y: 600 },
      data: {
        name: "getRoot",
        subName: "getRoot",
        output: { color: "white", dataType: "string", name: "element" },
      },
    },
    {
      id: "mount",
      type: "custom",
      position: { x: 1100, y: 400 },
      data: {
        name: "Mount",
        subName: "mount",
        inputs: [
          { color: "cyan", dataType: "object", name: "html" },
          { color: "deeppink", dataType: "object", name: "root" },
        ],
      },
    },
  ],
  edges: [],
  // create links automatically
  // not what we want really
  autoConnect: false,
  // disable connecting by clicking
  connectOnClick: false,
});

onConnect((connection) => {
  const source = connection.source;
  const target = connection.target;

  const id = `from-${source}-to-${target}`;

  const edge = findEdge(id);

  if (edge) {
    return;
  }

  const sourceNode = findNode(source) as GraphNode;
  const targetNode = findNode(target) as GraphNode;

  const targetColor = targetNode.data.color;
  const sourceColor = sourceNode.data.color;

  const sourceParent = sourceNode.parentNode;
  const targetParent = targetNode.parentNode;

  addEdges([
    {
      id,
      type: "custom",
      source,
      target,
      data: { targetColor, sourceColor, sourceParent, targetParent },
      style: { "stroke-width": "2px" },
    },
  ]);
});

onEdgeContextMenu((event) => {
  event.event.preventDefault();
  removeEdges([event.edge.id]);
});

const connectionColor = ref("white");

onConnectStart((event) => {
  const getPort = () =>
    Array.from(document.querySelectorAll(".vue-flow__node")).find(
      (port) => (port as HTMLDivElement).dataset.id === event.nodeId
    ) as HTMLDivElement;

  const port = getPort();

  const color = port.style.getPropertyValue("--vf-node-color");

  connectionColor.value = color;
});

const target = ref({ segments: 15, updateOnDrag: true });

onMounted(() => {
  const gui = new GUI({ theme: "dark", name: "Configuration" });

  gui
    .add("segments", target.value, {
      min: 5,
      max: 50,
      step: 1,
      name: `Segments`,
      value: target.value.segments,
    })
    .on("input", (segments: number) => {
      target.value = { ...target.value, segments };
    });

  gui
    .add("updateOnDrag", target.value, {
      name: "Update on drag",
      value: target.value.updateOnDrag,
    })
    .on("change", (updateOnDrag: boolean) => {
      target.value = { ...target.value, updateOnDrag };
    });
});
</script>
<template>
  <div style="height: 700px; width: 900px; background-color: #1e1e1e">
    <VueFlow>
      <template #node-custom="props">
        <CustomNode :data="props.data" :id="props.id" :position="props.position" />
      </template>
      <template #edge-custom="props">
        <CustomEdge
          v-bind="props"
          :segments="target.segments"
          :updateOnDrag="target.updateOnDrag"
        />
      </template>
      <template #connection-line="props">
        <CustomConnection
          :source-x="(props as ConnectionLineProps).sourceX"
          :source-y="(props as ConnectionLineProps).sourceY"
          :target-x="(props as ConnectionLineProps).targetX"
          :target-y="(props as ConnectionLineProps).targetY"
          :color="connectionColor"
        />
      </template>
    </VueFlow>
  </div>
</template>

<style>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";
</style>
