<template>
    <div v-sticky sticky-offset="{top: 130}" sticky-z-index="20">
        <slot></slot>
    </div>
</template>
<script>
    export default {
        name: 'sticky',
        data() {
            return {
                shouldStick: true,
            }
        }
    }
</script>
