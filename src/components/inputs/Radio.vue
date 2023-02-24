<template>
    <div class="flex justify-between w-full radio-component"
        :class="{
            'flex-col':fullWidth && border,
            'flex-wrap': wrap,
            '-no-wrap-container': !wrap
        }">
 
        <div v-for="(button, index) in buttons" :key="button + index"
             class=" bg-white px-4 py-2 sm:p-4 radio-container flex justify-start align-center cursor-pointer mb-2 md:mb-6"
            :id="assignGtagIds(button.name,0,index)"
             @click.prevent="update(button.value)"
             :class="{
                 selected: button.value === selected,
                 'w-1/3': !fullWidth,
                 'small-radio': !fullWidth,
                 'small': !fullWidth,
                 'w-full': fullWidth,
                 'full-width': fullWidth,
                 '-no-wrap': !wrap,
                 'input-container': border
             }">
<!--:id="uniqueId(index, button.name)"-->
            <input
                type="radio"
                :id="assignGtagIds(button.name,1,index)"
                :name="button.name"
                :value="button.value"
                v-model="selected"
                class="radio-input"
                checked>

            <label :for="uniqueId(index, button.name)"
                   v-if="button.name"
                   class="mb-0 radio-label bold-dark "
                    :id="assignGtagIds(button.name,0,index)"
                    :class="{'small-label': !fullWidth}">

                <div class="absolute checkmark-icon" v-if="button.value === selected" :id="assignGtagIds(button.name,0,index)">
                    <i class="text-red-300 ion-ios-checkmark-circle radio-check-icon" :id="assignGtagIds(button.name,0,index)"></i>
                </div>

                <div class="radio-btn-text"
                :class="{
                    'ml-4 ': fullWidth
                 }" :id="assignGtagIds(button.name,0,index)">
                    <span :class="{'radio-text': !largeLabel, 'radio-text-lg': largeLabel}"  :id="assignGtagIds(button.name,0,index)">{{button.name}}</span>
                </div>
            </label>
        </div>
    </div>
</template>

<script>
    import { EventBus } from '../../utils/eventBus';

    export default {
        name: "Radio",
        model: {
            event: "change"
        },
        props: {
            buttons: {
                type: [Array, Object, String],
                required: true
            },
            fullWidth: {
                type: Boolean,
                default: false
            },
            required: {
                type: Boolean,
                default: true
            },
            default:{
                type: Number
            },
            id: {
                type: String
            },
            wrap: {
                type: Boolean,
                default: true
            },
            border: {
                type: Boolean,
                default: false
            },
            largeLabel: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                selected: null
            }
        },
        methods: {
            assignGtagIds(name,method,index) {
                return name.includes('10%') == true ? '10-percent-zakat': name.includes('100%') ? '100-percent-zakat' : name.includes('Yes') == true ? 'gift-aid-yes' : name.includes('No') == true ? 'gift-aid-no' : method == 1 ? this.uniqueId(index, name) : '';
                
            },
            update(value) {

                if(this.selected == value && !this.required){
                    this.selected = null;
                    this.$emit('change', this.selected);
                } else {
                    this.selected = value;
                    this.$emit('change', this.selected);
                }
            },
            uniqueId(index, name){
                return index + name.replace(/ /g,'') + this._uid
            },
            setValue(payload){
                if(payload.id == this.id){
                    this.selected = payload.val;
                }
            }
        },
        mounted() {
            this.buttons.map((el) => {
                if(el.selected){
                    this.selected = el.value;
                }

                if(this.default == el.value){
                    this.selected = el.value;
                }

            });


            if (this.selected) {
                this.$emit('init', this.selected);
            }

            EventBus.$on('setValue', this.setValue)
        },
        destroyed(){
            EventBus.$off('setValue', this.setValue)
        }
    }
</script>

<style scoped lang="scss">
    .checkmark-icon {
        left: 0px;
        top: -2px;
        font-size: 24px;
    }

    .radio-input {
        position: absolute;
        margin-right: -9999px
    }
</style>
