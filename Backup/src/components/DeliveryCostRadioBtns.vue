<template>
    <div>
        <radio  :buttons="buttons"
                name="donation-allocation-sliders"
                :required="true"
                :default="2"
                id="deliver-btns"
                @change="addDonation"
                :border="true"
                :largeLabel="false"
                :full-width="true"></radio>
    </div>
</template>

<script>
    import { numberWithCommas,currencyFormat } from '../utils/helpers';
    import { deliveryFeeText, deliveryFeeTextNoAddOn } from '../utils/GlobalVars';
    import { mapGetters } from 'vuex';
    import { EventBus } from '../utils/eventBus';
    import { mapFields } from 'vuex-map-fields';
    import Radio from './inputs/Radio';

    export default {
        name: "DeliveryCostRadioBtns",
        components: { Radio },
        data(){
            return {
                select: 2
            }
        },
        methods: {
            addDonation(val){
                this.$store.dispatch('deleteDonation', 3)
                if(val === 1){
                    this.deliveryCost = 1;

                    this.optIn = true;

                    this.$store.dispatch('addDonation', {
                        name: deliveryFeeText,
                        amount: this.getZakatDeliveryCost(),
                        id: 3,
                        paymentType:  this.donationTypes[0].paymentType
                    });
                    this.setValue(1);

                } else if(val === 2) {
                    this.deliveryCost = 2;
                    this.optIn = false;

                    this.$store.dispatch('addDonation', {
                        name: deliveryFeeTextNoAddOn,
                        amount: this.getZakatDeliveryCost(),
                        id: 3,
                        paymentType:  this.donationTypes[0].paymentType
                    });

                    this.setValue(2);
                }

                this.refreshSplit();

            },
            refreshSplit(){
                this.$store.dispatch('updateDonationsAmount', this.donationSplit);

                EventBus.$emit('zakatUpdated', this.getAllocatableZakat());
            },
            setValue(val){
                EventBus.$emit('setValue', {
                    id: 'deliver-btns',
                    val: val
                })
            }
        },
        computed: {
            buttons(){
                return [
                    {
                        name: 'NZF can use up to 10% of my Zakat to cover costs, leaving '+ currencyFormat(this.getDisplayAllocatableZakat()) +' for those who need it',
                        value: 2,
                        selected: this.deliveryCost == 2,
                        gtagId: '10-percent-zakat',
                    },
                    {
                        name: 'I’ll add '+ this.deliverFee +' to cover costs so 100% of my Zakat goes to those who need it',
                        value: 1,
                        selected: this.deliveryCost == 1,
                        gtagId: '100-percent-zakat',
                    }
                ]
            },
            deliverFee(){
                return  !isNaN(this.getZakatDeliveryCost()) ? numberWithCommas(this.getZakatDeliveryCost()) : 0;
            },
            ...mapGetters([
                'getZakatDeliveryCost',
                'getDisplayAllocatableZakat',
                'getAllocatableZakat',
                'getZakat',
                'getTotalSplit',
                'getLabel',
                'getSingleDonations',
                'getRegularDonations'
            ]),
            ...mapFields([
                'calculationSettings.deliveryCost',
                'donation.donationTypes',
                'donation.administration.optIn',
                'donation.allocation',
                'donation.donationSplit'
            ])
        },
        mounted(){
            window.scrollTo(0, 0);
            if(this.deliveryCost){
                this.select = this.deliveryCost;
            }
        }
    }
</script>

<style scoped>

</style>
