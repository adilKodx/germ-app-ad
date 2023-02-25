<template>
  <div>
    <div class="flex flex-col sm:flex-row">
      <div class="w-full sm:w-1/2 sm:mr-4 mb-4 sm:mb-0">
        <text-input
          @keyup.enter.native="findAddress"
          placeholder="Enter your postcode"
          @input="setPostCode"
          v-model="$v.text.$model"
          name="Postcode look-up"
          :currency="false"
          :small="true"
        ></text-input>

        <div
          class="error-container donation-item-error text-red-100"
          v-if="$v.text.$error"
        >
          <div>
            {{ getLabel('Please enter a valid post code') }}
          </div>
        </div>
      </div>

      <div class="w-full sm:w-1/2 sm:ml-4 mb-4 sm:mb-0 sm:mt-6">
        <btn class="text-red-300 -active" @click="findAddress" :small="true">
          <div v-if="loading == false">Find Address</div>
          <spinner v-if="loading"></spinner>
        </btn>
      </div>
    </div>

    <div class="mb-8">
      <div
        class="text-blue-100 text-base font-semibold cursor-pointer"
        @click="openAddress"
      >
        {{ getLabel('Enter address manually') }}
      </div>
    </div>

    <transition name="fade">
      <div class="flex mb-20 relative z-50" v-if="addresses.length">
        <div class="w-full">
          <select-input
            @click="setAddress"
            :options="formatAddresses"
            :small="true"
            name="postcode"
          ></select-input>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-show="selectedAddress.postCode.length || enterManual">
        <div class="flex flex-col sm:flex-row">
          <div class="w-full sm:w-1/2 sm:mr-4 mb-2 sm:mb-0">
            <text-input
              class=""
              v-model="paymentDetails.address.lineOne"
              name="Address Line 1*"
              placeholder="Enter address line 1"
              :currency="false"
              :small="true"
              :validators="{ required: v.required }"
              errormessage="Required"
              @errors="emitError"
            >
            </text-input>
          </div>

          <div class="w-full sm:w-1/2 sm:ml-4 mb-2 sm:mb-0">
            <text-input
              v-model="paymentDetails.address.lineTwo"
              name="Address Line 2"
              placeholder="Enter address line 2"
              :currency="false"
              :small="true"
            >
            </text-input>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row">
          <div class="w-full sm:w-1/2 sm:mr-4 mb-2 sm:mb-0">
            <text-input
              v-model="paymentDetails.address.townCity"
              name="City*"
              placeholder="Enter town/city"
              :currency="false"
              :small="true"
              :validators="{ required: v.required }"
              errormessage="Required"
              @errors="emitError"
            >
            </text-input>
          </div>

          <div class="w-full sm:w-1/2 sm:ml-4 mb-2 sm:mb-0">
            <div class="mb-1 text-gray font-semibold sm:text-lg">Country</div>
            <select-input
              :small="true"
              :options="countryList"
              @click="selectCountry"
              class="z-10"
              name="country-select"
            >
            </select-input>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row">
          <div class="w-full sm:w-1/2 mb-2 sm:mb-0">
            <text-input
              v-model="paymentDetails.postCode"
              name="Postcode*"
              placeholder="Enter postcode"
              :currency="false"
              :small="true"
              :validators="{ required: v.required, maxLength: v.maxLength(8) }"
              errormessage="Please enter a valid post code"
              @errors="emitError"
            >
            </text-input>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';
import SelectInput from './inputs/SelectInput';
import TextInput from './inputs/TextInput';
import Btn from './inputs/Btn';
import Spinner from './Spinner';
import { addressUrl, countryList } from '../utils/GlobalVars';
import { EventBus } from '../utils/eventBus';
import { postCodeCheck } from '../utils/validators';
import { mapFields } from 'vuex-map-fields';
import { mapGetters } from 'vuex';
import validators from '../utils/validators';
import { splitAtFirstSpace } from '../utils/helpers';

export default {
  name: 'AddressFinder',
  components: { SelectInput, TextInput, Btn, Spinner },
  data() {
    return {
      addresses: [],
      text: '',
      loading: false,
      errors: false,
      selectedAddress: {
        lineOne: 'University of Birmingham',
        lineTwo: '',
        townCity: 'Birmingham',
        postCode: 'B152TT',
        countyRegion: 'United Kingdom',
      },
      enterManual: false,
    };
  },
  validations: {
    text: {
      postCodeCheck,
    },
  },
  methods: {
    openAddress() {
      this.enterManual = true;
      this.$emit('open', this.enterManual);
    },
    findAddress() {
      this.loading = true;

      let text = encodeURIComponent(this.text);

      let API_URL =
        addressUrl +
        'Key=' +
        process.env.VUE_APP_FIND_ADDRESS_API_KEY +
        '&Countries=GB,US,CA&Limit=30&';

      EventBus.$emit('resetSelect', { name: 'postcode', val: 'Select' });

      axios.get(API_URL + 'Text=' + text + '&').then((res) => {
        let items = res.data.Items;

        if (items[0].Error == '1001') {
          this.errors = true;
          this.loading = false;
        }

        if (items[0].Type == 'Postcode' || items[0].Type == 'Street') {
          let id = items[0].Id;

          axios
            .get(API_URL + 'Text=' + text + '&' + 'Container=' + id + '&')
            .then((res) => {
              this.addresses = res.data.Items;
              this.loading = false;
              this.errors = false;
            });
        } else if (items[0].Type == 'Address') {
          this.addresses = res.data.Items;
          this.loading = false;
          this.errors = false;
        }
      });
    },
    setAddress(val) {
      let address = val.split(',');
      let concatinate = address[0].split(' ').length <= 5;

      address[0] = address[0].replace(',', '');

      address.reverse();

      if (address.length > 3) {
        if (concatinate) {
          this.selectedAddress = {
            lineOne: address[4] ? address[4] + address[3] : address[3],
            lineTwo: address[2],
            townCity: address[1],
            postCode: address[0].trim(),
            countyRegion: 'United Kingdom',
          };
        } else {
          this.selectedAddress = {
            lineOne: address[4] ? address[4] + address[3] : address[3],
            lineTwo: address[2].trim(),
            townCity: address[1].trim(),
            postCode: address[0].trim(),
            countyRegion: 'United Kingdom',
          };
        }
      } else {
        let newLine = splitAtFirstSpace(address[2]);

        if (concatinate) {
          this.selectedAddress = {
            lineOne: newLine[0] + ' ' + newLine[1],
            lineTwo: '',
            townCity: address[1].trim(),
            postCode: address[0].trim(),
            countyRegion: 'United Kingdom',
          };
        } else {
          this.selectedAddress = {
            lineOne: newLine[0],
            lineTwo: newLine[1],
            townCity: address[1].trim(),
            postCode: address[0].trim(),
            countyRegion: 'United Kingdom',
          };
        }
      }

      this.paymentDetails.postCode = address[0].trim();
      this.paymentDetails.address = {
        ...this.paymentDetails.address,
        ...this.selectedAddress,
      };
    },
    setPostCode(val) {
      this.paymentDetails.postCode = val;
    },
    emitError(payload) {
      this.enterManual = true;
      this.$emit('errors', payload);
    },
    selectCountry(val) {
      this.paymentDetails.address.countyRegion = val;
    },
  },
  computed: {
    formatAddresses() {
      return this.addresses.map((el) => {
        let newEl = el.Text + ', ' + el.Description;

        return newEl;
      });
    },
    countryList() {
      return countryList;
    },
    ...mapFields(['user.paymentDetails']),
    ...mapGetters(['getLabel']),
    v() {
      return { ...validators };
    },
  },
  mounted() {
    EventBus.$emit('resetSelect', {
      name: 'country-select',
      val: 'United Kingdom',
    });
  },
};
</script>

<style scoped></style>
