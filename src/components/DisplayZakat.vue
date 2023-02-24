<template>
    <div class="display-zakat">
        <h1 class="header header-2 text-3xl mb-4">{{getLabel('Your zakat calculation')}}</h1>
        <!-- Change sub-text to sm:text-lg -->
        <p class="sub-text mb-6 sm:mb-12">
            {{getLabel('Zakat Display Paragraph')}}
        </p>

        <div class="flex sm:flex-row sm:-mx-4">
            <div class="w-1/2 sm:mx-4 mb-4">
                <hr>

                <div class="sub-text">{{getLabel('Your zakatable assets')}}</div>

                <div class="text-1-5xl sm:text-2-5xl text-black font-semibold truncate font-heading-2">{{zakatableAssets()}}</div>
            </div>

            <div class="w-1/2 sm:mx-4 mb-4">
                <hr>

                <div class="sub-text">{{getLabel('Your liabilities')}}</div>

                <div class="text-1-5xl sm:text-2-5xl text-red-300 font-semibold truncate font-heading-2">{{totalLiabilities()}}</div>
            </div>
        </div>

        <div class="flex sm:flex-row sm:-mx-4 mb-6">
            <div class="w-1/2 sm:mx-4 mb-4">
                <hr>

                <div class="sub-text">{{getLabel('Net assets')}}</div>

                <div class="text-1-5xl sm:text-2-5xl text-red-300  font-semibold truncate font-heading-2">{{netAssets()}}</div>
            </div>

            <div class="w-1/2 sm:mx-4 ">
                <hr>

                <div class="sub-text">{{getLabel('Nisab Value')}}</div>

                <div class="text-1-5xl sm:text-2-5xl text-black flex items-center">
                    <div class="font-semibold mr-4 font-heading-2">{{ nisabValue }}</div>

                    <div>
                        <right-pop-up :offset="16">
                            <template v-slot:label>
                                <div class="bg-gray-200 w-4 h-4 flex justify-center items-center rounded-full -mt-2 cursor-pointer relative z-50">
                                    <span class="icon-container h-full overflow-hidden">
                                        <i class="ion-ios-help text-white help-icon h-full flex items-center"></i>
                                    </span>
                                </div>
                            </template>

                            {{getLabel('Nisab Tool Tip')}}
                        </right-pop-up>
                    </div>
                </div>
            </div>
        </div>

        <div class="items-center flex flex-col flex-wrap text-2xl p-4 sm:pt-8 sm:pb-5 sm:px-8 rounded border border-red-300 bg-white text-red-300 mb-10 md:-mt-4">
            <div class="w-full text-sm text-gray text-base font-semibold font-heading-2">{{getLabel('Your Payable Zakat')}}</div>
            <div class="w-full text-4xl font-heading-2 font-semibold leading-none sm:leading-normal truncate">{{formatZakat()}} </div>
        </div>
    </div>
</template>

<script>
    import RightPopUp from './inputs/RightMobilePopUp';
    import { deliveryFeeText } from '../utils/GlobalVars';
    import { mapGetters } from 'vuex';
    import { mapFields } from 'vuex-map-fields';
    import { zakatableAssets, totalLiabilities, roundToTwo, numberWithCommas, zakatCalc } from './../utils/helpers';

    export default {
        name: "DisplayZakat",
        components: { RightPopUp  },
        data(){
            return {

                show: false
            }
        },
        methods: {
            addDonation(val){
                if(val == 1){
                    this.$store.dispatch('addDonation', {
                        name: deliveryFeeText,
                        amount: this.getZakatDeliveryCost(),
                        id: 3,
                        paymentType: 'Single Donation'
                    })
                } else {
                    this.$store.dispatch('deleteDonation', 3)
                }
            },
            netAssets(){
                return numberWithCommas(roundToTwo(zakatableAssets() - totalLiabilities()))
            },
            zakatableAssets(){
                return numberWithCommas(zakatableAssets()).toLocaleString();
            },
            totalLiabilities() {
                return numberWithCommas(totalLiabilities());
            },
            formatZakat(){
                this.donationTypes[0].amount = parseFloat(this.getZakatCalc()).toFixed(2);
                return numberWithCommas(zakatCalc());
            }
        },
        computed: {
            ...mapGetters([
                'getZakatDeliveryCost',
                'getZakat',
                'getOriginalZakat',
                'getZakatCalc',
                'getLabel',
                'getNissab'
            ]),
            ...mapFields([
                'donation.donationTypes',
                'donation.zakat',
                'nissab'
            ]),
            nisabValue(){
                return numberWithCommas(this.getNissab().toFixed(2));
            },
            zakatNextButton(){
                if(this.showRound){
                    return {text: 'Ga verder', skip: false, conditional: true }
                } else {
                    return {text: 'Ga verder', skip: false, path: '/geef-zakat', conditional: true}
                }
            },
            showRound(){
                return this.getOriginalZakat() % 10
            }
        },
        mounted(){
            window.scrollTo(0, 0);

            this.donationTypes[0].amount = parseFloat(this.getZakatCalc()).toFixed(2);
            this.zakat = this.getZakatCalc()
        },
        beforeDestroy(){
            this.$store.commit('SET_RECOMMENDED_ZAKAT');
        }
    }
</script>

<style scoped>

</style>
