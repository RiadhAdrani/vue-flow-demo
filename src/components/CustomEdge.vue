<script lang="ts" setup>
import { BezierEdge, useVueFlow } from "@vue-flow/core";
import { onMounted, PropType, ref } from "vue";
import GradientPath from "../../../gradient-path/src/GradientPath";

const props = defineProps({
  id: String,
  source: String,
  target: String,
  data: Object as PropType<{
    sourceColor: { type: String; required: false; default: "white" };
    targetColor: { type: String; required: false; default: "black" };
  }>,
});

const { onNodeDrag } = useVueFlow();

const edge = ref(null);
const grEdge = ref<GradientPath>(null as unknown as GradientPath);

const getPath = (): SVGPathElement => {
  return (
    Array.from(document.querySelectorAll(".vue-flow__edge")).find(
      (item) => (item as SVGGElement).dataset.id === props.id!
    ) as SVGGElement
  ).querySelector("path") as SVGPathElement;
};

const drawGradient = () => {
  const path = getPath();

  if (grEdge.value !== null) {
    grEdge.value.group.remove();
  }

  const gp = new GradientPath({
    path,
    segments: 20,
    samples: 3,
    precision: 2,
  });

  gp.render({
    type: "path",
    fill: [
      { color: props.data!.sourceColor, pos: 0 },
      { color: props.data!.targetColor, pos: 1 },
    ],
    width: 3,
  });

  grEdge.value = gp;
};

onNodeDrag(() => {
  drawGradient();
});

onMounted(() => {
  drawGradient();
});
</script>

<template>
  <BezierEdge
    ref="edge"
    :id="id"
    :source="source"
    :target="target"
    :updatable="true"
    :class="id"
    :style="{ stroke: 'transparent' }"
  />
</template>
