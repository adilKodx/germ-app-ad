<template>
  <div
    class="w-full flex next-btn-container"
    :class="{
      '-back-btn-show': skip,
      '-align-left': this.align == 'left',
    }"
  >
    <div
      v-if="skip && additionalBtn.text.length == 0"
      class="w-full sm:w-1/2 pr-4"
    >
      <btn @click="prevScrollItem"> Terug</btn>
    </div>

    <div
      v-if="saveCalculation.text.length > 0"
      class="w-full sm:w-1/2 pr-2"
      :class="{ 'pb-4': additionalBtn.text.length == 0 }"
    >
      <btn
        @click="openModal"
        style="border: 2px solid #FFD735 !important"
        class="test"
      >
        <span
          :id="saveCalculation.gtagId"
          style="float: left; padding-top: 5px; padding-right: 5px"
          >{{ saveCalculation.text }}
        </span>
        <!-- <img
          style="height: 35px; width: 35px"
          src="/static/img/save-logo.png"
          alt="Save calculation"
        /> -->
      </btn>
    </div>
    <div
      class="w-full sm:w-1/2 continue-btn mb-4"
      :class="{ '-align-left': this.align == 'left' }"
      v-if="isMobile"
    >
      <btn
        :id="gtagId"
        @click="nextScrollItem"
        class="next-btn text-red-300"
        :class="{
          '-active': active && activebutton,
          'pointer-events-none': !active,
          'md:ml-2': additionalBtn.text.length == 0,
        }"
      >
        <span
          :id="gtagId + '-text'"
          :style="[additionalBtn.size == 'sm' ? { 'padding-left': '5px' } : {}]"
          >{{ text }}</span
        >
      </btn>
    </div>

    <transition name="fade" v-if="isMobile">
      <div
        class="w-full"
        :class="{
          'sm:w-9/12': additionalBtn.size == 'large',
          'sm:w-1/2': additionalBtn.size !== 'large',
        }"
        v-if="additionalBtn.conditional"
        :style="[
          additionalBtn.size == 'sm' || additionalBtn.size == 'large'
            ? { 'margin-right': '50px' }
            : {},
        ]"
      >
        <btn
          v-if="additionalBtn.text.length > 0"
          :size="additionalBtn.size"
          @click="additionalPath"
          :id="additionalBtn.gtagId"
          class="mb-4 sm:mb-0"
          :class="{
            '-active': additionalBtn.conditional && additionalBtn.active,
            'text-red-300': !additionalBtn.conditional,
            'pointer-events-none': !additionalBtn.conditional,
            'sm:mr-2': this.align !== 'left',
            'sm:ml-2': this.align === 'left',
          }"
        >
          <span :id="additionalBtn.gtagId" style="white-space: nowrap">{{
            additionalBtn.text
          }}</span>
        </btn>
      </div>
    </transition>

    <transition name="fade" v-if="!isMobile">
      <div
        class="w-full"
        :class="{
          'sm:w-9/12': additionalBtn.size == 'large',
          'sm:w-1/2': additionalBtn.size !== 'large',
        }"
        v-if="additionalBtn.conditional"
        :style="[
          additionalBtn.size == 'sm' || additionalBtn.size == 'large'
            ? { 'margin-right': '50px' }
            : {},
        ]"
      >
        <btn
          v-if="additionalBtn.text.length > 0"
          :size="additionalBtn.size"
          @click="additionalPath"
          :id="additionalBtn.gtagId"
          class="mb-4 sm:mb-0"
          :class="{
            '-active': additionalBtn.conditional && additionalBtn.active,
            'text-red-300': !additionalBtn.conditional,
            'pointer-events-none': !additionalBtn.conditional,
            'sm:mr-2': this.align !== 'left',
            'sm:ml-2': this.align === 'left',
          }"
        >
          <span :id="additionalBtn.gtagId" style="white-space: nowrap">{{
            additionalBtn.text
          }}</span>
        </btn>
      </div>
    </transition>

    <div
      class="w-full sm:w-1/2 continue-btn"
      :class="{ '-align-left': this.align == 'left' }"
      v-if="!isMobile"
    >
      <btn
        :id="gtagId"
        @click="nextScrollItem"
        class="next-btn text-red-300"
        :class="{
          '-active': active && activebutton,
          'pointer-events-none': !active,
          'md:ml-2': additionalBtn.text.length == 0,
        }"
      >
        <span
          :id="gtagId + '-text'"
          :style="[additionalBtn.size == 'sm' ? { 'padding-left': '5px' } : {}]"
          >{{ text }}</span
        >
      </btn>
    </div>

    <!--<span v-if="skip && additionalBtn.text.length == 0"-->
    <!--class="w-full sm:w-1/2 text-lg next-btn-->
    <!--flex justify-center sm:justify-start items-center-->
    <!--sm:ml-6 py-6-->
    <!--font-semibold cursor-pointer text-gray-300"-->
    <!--@click="nextScrollItem">-->
    <!--Skip-->
    <!--</span>-->
  </div>
</template>
<script>

import Btn from "./Btn";
import { EventBus } from "../../utils/eventBus.js";
import { mapFields } from "vuex-map-fields";
import jsonToQuery from 'json-to-http-query-string';
import Vue from "vue";

export default {
  components: { Btn },
  props: {
    text: {
      type: String,
      default: "Ga verder",
    },
    skip: {
      type: Boolean,
      default: true,
    },
    activebutton: {
      type: Boolean,
      default: true,
    },
    id: {
      default: "",
    },
    step: {
      default: "",
    },
    prevStep: {
      default: "",
    },
    path: {
      default: "",
    },
    active: {
      type: Boolean,
    },
    isMobile: {
      type: Boolean,
      default: false
    },
    additionalBtn: {
      type: Object,
      default: () => {
        return {
          path: "",
          text: "",
          active: true
        };
      },
    },
    saveCalculation: {
      type: Object,
      default: () => {
        return {
          path: "",
          text: "",
          padding: {
            type: Boolean,
            default: true,
          },
        };
      },
    },
    gtagId: {
      type: String,
      default: "",
    },
    size: {
      type: String,
    },
    align: {
      type: String,
    },
  },
  methods: {
    makeUrlEncodedData(){
      const filters = JSON.parse(JSON.stringify(this.calculatorFilter.selected))
      const selectedOptions = filters.map(function(k,i){return filters[i].name}).join(",");
      console.log(this.user)
      
      
      
      let summary = {
        WhatIHave: this.zakatableAssets(),
                 WhatIOwe: this.totalLiabilities(),
                 IsEqualTo: this.netAssets(),
                 TodaysNisabIs: this.nisabValue,
                 TotalZakat: this.formatZakat()
                }
                
                let payloadRefId = {
          calculatorJourny: JSON.stringify({
            assets: this.assets,
            filter: this.filter,
            settings: this.settings,
            goldSilver: this.goldSilver,
            pension: this.pension,
            zakatCalculation: this.zakatCalculation,
              summary: summary
          }),
          firstName: this.firstName,
          lastName: this.lastName,
          emailAddress: this.emailAddress,
          keepUpToDate: this.keepUpToDate,
          tag: "SaveCalculation",
          _uetsid: localStorage.getItem("_uetsid"),
          _uetsid_exp: localStorage.getItem("_uetsid_exp"),
          _uetvid: localStorage.getItem("_uetvid"),
          _uetvid_exp: localStorage.getItem("_uetvid_exp"),
          paramType: 'clickZakat',
        }
        console.log(payloadRefId)
        this.$store.dispatch('sendCalculationJourny', payloadRefId).then(res=> { // adil test
          console.log(res)
          console.log(res.data['uniqueId']['uniqueId'])
          
          
          if(res.data['uniqueId']['uniqueId']){
            let convertPayload = {
              fast : 'yes',
              ref_calculation: res.data['uniqueId']['uniqueId'],
              zakat: this.formatZakat(),
                  email: this.user.email ? this.user.email :"",
                  name_first: this.user.firstName ? this.user.firstName  :"",
                  name_last: this.user.lastName ? this.user.lastName :"",
                  whatiown_owe: selectedOptions,
                  gold: this.user.assets.gold,  
                  silver: this.user.assets.silver,  
                  cashinhand: this.user.assets.cash.inHand,  
                  cashinbank: this.user.assets.cash.inBank,  
                  sharesresell: this.user.assets.cash.sharesCapital,  
                  sharesother: this.user.assets.cash.sharesDividend,  
                  cashreceivable: this.user.assets.cash.receivables,  
                  cashisa: this.user.assets.cash.cashIsa,  
                  isactf: this.user.assets.cash.sharesInvestments,  
                  crypto: this.user.assets.cash.crypto,  
                  whatiowe: this.user.assets.cash.cashOwedToYou,  
                  loanrepayment: this.user.assets.cash.loanOwedToYou,  
                  expectedfromsale: this.user.assets.cash.soldOwedToYou,  
                  businesscash: this.user.assets.businessAssets.cash,  
                  businessreceivable: this.user.assets.businessAssets.receivables,  
                  businessstock: this.user.assets.businessAssets.stock,  
                  mortgage: this.user.assets.liabilities.housePayments,  
                  utilitybills: this.user.assets.liabilities.bills,  
                  personalloan: this.user.assets.liabilities.borrowed,  
                  overdraft: this.user.assets.liabilities.overdraft,  
                  creditcard: this.user.assets.liabilities.credit,  
                  businessliabilities: this.user.assets.liabilities.tax,
                  utm_campaign: this.checkEmpty("utm_campaign"),
                  utm_medium: this.checkEmpty("utm_medium"),
                  utm_source: this.checkEmpty("utm_source"),
                  utm_content: this.checkEmpty("utm_content"),
                };
                this.error = false
                this.errorsArr = []
                
                // uncomment it  
                const convert = jsonToQuery(convertPayload) ;
                //console.log('hello url')
              // console.log('http://go.nzf.org.uk/secure/?fast=&'+convert)
              //  window.location.href = 'http://go.nzf.org.uk/secure/?fast=&'+convert;
              window.location.href = 'http://go.nzf.org.uk/secure/?'+convert;
            }else{
              this.error = true
              this.errorMsg = "Something went wrong please try again later!"
              
            }
              
          }).catch(err=>{
            // this.loading = false
            // this.success = false
            this.error = true
            this.errorMsg = "Something went wrong please try again later!"
          });

          
      


    },
    nextScrollItem() {
      if (this.path.length > 0) {
        // EventBus.$emit('nextBtnClicked', this.id);

        if (this.id == "round-section" || this.id == "display-zakat-section") {
          if (this.calculatorProgress == 100) {
            // this.$router.push({ path: this.path });
            // this.makeUrlEncodedData();
          } else {
            this.calculatorProgress = 100;
            setTimeout(() => {
              this.$router.push({ path: this.path });
            }, 500);
            return;
          }
        }

        this.$router.push({ path: this.path });
        return;
      }
      
      EventBus.$emit("nextBtnClicked", {
        id: this.id,
        step: this.step,
      });
      this.$emit("nextClick");
    },
    prevScrollItem() {
      EventBus.$emit("prevBtnClicked", {
        id: this.id,
        step: this.prevStep,
      });
    },
    openModal() {
      "donation.allocation",
      EventBus.$emit("openModal", {
        step: this.step,
      });
    },
    additionalPath() {
      if (this.additionalBtn.next) {
        this.$emit("additionalClick");

        // Need to allow previous event to propagate
        // to other components before acting on the next one
        Vue.nextTick(() => {
          EventBus.$emit("nextBtnClicked", { id: this.id });
        });
      } else {
        this.$router.push({ path: this.additionalBtn.path });
      }
    },
  },
  computed: {
    ...mapFields(["calculatorProgress"]),
  },
};
</script>

<style scoped lang="scss"></style>
