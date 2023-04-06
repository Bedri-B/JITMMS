<template>
  <div class="mb-3">
    <input
      type="text"
      class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
      placeholder="Query"
      v-model="inputVal"
    />
  </div>
</template>

<script>
export default {
  name: "Input",
  props: ["value"],
  data() {
    return { inputVal: this.value };
  },
  watch: {
    inputVal(val) {
      this.$emit("input", val);
    },
  },
};
</script>

<style scoped>
input[type="range"] {
  -webkit-appearance: none;
  height: 4px;
  border-radius: 5px;
  background: rgba(46, 91, 255, 0.15);
  transition: opacity 0.15s ease-in-out;
  @apply opacity-75 outline-none text-white w-full;
}

input[type="range"]:hover {
  opacity: 1;
}

/*==============================*/
/* le curseur                   */
/*==============================*/
input[type="range"]::-webkit-slider-thumb {
  width: 8px;
  height: 8px;
  @apply border-solid border-4 border-primary-normal rounded-full bg-white cursor-pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 8px;
  height: 8px;
  @apply border-solid border-4 border-primary-normal rounded-full bg-white cursor-pointer;
}

input[type="range"]::-ms-thumb {
  width: 8px;
  height: 8px;
  @apply border-solid border-4 border-primary-normal rounded-full bg-white cursor-pointer;
}

[type="range"]::-moz-range-progress {
  width: 4px;
  height: 4px;
  @apply bg-primary-normal;
}

[type="range"]::-ms-fill-lower {
  width: 4px;
  height: 4px;
  @apply bg-primary-normal;
}
</style>
