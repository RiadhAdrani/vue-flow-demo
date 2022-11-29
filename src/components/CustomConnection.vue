<script lang="ts" setup>
import { useVueFlow } from "@vue-flow/core";
import { computed } from "@vue/reactivity";

const { findNode } = useVueFlow();

const props = defineProps({
  sourceX: {
    type: Number,
    required: true,
  },
  sourceY: {
    type: Number,
    required: true,
  },
  targetX: {
    type: Number,
    required: true,
  },
  targetY: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <g>
    <path
      class="vue-flow__connection"
      fill="none"
      :stroke="color"
      :stroke-width="2.5"
      :d="`M${sourceX},${sourceY} C ${sourceX} ${targetY} ${sourceX} ${targetY} ${targetX},${targetY}`"
    />
  </g>
</template>
