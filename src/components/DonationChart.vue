<template>
  <div class="h-auto border-gray-100 overflow-x-hidden">
    <div class="flex flex-col mb-2">
      <div class="remaining-money text-2xl flex flex-row items-center mb-8">
        <span class="flex items-end sm:items-center sm:-mb-2 pr-4">
          <span class="header-6">{{ currencyFormat(remainingMoney) }}</span>
          <div class="text-sm text-gray-300 ml-1 mb-2 sm:mb-0">van</div>
        </span>

        <div class="flex w-full sm:w-3/12 text-input donation-chart mr-6">
          <div class="relative">
            <input
              type="number"
              class="w-full text-center border border-gray-100 rounded
                      mb-2 sm:mb-0 mx-2
                      py-2
                      zakat-input header-6 donation-chart-update -currency"
              @keyup="updateSplit"
              v-model="initZakat"
            />
           
            <span class="text-xl currency-icon -donation-chart">
              <span>
                <span>
                  €
                </span>
              </span>
            </span>
             
          </div>
        </div>
        
        <span class="text-sm text-gray-300 sm:-mb-1 zakat-left-md">{{
          getLabel('Zakat left to allocate')
        }}</span>
      </div>
       <span class="text-sm text-gray-300 sm:-mb-1 zakat-left-sm">{{
              getLabel('Zakat left to allocate')
            }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { mapFields } from 'vuex-map-fields';
import { EventBus } from '../utils/eventBus.js';
import { currencyFormat, calcPercentOfNum } from '../utils/helpers';
import { deliveryFeeText, deliveryPercent } from '../utils/GlobalVars';
const BigNumber = require('bignumber.js');

export default {
  props: ['dragging'],
  data() {
    return {
      initZakat: 0,
    };
  },
  methods: {
    updateSplit(event) {
      //Format input value to allow commas
      let targetValue = event.target.value.replace(
        /[!@#$%^<>?&*,;:"€()\-_=+/'|~`\]\\[{{}}*]/g,
        ''
      );
      let myRegexp = /(.[^.]*)/g;
      let match = targetValue.match(myRegexp);

      // if user enters multiple . then numbers after second . are ignored
      if (match && match.length > 2) {
        targetValue = [match[0], match[1]].join('');
      }

      // Convert value to float
      let zakatVal = !isNaN(targetValue)
        ? parseFloat(targetValue.replace(/[^\d.]/g, ''))
        : 0;
      let deliverFee = '';

      if (this.deliveryCost == 2) {
        let bigZakat = new BigNumber(zakatVal);
        let onePercent = bigZakat.dividedBy(90);

        zakatVal = new BigNumber(onePercent.multipliedBy(100))
          .decimalPlaces(2)
          .toFixed();

        this.userZakat = new BigNumber(zakatVal).toFixed();

        deliverFee = calcPercentOfNum(zakatVal, deliveryPercent);
        this.$store.dispatch('deleteDonation', 3);
      } else {
        this.userZakat = zakatVal;
        deliverFee = calcPercentOfNum(zakatVal, deliveryPercent);

        this.$store.dispatch('addDonation', {
          name: deliveryFeeText,
          amount: deliverFee,
          id: 3,
          paymentType: this.donationTypes[0].paymentType,
        });
      }

      EventBus.$emit('zakatUpdateDonationItem', this.userZakat);

      this.$store.dispatch('updateZakat', {
        name: 'Zakat',
        amount: zakatVal,
        id: 0,
      });

      this.$store.dispatch('updateDonationsAmount', this.donationSplit);

      this.zakatValue = this.getZakat();
    },
    setZakat(val) {
      this.initZakat = parseFloat(val).toFixed(2);
    },
    currencyFormat(val) {
      return currencyFormat(val);
    },
  },
  computed: {
    percent() {
      let num = (this.getTotalSplit() * 100).toFixed(0);

      if (isNaN(num)) {
        return 0;
      } else {
        return num;
      }
    },
    remainingMoney() {
      let num = (
        this.getAllocatableZakat() -
        this.getAllocatableZakat() * this.getTotalSplit()
      ).toFixed(2);
      if (isNaN(num)) {
        return 0;
      } else {
        return num;
      }
    },
    ...mapGetters([
      'getTotalSplit',
      'getZakat',
      'getLabel',
      'getAllocatableZakat',
    ]),
    ...mapFields([
      'donation.donationTypes',
      'donation.donationSplit',
      'donation.zakat',
      'calculationSettings.deliveryCost',
      'user.userZakat',
    ]),
  },
  mounted() {
    this.initZakat = parseFloat(this.getAllocatableZakat()).toFixed(2);

    EventBus.$on('zakatUpdated', this.setZakat);
  },
  destroyed() {
    EventBus.$off('zakatUpdated', this.setZakat);
  },
};
</script>

<style scoped>
.zakat-input {
  /*min-width: 120px;*/
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
 .zakat-left-sm {
      display: none !important;
  }
  .zakat-left-md {
      display: block !important;
  }
 @media (max-width: 600px){
        .donation-chart {
          width: 100% !important;
        }
      
        .zakat-left-sm {
          margin-top: -10%;
          display: block !important;
        }
        .zakat-left-md {
            display: none !important;
        }
    }
</style>

