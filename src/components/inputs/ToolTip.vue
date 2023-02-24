<template>
    <div class="sm:relative h-full" :style="styleObject" v-click-outside="close">
        <div @click.stop="togglePopUp"
                class="focus:outline-none text-blue-100 font-semibold block">
            <button v-tooltip="toolTipSettings" >
                <slot></slot>
            </button>
        </div>
    </div>
</template>

<script>
    import { mapFields } from 'vuex-map-fields';
    import { EventBus } from '../../utils/eventBus';

    export default {
        name: "LearnMorePopUp",
        props: {
            label: {
                type: String,
            },
            text: {
                type: String,
                required: true
            },
            width: {
                type: String,
                default: 'full'
            }
        },
        data() {
            return {
                show: false
            }
        },
        methods: {
            togglePopUp() {
                if(!this.show){
                    EventBus.$emit('closeToolTips', {
                        id: this._uid,
                    });
                }

                this.show = !this.show;
            },
            close() {
                this.show = false;
            },
            hide() {
                this.messageOpen = 0;
            },
            closeFromEmit(id) {
                if(id != this._uid){
                    this.show = false;
                }
            }
        },
        computed: {
            openMessage() {
                return this.messageOpen === this._uid;
            },
            ...mapFields([
                'messages.messageOpen'
            ]),
            offsetCalc() {
                return this.offset - (this.offset * 2);
            },
            toolTipSettings() {
                return {
                    content: this.text,
                    show: this.show,
                    trigger: 'manual',
                    placement: 'bottom',
                    autoHide: true,
                    offset: '10px'
                }
            },
            styleObject(){
                let width;


                if(this.width == 'full'){
                    width = '100%';
                } else {
                    width = '50%';
                }


                return {
                    width: width
                }
            }
        },
        mounted() {

            EventBus.$on('closeToolTips', this.closeFromEmit);
        },
        destroyed() {
            EventBus.$off('closeToolTips', this.closeFromEmit);
        }
    }
</script>
