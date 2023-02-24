<template>
    <div class="flex flex-col sm:flex-row donation-preset mb-6">

        <hr class="sm:hidden preset-separate-bar">

        <div class="sm:pl-2 sm:w-full regular-preset">
            <div class="bg-white ">
                <!-- <h3 class="text-center text-blue-200">{{paymentTypeNames.regular}}</h3> -->

                <div class="flex flex-wrap flex-grow justify-between preset-btn-container  sm:justify-center ">
                    <div v-for="(amount, index) in singleAmounts"
                         :class="{'-active': selectedSingle == amount, 'setMargin': index, '-middle': index == 1 && selectedSingle !== amount, 'border border-gray-200': index !== 1 && selectedSingle !== amount }"
                         :key="amount"
                         @click="addDonation(amount, paymentTypeNames.single, index)"
                         class="items-center text-center py-2 rounded preset-btn cursor-pointer" >
                        <v-icon v-if="index !== 1 && selectedSingle !== amount" style="color: green; background-color: white" class="header-icon" scale="1.5" name="regular/heart" />
                        <v-icon v-else-if="index !== 1 && selectedSingle == amount" style="color: green; background-color: white" class="header-icon" scale="1.5" name="heart" />
                        
                        <v-icon v-if="index == 1 && !selected && !middleSelected" style="color: green; background-color: white" class="header-icon" scale="1.5" name="heart" />
                        <v-icon v-if="index == 1 && middleSelected" style="color: green; background-color: white" class="header-icon" scale="1.5" name="heart" />
                        <v-icon v-if="index == 1 && selected && !middleSelected" style="color: green; background-color: white" class="header-icon" scale="1.5" name="regular/heart" />

                        
                        <div class="-mb-1" v-if="id == '3-zakat-ul-fitir'">
                            {{index+1 == 1 ? index+1 + " stuk" : index+1 + " stuks"}} 
                        </div>
                        <div class="-mb-1" v-else>
                            €{{amount}}
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import { paymentTypes } from "../utils/GlobalVars";
    // import { EventBus } from '../utils/eventBus';
    import { mapState } from 'vuex';
    import {  mapFields } from 'vuex-map-fields';
    import _ from 'lodash';

    export default {
        name: "PresetDonationEid",
        props: ['id', 'name'],
        data(){
            return {
                singleAmounts: this.id == "3-zakat-ul-fitir" ? [30,60,90] : [50, 25, 10],
                selectedSingle: '',
                selectedRegular: '',
                selected: false,
                middleSelected: false
            }
        },
        methods: {
            addDonation(amount, paymentType, index){

                let donation = {
                    id: this.id,
                    amount: amount,
                    name: this.name,
                    paymentType: paymentType,
                    selectedPaymentType: paymentType
                    
                };
                if(paymentType == paymentTypes.single){
                    this.selectedSingle = amount;

                }
                this.setPreset(amount, paymentType, this.id, index);
                // EventBus.$emit('resetSelect', {name:this.id , val:paymentType})

                this.$store.dispatch('addDonation', donation);
                if(index == 1){
                    this.middleSelected = true
                    this.selected = false
                } else {
                    this.selected = true
                    this.middleSelected = false
                }
               
            },
            // clearPresets(val){
            //     if(val == this.id){
            //         this.selectedSingle = '';
            //         this.preset.id = '';
            //         this.preset.amount = '';
            //         this.preset.paymentType = '';
            //     }
            // },
            setPreset(amount, paymentType, id, index){
                this.presetEid.key = index;
                this.presetEid.id = id;
                this.presetEid.amount = amount;
                this.presetEid.paymentType = paymentType;
            }
        },
        computed: {
            paymentTypeNames(){
                return paymentTypes;
            },
            ...mapFields([
                'presetEid'
            ]),
            ...mapState({
                donationData: state => state.donation
            }),
        },
        mounted(){
            // EventBus.$on('clearPresets', this.clearPresets);
            
            if(!_.isEmpty(this.presetEid)){
                if(!_.isEmpty(this.presetEid.id)){
                        if(this.presetEid.key == 1){
                            this.selected = false
                            this.middleSelected = true
                        } else if(this.presetEid.key == 0 || this.presetEid.key == 2) {
                            this.selected = true
                            this.middleSelected = false
                        }
                }
                 
                if(this.presetEid.paymentType == paymentTypes.single){
                    this.selectedSingle = this.presetEid.amount;
                }
            }
        },
        destroyed(){
            // EventBus.$off('clearPresets', this.clearPresets);
        }
    }
</script>

<style scoped>
.preset-btn-container .preset-btn {
    margin-right: 25px;
    margin-left: 25px;
    width: calc(23.33% - 10px)
}
@media (max-width: 750px) {
    .preset-btn-container .preset-btn {
        margin: 5px;
        width: calc(33.33% - 10px)
    }
    .header-icon {
        left:11px;
    }
}
.setMargin{
    margin-left: 2rem;
}
</style>
