<template>
    <div class="flex w-full flex-wrap checkbox">
        <div v-for="(checkbox, index) in checkboxes" :key="checkbox + index"
             class="checkbox-container flex justify-start align-center mb-8"
            :class="{'w-full': fullWidth, ' w-1/2 sm:w-1/3': !fullWidth, '-half-width': cols == 2}">

            <input  class="checkbox-input"
                    type="checkbox"
                    :name="checkbox.name"
                    :id="checkbox.name + index"
                    :value="checkbox.value"
                    v-model="checkedValues"
                    @change="update"
            >

            <label :for="checkbox.name + index"
                   class="mb-0 text-md font-semibold items-start flex w-full">

                <span class="text-lg -mb-1 w-4/5 relative" :class="{'full-width': fullWidth, 'text-justify': small}">
                    <span class="sm:absolute top-0 pr-2 text-xs " v-if="small">
                        {{checkbox.name}}
                    </span>
                    <span class="sm:absolute top-0 pr-2" v-else>
                        {{checkbox.name}}
                    </span>
                </span>

            </label>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Checkbox",
        model: {
            event: 'update'
        },
        props: {
            checkboxes: {
                type: [Array, Object, String],
                required: true
            },
            fullWidth: {
                type: Boolean,
                default: false
            },
            small: {
                type: Boolean,
                default: false
            },
            cols: {
                type: Number,
                default: 3
            }
        },
        data() {
            return {
                checkedValues: []
            }
        },
        methods: {
            update() {
                this.$emit('update', this.checkedValues);
            }
        },
        mounted(){
            this.checkboxes.map((el => {
                if(el.selected) {
                    this.checkedValues.push(el.value);
                }
            }))
        }
    }
</script>

<style scoped lang="scss">
    .checkbox {
        user-select: none;
    }

    .checkbox-input {
        position: absolute;
        left: -999999px
    }

    .full-width {
        @include sm {
            /*width: 100% !important;*/
        }
    }
</style>
