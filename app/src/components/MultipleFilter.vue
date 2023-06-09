<template>
    <div class="mt-8 w-full">
        <template v-if="type === '_switch'">
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-black-1">{{ title }}</h3>
                <SwitchBtn v-model="inputVal">
                </SwitchBtn>
            </div>
        </template>

        <template v-if="type === 'slider'">
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-black-1">{{ title }}</h3>
                <p class="text-gray-1">{{ value }}</p>
            </div>
            <Slider :min-value="minValue"
                    :max-value="maxValue"
                    v-model="inputVal">
            </Slider>
        </template>

        <template v-if="type === 'multiple-select'">
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-black-1">{{ title }}</h3>
            </div>
            <Multiselect
                    v-model="inputVal"
                    :options="data"
                    :multiple="true"
                    :close-on-select="false"
                    :clear-on-select="false"
                    placeholder="Pick some status">
            </Multiselect>
        </template>

        <template v-if="type === 'single-select'">
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-black-1">{{ title }}</h3>
            </div>
            <Multiselect
                    v-model="inputVal"
                    :options="data"
                    :multiple="false"
                    :close-on-select="false"
                    :clear-on-select="false"
                    placeholder="Pick some status">
            </Multiselect>
        </template>

        <template v-if="type === 'single-select-boolean'">
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-black-1">{{ title }}</h3>
            </div>
            <Multiselect
                    v-model="inputVal"
                    :options="data"
                    :multiple="false"
                    :close-on-select="false"
                    :clear-on-select="false"
                    placeholder="Pick some status">
            </Multiselect>
        </template>

        <template v-if="type === 'search'">
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-black-1">{{ title }}</h3>
            </div>
            <InputField
                    v-model="inputVal">
            </InputField>
        </template>
    </div>
</template>

<script>
  import Slider from "../components/Slider";
  import Multiselect from "vue-multiselect";
  import 'vue-multiselect/dist/vue-multiselect.min.css';
  import SwitchBtn from "./SwitchBtn";
  import InputField from "./Input";

  export default {
    name: "MultipleFilter",
    components: {
        SwitchBtn,
      Multiselect,
      Slider,
        InputField,
    },
    props: [
      'title',
      'type',
      'value',
      'data',
      'search',
      'minValue',
      'maxValue'
    ],
    data() {
      return { inputVal: this.value }
    },
    watch: {
      inputVal(val) {
        this.$emit('input', val);
      }
    }
  }
</script>

<style>
    .multiselect { @apply text-primary-normal; }
    .multiselect__select::before { @apply text-gray-1; }
    .multiselect__tags { @apply border-gray-1; }
    .multiselect__tag,
    .multiselect__option--selected.multiselect__option--highlight,
    .multiselect__option--selected.multiselect__option--highlight::after { @apply bg-primary-normal; }
    .multiselect__tag-icon::after { @apply text-white; }
    .multiselect__tag-icon:focus, .multiselect__tag-icon:hover { @apply bg-black-1 text-white; }
    .multiselect__content-wrapper { @apply border-gray-1; }
    .multiselect__option--highlight { @apply bg-primary-normal text-white; }
    .multiselect__option--highlight::after { @apply bg-primary-normal text-white; }
</style>