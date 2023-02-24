<template>
  <div
    class="btn font-semibold rounded-full"
    @click="emitClick"
    :class="{
      '-small': small,
      'label-fix sm:text-lg': size == 'sm',
      'sm:text-lg': size !== 'sm',
      'change-max-width': size == 'large',
    }"
  >
    <span class="inner-btn-text font-heading-2">
      <slot></slot>
    </span>
  </div>
</template>

<script>
export default {
  name: "Btn",
  props: ["small", "size"],
  methods: {
    emitClick() {
      this.$emit("click");
    },
  },
};
</script>

<style scoped>
/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .label-fix {
    width: 100% !important;
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .label-fix {
    max-width: 330px !important;
    width: 115% !important;
    margin-right: 300px !important;
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  .label-fix {
    max-width: 330px !important;
    width: 115% !important;
    margin-right: 300px !important;
  }
}
</style>
