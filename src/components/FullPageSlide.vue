<template>
    <div class="h-full page-container" :id="id" :class="{'-full-height': fullHeight}">
        <div class="flex items-center h-full w-full">
            <div class="w-full">
                <slot></slot>
                <p v-if="saveLabel" class="text-xs pb-4">Klik op 'Sla op' als jij later wil doorgaan met de berekening</p>
                <next-btn v-if="btns"
                          :active="nextBtn.conditional"
                          :text="nextBtn.text"
                          :skip="nextBtn.skip"
                          :path="nextBtn.path"
                          :activebutton="nextBtn.active"
                          :id="id"
                          :isMobile="isMobile"
                          :align="nextBtn.align"
                          :step="nextBtn.nextStep"
                          :prevStep="nextBtn.prevStep"
                          :gtagId="gtagId"
                          :additionalBtn="additionalBtn"
                          :saveCalculation="saveCalculation"
                          @additionalClick="$emit('additionalClick')"
                          @nextClick="$emit('nextClick')">
                </next-btn>
            </div>
        </div>
    </div>
</template>

<script>
    import NextBtn from './inputs/NextBtn';
    export default {
        components: { NextBtn },
        name: "FullPageSlide",
        props: {
            fullHeight: {
                default: true,
                type: Boolean
            },
            btns: {
                type: Boolean,
              default: true
            },
            saveLabel: {
                type: Boolean,
              default: false
            },
            nextBtn: {
                type: Object,
                default: () => {
                    return {
                        skip: true,
                        path: '',
                        conditional: true,
                        nextStep: null,
                        prevStep: null,
                        align: 'right'
                    }
                }
            },
            additionalBtn: {
                type: Object,
                default: () => {
                    return {
                        path: '',
                        text:'',
                        conditional: false,
                        gtagId: '',
                        next: false
                    }
                }
            },
            saveCalculation: {
            type: Object,
                default: () => {
                        return {
                            path: "",
                            text: "",
                            conditional: false,
                            gtagId: "",
                            next: false,
                            padding: {
                                type: Boolean,
                                default: true,
                        },
                    };
                },
            },
            gtagId: {
                type: String,
                default: ''
            },
            sectionId: {
                type: String
            },
            isMobile: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            id(){
                return this.sectionId || 'page' + this._uid;
            }
        }
    }
</script>

<style scoped>

</style>
