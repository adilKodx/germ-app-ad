<template>
    <div class="relative w-full h-full">
        <button @click.stop="togglePopUp" class="focus:outline-none text-blue-100 font-semibold block h-full">
            {{label}}
            <slot name="label"></slot>
        </button>

        <transition name="fade">
            <div v-if="openMessage"
                 class="pop-up -right bg-blue w-full p-4 text-sm"
                 :style="{ marginLeft: offsetCalc + 'px' }" v-click-outside="hide">
                <div>
                    <slot></slot>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import { mapFields } from 'vuex-map-fields';

    export default {
        name: "LearnMorePopUp",
        props: {
            label: {
                type: String,
            },
            offset: {
                type: Number
            }
        },
        methods: {
            togglePopUp() {
                if (this.messageOpen === this._uid) {
                    this.messageOpen = 0;
                } else {
                    this.messageOpen = this._uid;
                }
            },
            hide() {
                this.messageOpen = 0;
            }
        },
        computed: {
            openMessage(){
                return this.messageOpen === this._uid;
            },
            ...mapFields([
                'messages.messageOpen'
            ]),
            offsetCalc(){
                return this.offset - (this.offset*2);
            }
        }
    }
</script>
