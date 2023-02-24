<template>
       <div>
           <div class="mb-12">
               <!--<div class="step">{{getLabel('Scroll up for previous question')}}</div>-->

               <h2 class="header header-2 mb-4">{{getLabel('Add a free 25% to my donation through Gift Aid')}}</h2>

               <div v-if="!readMore">
                   <!-- Add sm:text-lg -->
                   <p class="mb-8 ">
                       {{getLabel('Gift Aid Paragraph Preview')}}
                       <tool-tip :text="getLabel('Gift Aid Paragraph')" class="flex justify-start " :width="'50%'">
                           <div class="text-blue-100 font-semibold cursor-pointer">
                                Read more
                           </div>
                       </tool-tip>
                   </p>
               </div>
               <div v-else>
                    <p class="mb-8">{{getLabel('Gift Aid Paragraph')}}</p>
               </div>
           </div>
            <div v-if="changeGiftAidOption" >
                <radio  :buttons="buttons"
                        name="giftAid"
                        @change="addDonation"
                        :border="true"
                        :largeLabel="false"
                        :full-width="true">
                </radio>
            </div>
           <transition name="fade">
                <p class="bold-dark mb-4 -warn" v-if="!giftAidClicked">
                    Please select an option to Ga verder
                </p>
           </transition>

           <!--<p class="mb-6 text-sm">-->
               <!--{{getLabel('Gift Aid Sub Text')}}-->
           <!--</p>-->
       </div>
</template>

<script>
    import Radio from './inputs/Radio';
    import ToolTip from './inputs/ToolTip';
    import { mapGetters } from 'vuex';
    import { mapFields } from 'vuex-map-fields';
    import { zakatableAssets, totalLiabilities, roundToTwo, numberWithCommas, calcPercentOfNum } from './../utils/helpers';
    // import uniqid from 'uniqid';

    export default {
        name: "GiftAid",
        components: { Radio, ToolTip },
        data(){
            return {
                readMore: false
            }
        },
        methods: {
            addDonation(val){
                this.giftAidClicked = true;

                this.$emit('select', true);

                if(val == 1){
                    this.$store.commit('SET_GIFT_AID',{
                        giftAidValue: 1,
                        giftAidClicked: true,
                        isTaxPayer: true,
                        amount: calcPercentOfNum(this.total(), 25)
                    })
                } else {
                    this.$store.commit('SET_GIFT_AID', {
                        giftAidValue: 2,
                        giftAidClicked: true,
                        isTaxPayer: false,
                        amount: 0
                    })
                }
            },
            netAssets(){
                return roundToTwo(zakatableAssets() - totalLiabilities())
            },
            total(){
                return parseFloat(this.getRegularDonationsTotal()) + parseFloat(this.getSingleDonationsTotal());
            }
        },
        computed:{
            ukTaxPayer(){
                return 'Yes, add €' + roundToTwo(calcPercentOfNum(this.total(), 25)).toFixed(2) +  ' of Gift Aid';
            },
            notUkTaxPayer(){
                return 'No, do not add Gift Aid';
            },
            ...mapGetters([
                'getZakatDeliveryCost',
                'getZakat',
                'getTotalDonation',
                'getRegularDonationsTotal',
                'getSingleDonationsTotal',
                'getLabel'
            ]),
            ...mapFields([
                'donation.giftAid',
                'donation.giftAidAmount',
                'donation.giftAidClicked',
                'donation.giftAidValue',
                'donation.changeGiftAidOption'
            ]),
            formatZakat(){
                return numberWithCommas(this.getZakat());
            },
            buttons(){
                return [
                    {
                        name: this.ukTaxPayer,
                        value: 1,
                        selected: this.giftAidClicked ? this.giftAid : false
                    },
                    {   name: this.notUkTaxPayer,
                        value: 2,
                        selected: this.giftAidClicked ? !this.giftAid : false
                    }
                ]
            },
        }
    }
</script>
