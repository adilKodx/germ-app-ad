<template>
    <div class="relative" :id="'selectid' + this._uid">
        <div class="w-full relative h-auto select-input">
            <div class="select pb-0 overflow-hidden
                    border border-gray-200
                    rounded list-none
                    absolute w-full bg-white"
                 :class="{'error': $v.userSelected.$error}">

                <div class="absolute right-0 cursor-pointer pr-2 sm:pr-4 top-0 flex items-center"
                     @click="toggleListVisibility"
                     :class="{
                        '-large-arrow': !small,
                        '-small': small,
                        'mt-3': small,
                     }">

                    <i class="ion-ios-arrow-down text-xl"
                       :class="{ expand: shouldOpen, 'flex': small, 'items-center': small }"
                       v-if="showIcon == 'yes'"
                       >
                    </i>
                </div>

                <div class="select-input -custom-padding flex items-center"
                     :class="{
                        '-small': small,
                        'px-4': small,
                     }"
                     id="option-selected"
                     @click="toggleListVisibility"
                     role="button"
                     aria-labelledby="dropdown-label">

                    <span>
                        {{selected}}
                    </span>
                </div>

                <!--<transition name="fade">-->
                <!--<div class="w-full h-px -mb-px" v-if="selectOpen">-->
                <!--<div class="w-full h-px bg-gray-100"></div>-->
                <!--</div>-->
                <!--</transition>-->

                <vue-custom-scrollbar :suppressScrollX="true">
                    <transition name="open">
                        <div class="dropdown-container" :aria-expanded="open" role="list" v-if="shouldOpen">
                            <div class="dropdown-list w-full flex-col flex">
                                <span v-for="(option, index) in optionsRemoveSelected" :key="option + index"
                                      @click.prevent="setSelected(option)">

                                    <div class="option hover:bg-gray-0 p-4 pb-3 w-full h-full cursor-pointer"
                                         :id="`option-${index}`">

                                        {{option}}
                                    </div>
                                </span>
                            </div>
                        </div>
                    </transition>
                </vue-custom-scrollbar>
            </div>
        </div>

        <div class="error-container text-red-100" v-if="$v.userSelected.$error">
            <div>
                {{errormessage}}
            </div>
        </div>
    </div>
</template>

<script>
    import { mapFields } from 'vuex-map-fields';
    import vueCustomScrollbar from 'vue-custom-scrollbar'
    import { userSelectedCheck } from "../../utils/validators";
    import { EventBus } from '../../utils/eventBus.js';

    export default {
        name: "Select",
        model: {
            event: "click"
        },
        components: {
            vueCustomScrollbar
        },
        props: {
            options: {
                type: [Array, Object, String],
                required: true
            },
            placeholder: {
                type: String,
                required: false,
                default: 'Selecteer'
            },
            value: {
                type: String,
                default: ''
            },
            small: {
                type: Boolean,
                default: false
            },
            validators: {
                type: [Array, Object, String],
                required: false
            },
            errormessage: {
                type: String,
                required: false,
                default: 'Required'
            },
            name: {
                type: String
            },
            showIcon: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                selected: '',
                userSelected: false,
                open: false,
            }
        },
        validations() {
            return {
                userSelected: {
                    userSelectedCheck
                },
            }
        },
        methods: {
            toggleListVisibility(event) {
                if(this.selectOpen == this._uid) {
                    this.selectOpen = 0;
                } else {
                    this.selectOpen = this._uid;
                }

                if (event.type === "click") {
                    this.open = !this.open;
                }
            },
            setSelected(option) {
                const selected = option;
                this.selected = selected;

                this.userSelected = true;

                this.update(selected);
                this.toggleListVisibility(event);

            },
            update(value) {
                this.updateValidation();
                this.$emit('click', value);
            },
            updateValidation() {
                if(!this.validators){
                    return;
                }

                this.$v.userSelected.$touch();

                setTimeout(() => {
                    let payload = {
                        id: 'selectid' +this._uid
                    };

                    if (this.$v.userSelected.$error) {
                        payload = {
                            ...payload,
                            error: true,
                            message: this.errormessage
                        };
                    }
                    this.$emit('errors', payload)
                }, 1);

            },
            errorCheck(){
                this.updateValidation()
            },
            setSelect(payload){
                if(payload.name == this.name){
                    this.selected = payload.val;
                }
            }
        },
        computed: {
            shouldOpen(){
                return this.selectOpen == this._uid;
            },
            ...mapFields([
                'inputs.selectOpen'
            ]),
            localValue(){
                return this.value;
            },
            optionsRemoveSelected(){
                return this.options.filter((el) => el !== this.selected)
            }
        },
        mounted(){
            EventBus.$on('checkValidation', this.errorCheck);
            EventBus.$on('resetSelect', this.setSelect);

            if(this.value){
                this.selected = this.value;
                this.userSelected = true;
            }


            if (this.placeholder && this.value.length == 0) {
                this.selected = this.placeholder;
            }
        },
        destroyed(){
            EventBus.$off('checkValidation', this.errorCheck);
            EventBus.$off('resetSelect', this.setSelect);
        }

    }
</script>

<style scoped lang="scss">

</style>
