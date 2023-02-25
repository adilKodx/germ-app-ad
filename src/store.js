import axios from "axios";
import Cookies from "js-cookie";
import _ from "lodash";
import moment from "moment";
import Vue from "vue";
import Vuex from "vuex";
import { getField, updateField } from "vuex-map-fields";
import createPersistedState from "vuex-persistedstate";
import { EventBus } from "./utils/eventBus.js";
import {
  deliveryFeeText,
  deliveryFeeTextNoAddOn,
  deliveryPercent,
  EmptyObjectFunc,
  emptySplit,
  giftAidPercent,
  paymentTypes,
} from "./utils/GlobalVars";
import {
  bigNumberMult,
  calcPercentOfNum,
  roundToThree,
  roundToTwo,
  stringToNum,
  submitDonationToApi,
  submitDonationToCMS,
  submitDonationToStripeApi,
  loadPaymentIntent,
  submitDonationToStripePIApi,
  submitSessionDataApi,
  zakatCalc,
} from "./utils/helpers";
import { labels } from "./utils/labels";

const BigNumber = require("bignumber.js");

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    mode: "",
    loadingText: false,

    count: 0,
    _ip: "",
    user: {
      assets: {
        gold: "",
        silver: "",
        cash: {
          inHand: "",
          inBank: "",
          sharesCapital: "",
          sharesDividend: "",
          receivables: "",
          cashIsa: "",
          sharesInvestments: "",
          pension: "",
          crypto: "",
          cashOwedToYou: "",
          loanOwedToYou: "",
          soldOwedToYou: "",
          other: [],
        },
        goldSilver: {
          other: [],
        },
        moneyOwed: {
          other: [],
        },
        crypto: {
          other: [],
        },
        investment: {
          other: [],
        },
        businessAssets: {
          cash: "",
          receivables: "",
          stock: "",
          other: [],
        },
        liabilities: {
          housePayments: "",
          bills: "",
          borrowed: "",
          overdraft: "",
          credit: "",
          tax: "",
          other: [],
        },
      },
      reccommendZakat: 0,
      userZakat: null,
      paymentDetails: {
        paymentType: 2,
        cardType: "",
        cardNumber: 0,
        securityCode: 0,
        issueDate: "",
        expiryDate: "",
        issueNum: 0,
        cardName: "",
        accountHolderName: "",
        accountNumber: "",
        bankSortCode: "",
        numberOfPayments: 12,
        paymentStartDate: "",
        title: "",
        firstName: "",
        lastName: "",
        companyName: "",
        postCode: "",
        address: {
          lineOne: "",
          lineTwo: "",
          lineThree: "",
          townCity: "",
          countyRegion: "United Kingdom",
          postCode: "",
          emailAddress: "",
          contactNumber: "",
          altNumber: "",
        },
        optIn: {
          email: false,
          sms: false,
          post: false,
          phone: false,
          whatsapp: false,
          telegram: false,
        },
        contactSubject: [],
      },
      cardDetails: {
        accounttypedescription: "",
        acquirerresponsecode: 0,
        authcode: "",
        baseamount: 0,
        cavv: "",
        currencyiso3a: "",
        customeroutput: "",
        dccenabled: 0,
        eci: 5,
        enrolled: "",
        errorcode: 0,
        errormessage: "",
        issuer: "",
        issuercountryiso2a: "",
        livestatus: 0,
        maskedpan: "",
        merchantcountryiso2a: "",
        merchantname: "",
        merchantnumber: "",
        operatorname: "",
        parenttransactionreference: "",
        paymenttypedescription: "",
        requesttypedescription: "",
        securityresponseaddress: 0,
        securityresponsepostcode: 0,
        securityresponsesecuritycode: 2,
        settleduedate: "2019-11-15",
        settlestatus: 0,
        splitfinalnumber: 1,
        status: "",
        threedversion: "",
        tid: 0,
        transactionreference: 0,
        transactionstartedtimestamp: "2019-11-15 08:15:02",
        xi: "",
      },
    },
    donation: {
      allocation: "nzf",
      zakat: "",
      donationTypes: [
        {
          name: "Zakat",
          amount: 0,
          id: 0,
          paymentType: paymentTypes.single,
        },
        {
          name: "Transactiekosten",
          amount: 0.29,
          id: 9,
          paymentType: paymentTypes.single,
        },
      ],
      administration: {
        optIn: false,
        amount: 0,
      },
      totalDonation: 0,
      totalChargeable: 0,
      donationSplit: [
        {
          name: "Noodfonds",
          recommended: 0.5, //0.7,
          split: 0,
          amount: 0,
          id: 0,
        },
        {
          name: "Woonfonds",
          recommended: 0.4, //0.2,
          split: 0,
          amount: 0,
          id: 1,
        },
        {
          name: "Educatiefonds",
          recommended: 0.1,
          split: 0,
          amount: 0,
          id: 3,
        },
      ],
      selectedPaymentType: paymentTypes.single,
      giftAid: false,
      giftAidClicked: false,
      changeGiftAidOption: true,
      giftAidAmount: 0,
      giftAidValue: 0,
      roundingType: 4,
      deliveryPercent: deliveryPercent,
    },
    secureTrading: {
      jwt: null,
      generatedAt: null,
      paymentData: {},
    },
    inputs: {
      selectOpen: 0,
    },
    messages: {
      messageOpen: 0,
    },
    labels: {
      ...labels,
    },
    settings: {},
    options: [],
    customerRef: {},
    stripe: {},
    zakatCalculation: {
      selectedPension: "",
      pensions: {
        Obligaties: 1,
        "Shariah compliant porftolio": 0.26,
        "Gemengde portfolio": 0.5,
        Equity: 0.27,
        "Onroerend goed": 0.15,
      },
      investments: {
        stocks: 0.25,
      },
    },
    transitions: {
      to: "",
      from: "",
      history: [],
      isNavOpen: false,
      scrollTo: "",
      backHash: "",
    },
    calculationSettings: {
      showPension: false,
      pensionKnown: 0,
      deliveryCost: 2,
    },
    nissab: {
      // gold_price: 36.742,
      // silver_price: 0.4286,
      // nisab_gold_value: 3214.1902,
      // nisab_silver_value: 262.4575
    },
    errors: {
      show: false,
      globalErrors: [],
    },
    paymentSubmit: {
      loading: false,
      errors: false,
      msg: "",
    },
    calculatorProgress: 0,
    calculatorStep: 0,
    goldSilverWeightSettings: {
      silver: false,
      silverWeight: "",
      gold: false,
      goldWeight: "",
    },
    flash: {
      success: "",
    },
    pastTabs: [],
    manageZakatVisible: false,
    calculatorFilter: {
      selected: [],
      hideWelcome: false,
    },
    preset: {
      key: "",
      id: "",
      value: "",
      paymentType: "",
    },
    presetEid: {
      key: "",
      id: "",
      value: "",
      paymentType: "",
    },
    pages: {
      orderWaysToGive: {
        slug: "other-ways-to-give",
        title: "",
        content: "",
      },
      stErrorPage: {
        slug: "secure-trading-error-page",
        title: "",
        content: "",
      },
    },
  },
  getters: {
    getField,
    getTotalSplit: (state) => () => {
      let total = state.donation.donationSplit
        .map((el) => el.split)
        .reduce((acc, cur) => acc + cur);

      // console.log(state.donation.donationSplit.map((el) => el.split))
      return roundToThree(total, 0);
    },
    getTotalDonation: (state) => () => {
      let total;

      if (state.donation.donationTypes.length) {
        total = state.donation.donationTypes
          .map((el) => {
            if (el.id === 3) {
              if (el.name === deliveryFeeText) {
                return el.amount;
              } else {
                return 0;
              }
            } else {
              return el.amount;
            }
          })
          .reduce((acc, cur) => {
            return new BigNumber(acc).plus(new BigNumber(cur));
          });
      } else {
        total = 0;
      }
      return total;
    },
    getZakat: (state) => () => {
      //Will return first object in donation array which will always be the Zakat donation
      //This amount will be rounded up and can be edited by the user

      let zakat = state.donation.donationTypes[0].amount;

      if (typeof zakat == "string") {
        return zakat.replace(/,/g, "");
      }

      return zakat;
    },
    getZakatCalc: (state) => () => {
      return zakatCalc();
    },
    getAllocatableZakat: (state, getters) => () => {
      let zakat = state.donation.donationTypes[0].amount;

      if (state.calculationSettings.deliveryCost == 2) {
        return zakat - getters.getZakatDeliveryCost();
      } else {
        return zakat;
      }
    },
    getDisplayAllocatableZakat: (state, getters) => () => {
      let zakat = state.donation.donationTypes[0].amount;
      return zakat - getters.getZakatDeliveryCost();
    },
    getOriginalZakat: (state) => () => {
      return state.donation.zakat;
    },
    getZakatDeliveryCost: (state, getters) => () => {
      if (state.donation.donationTypes[0]) {
        return roundToTwo(
          calcPercentOfNum(getters.getZakat(), state.donation.deliveryPercent),
          1
        );
      } else {
        return 0;
      }
    },
    getSingleDonationAmountDetails : (state) => () => {
      let data = {
        "zakat": 0,
        "sadaqah": 0,
        "fidyah" : 0,
        "riba" : 0
    };
      state.donation.donationTypes.map((el) => {
        if(el.id == 0 && el.amount > 0){
          data = {
            "zakat": el.amount,
            "sadaqah": data.sadaqah,
            "fidyah" : data.fidyah,
            "riba" : data.riba
          }  
        }
        if(el.id == '2-sadaqah' && el.amount > 0){
          data = {
            "zakat": data.zakat,
            "sadaqah": el.amount,
            "fidyah" : data.fidyah,
            "riba" : data.riba
          }  
        }
        if(el.id == '4-kaffarah' && el.amount > 0){
          data = {
            "zakat": data.zakat,
            "sadaqah": data.sadaqah,
            "fidyah" : el.amount,
            "riba" : data.riba
          }  
        }
        if(el.id == '3-riba' && el.amount > 0){
          data = {
            "zakat": data.zakat,
            "sadaqah": data.sadaqah,
            "fidyah" : data.fidyah,
            "riba" : el.amount
          }  
        }
      });
      return data;
    },
    getSingleDonations: (state) => () => {
      return state.donation.donationTypes.filter((el) => {
        return el.paymentType == paymentTypes.single && el.amount > 0;
      });
    },
    getSingleDonationsCheck: (state) => () => {
      
      let checkPaymentType = '';
      let checkZakat = false;
      let checkSadaqah = false;
      state.donation.donationTypes.map((el) => {
        if(el.id == 0 && el.amount > 0){
          checkZakat = true;
        }
        if(el.id !== 9 && el.id !== 0 && el.amount > 0){
          checkSadaqah = true;
        }
      });
      
      if(checkSadaqah == true && checkZakat == true){
        checkPaymentType = 'Both';
      }else if(checkSadaqah == true ){
        checkPaymentType = 'Sadaqah';
      }else if(checkZakat == true){
        checkPaymentType = 'Zakat';
      }else{
        checkPaymentType = 'Both';
      }
      return checkPaymentType; 
    },
    getRegularDonations: (state) => () => {
      return state.donation.donationTypes.filter((el) => {
        return el.paymentType == paymentTypes.regular && el.amount > 0;
      });
    },
    getRegularDonationsTotal: (state, getters) => () => {
      if (getters.getRegularDonations().length !== 0) {
        return getters
          .getRegularDonations()
          .map((el, index) => {
            if (el.id === 3) {
              if (el.name === deliveryFeeText) {
                return el.amount;
              } else {
                return 0;
              }
            } else {
              return el.amount;
            }
          })
          .reduce((acc, cur) => new BigNumber(acc).plus(new BigNumber(cur)));
      } else {
        return 0;
      }
    },
    getSingleDonationsTotal: (state, getters) => () => {
      if (getters.getSingleDonations().length !== 0) {
        return getters
          .getSingleDonations()
          .map((el) => {
            if (el.id === 3) {
              if (el.name === deliveryFeeText) {
                return el.amount;
              } else {
                return 0;
              }
            } else {
              return el.amount;
            }
          })
          .reduce((acc, cur) => new BigNumber(acc).plus(new BigNumber(cur)));
      } else {
        return 0;
      }
    },
    getLabel: (state) => (label) => {
      let key = label;
      key = key.toLowerCase();
      key = _.camelCase(key);
      key = key.replace(/\W/g, "");
      return state.labels[key] ? state.labels[key] : label;
    },
    getNissab: (state) => () => {
      // On the FE (getNissab) use whichever value is the highest between gold and silver nisab
      return Math.max(
        state.nissab.nisab_gold_value,
        state.nissab.nisab_silver_value
      );
    },
    getFormattedAssets: (state) => () => {
      // state.user.assets

      let assets = state.user.assets;

      // let removeChars = (str) => {
      //    return  !!str && str.length > 0 ?  str.replace(/\D/g,'') : '' ;
      // };

      let stringToNum = (str) => {
        if (str && typeof str == "string") {
          return parseFloat(str.replace(/[^\d.-]/g, ""));
        } else if (str && typeof str == "number") {
          return str;
        } else {
          return "";
        }
      };

      let user = {
        gold: stringToNum(assets.gold),
        silver: stringToNum(assets.silver),
        cash: {
          inHand: stringToNum(assets.cash.inHand),
          inBank: stringToNum(assets.cash.inBank),
          sharesCapital: stringToNum(assets.cash.sharesCapital),
          sharesDividend: stringToNum(assets.cash.sharesDividend),
          receivables: stringToNum(assets.cash.receivables),
          cashIsa: stringToNum(assets.cash.cashIsa),
          sharesInvestments: stringToNum(assets.cash.sharesInvestments),
          pension: stringToNum(assets.cash.pension),
          crypto: stringToNum(assets.cash.crypto),
          cashOwedToYou: stringToNum(assets.cash.cashOwedToYou),
          loanOwedToYou: stringToNum(assets.cash.loanOwedToYou),
          soldOwedToYou: stringToNum(assets.cash.soldOwedToYou),
          other: assets.cash.other,
        },
        goldSilver: {
          other:
            assets.goldSilver.other.length > 0 ? assets.goldSilver.other : [],
        },
        moneyOwed: {
          other:
            assets.moneyOwed.other.length > 0 ? assets.moneyOwed.other : [],
        },
        crypto: {
          other: assets.crypto.other.length > 0 ? assets.crypto.other : [],
        },
        investment: {
          other:
            assets.investment.other.length > 0 ? assets.investment.other : [],
        },
        businessAssets: {
          cash: stringToNum(assets.businessAssets.cash),
          receivables: stringToNum(assets.businessAssets.receivables),
          stock: stringToNum(assets.businessAssets.stock),
          other: assets.businessAssets.other,
        },
        liabilities: {
          housePayments: stringToNum(assets.liabilities.housePayments),
          bills: stringToNum(assets.liabilities.bills),
          borrowed: stringToNum(assets.liabilities.borrowed),
          overdraft: stringToNum(assets.liabilities.overdraft),
          credit: stringToNum(assets.liabilities.credit),
          tax: stringToNum(assets.liabilities.tax),
          other: assets.liabilities.other,
        },
      };

      return user;
    },
    getDonationCostType: (state) => () => {
      return state.calculationSettings.deliveryCost;
    },
  },
  mutations: {
    updateField,
    SET_SECTIONS(state, payload) {
      state.calculatorFilter.selected = payload;
    },
    SET_ASSETS(state, payload) {
      state.user.assets = payload;
    },
    CLEAR_SINGLE_DONATIONS(state) {
      state.donation.donationTypes.map((el) => {
        if (el.paymentType == paymentTypes.single) {
          el.paymentType = "";
        }
      });
    },
    CLEAR_REGULAR_DONATIONS(state) {
      state.donation.donationTypes.map((el) => {
        if (el.paymentType == paymentTypes.regular) {
          el.paymentType = "";
        }
      });
    },
    CLEAR_FILTERS(state) {
      state.calculatorFilter.selected = [];
      state.calculatorStep = 0;
    },
    CLEAR_CALC_STEP(state) {
      state.calculatorStep = 0;
    },
    RESET_PROGRESS(state) {
      state.calculatorProgress = 0;
    },
    SET_PROGRESS(state, payload) {
      state.calculatorProgress = payload.step;
    },
    CLEAR_DONATION(state, payload) {
      state.donation = payload;
    },
    CLEAR_PENSION_TYPE(state) {
      state.zakatCalculation.selectedPension = "";
    },
    CLEAR_PAYMENT_DETAILS(state, payload) {
      state.user.paymentDetails = payload;
    },
    CLEAR_CALCULATION(state, payload) {
      state.calculationSettings = payload;
    },
    CLEAR_GOLD_SILVER(state, payload) {
      state.goldSilverWeightSettings = payload;
    },
    CLEAR_RECOMMENDED_ZAKAT(state) {
      state.user.reccommendZakat = 0;
    },
    CLEAR_INVESTMENTS(state) {
      state.user.assets.cash.cashIsa = "";
      state.user.assets.cash.sharesInvestments = "";
    },
    SET_MODE(state, payload) {
      state.mode = payload;
    },
    SET_CHARITY(state, payload) {
      state.donation.donationSplit = payload;
    },
    SET_SUCCESS_MSG(state, payload) {
      state.flash.success = payload;
    },
    SET_PAYMENT_ERRORS(state, payload) {
      state.paymentSubmit.error = true;
      state.paymentSubmit.msg = payload;
    },
    CLEAR_ERRORS(state, payload) {
      state.errors.show = payload;
      state.paymentSubmit.errors = payload;
      state.errors.globalErrors = [];
    },
    ADD_DONATION(state, payload) {
      state.donation.donationTypes.push(payload);
      state.donation.selectedPaymentType = payload.selectedPaymentType;
    },
    SET_TOTAL_DONATION(state, payload) {
      state.donation.totalDonation = payload;
    },
    SET_PAYMENT_TYPE(state, payload) {
      state.donation.selectedPaymentType = payload.selectedPaymentType;
    },
    SET_DONATIONS(state, payload) {
      state.donation.donationTypes = payload;
      state.donation.selectedPaymentType = payload.selectedPaymentType;
    },
    SET_DONATION(state, payload) {
      state.donation.donationTypes.map((el) => {
        if (el.id == payload.id) {
          el.name = payload.name;
          el.amount = payload.amount;
          el.paymentType = payload.paymentType;
        }

        return el;
      });
      state.donation.selectedPaymentType = payload.selectedPaymentType;
    },
    SET_ZAKAT(state, payload) {
      state.donation.zakat = payload;
    },
    SET_SINGLE_DONATION(state, payload) {
      state.donation.donationTypes.map((el) => {
        if (el.name == payload.name) {
          el.amount = payload.amount;
          el.paymentType = payload.paymentType
            ? payload.paymentType
            : el.paymentType;
        }

        return el;
      });
    },
    SET_ALLOCATION(state, payload) {
      state.donation.allocation = payload;
    },
    SET_CASH(state, payload) {
      state.user.assets.cash[payload.name] = payload.value;
    },
    SET_LIABILITIES(state, payload) {
      state.user.assets.liabilities[payload.name] = payload.value;
    },
    SET_BUSINESS(state, payload) {
      state.user.assets.businessAssets[payload.name] = payload.value;
    },
    ADD_CASH_ASSET(state, payload) {
      state.user.assets.cash.other.push(payload);
    },
    UPDATE_CASH_ASSET(state, payload) {
      state.user.assets.cash.other = [
        ...state.user.assets.cash.other.map((el) => {
          if (el.id == payload.id) {
            el.name = payload.name;
            el.value = payload.value;
          }
          return el;
        }),
      ];
    },
    SET_ASSET(state, payload) {
      state.user.assets[payload.name] = payload.value;
    },
    ADD_LIABILITIES_ASSET(state, payload) {
      state.user.assets.liabilities.other.push(payload);
    },
    UPDATE_LIABILITIES_ASSET(state, payload) {
      state.user.assets.liabilities.other = [
        ...state.user.assets.liabilities.other.map((el) => {
          if (el.id == payload.id) {
            el.name = payload.name;
            el.value = payload.value;
          }
          return el;
        }),
      ];
    },
    ADD_BUSINESS_ASSET(state, payload) {
      state.user.assets.businessAssets.other.push(payload);
    },
    UPDATE_BUSINESS_ASSET(state, payload) {
      state.user.assets.businessAssets.other = [
        ...state.user.assets.businessAssets.other.map((el) => {
          if (el.id == payload.id) {
            el.name = payload.name;
            el.value = payload.value;
          }
          return el;
        }),
      ];
    },
    ADD_CRYPTO_ASSET(state, payload) {
      state.user.assets.crypto.other.push(payload);
    },
    UPDATE_CRYPTO_ASSET(state, payload) {
      state.user.assets.crypto.other = [
        ...state.user.assets.crypto.other.map((el) => {
          if (el.id == payload.id) {
            el.name = payload.name;
            el.value = payload.value;
          }
          return el;
        }),
      ];
    },
    ADD_INVESTMENT_ASSET(state, payload) {
      state.user.assets.investment.other.push(payload);
    },
    UPDATE_INVESTMENT_ASSET(state, payload) {
      state.user.assets.investment.other = [
        ...state.user.assets.investment.other.map((el) => {
          if (el.id == payload.id) {
            el.name = payload.name;
            el.value = payload.value;
          }
          return el;
        }),
      ];
    },
    ADD_MONEY_OWED_ASSET(state, payload) {
      state.user.assets.moneyOwed.other.push(payload);
    },
    UPDATE_MONEY_OWED_ASSET(state, payload) {
      state.user.assets.moneyOwed.other = [
        ...state.user.assets.moneyOwed.other.map((el) => {
          if (el.id == payload.id) {
            el.name = payload.name;
            el.value = payload.value;
          }
          return el;
        }),
      ];
    },
    ADD_GOLD_SILVER_ASSET(state, payload) {
      state.user.assets.goldSilver.other.push(payload);
    },
    UPDATE_GOLD_SILVER_ASSET(state, payload) {
      state.user.assets.goldSilver.other = [
        ...state.user.assets.goldSilver.other.map((el) => {
          if (el.id == payload.id) {
            el.name = payload.name;
            el.value = payload.value;
          }
          return el;
        }),
      ];
    },
    REMOVE_ASSETS(state, payload) {
      state.user.assets[payload.assetName].other = state.user.assets[
        payload.assetName
      ].other.filter((el) => el.id !== payload.id);
    },
    REMOVE_BASKET_ITEM(state, payload) {
      state.donation.donationTypes.map((el) => {
        if (el.id == payload.id) {
          el.paymentType = "";
        }

        return el;
      });
    },
    SET_GIFT_AID(state, payload) {
      state.donation.giftAidValue = payload.giftAidValue;
      state.donation.giftAidClicked = payload.giftAidClicked;
      state.donation.giftAid = payload.isTaxPayer;
      state.donation.giftAidAmount = payload.amount;
    },
    SET_GIFT_AID_FROM_BASKET(state, payload) {
      state.donation.changeGiftAidOption = payload.changeGiftAidOption;
    },
    SET_SECURE_TRADING_JWT(state, jwtData) {
      state.secureTrading.jwt = jwtData.jwt;
      state.secureTrading.generatedAt = jwtData.generatedAt;
    },
    SET_CARD_DETAILS(state, payload) {
      state.user.cardDetails = {
        ...payload,
      };

      state.user.paymentDetails.cardDetails = {
        ...payload,
      };
    },
    SET_RECOMMENDED_ZAKAT(state) {
      state.user.reccommendZakat = zakatCalc();
    },
    SET_TOTALS(state, payload) {
      state.donation.totalDonation = payload.totalDonation;
      state.donation.totalChargeable = payload.totalChargeable;
    },
    SET_NISSAB(state, payload) {
      state.nissab = { ...state.nissab, ...payload };
    },
    SET_LABELS(state, payload) {
      state.labels = payload;
    },
    SET_SETTINGS(state, payload) {
      if (typeof payload.length !== "undefined" && payload.length > 0) {
        let row = payload[0];
        let HardshipRelief = parseFloat(row.HardshipRelief);
        let HousingWork = parseFloat(row.HousingWork);
        let Education = parseFloat(row.Education);
        state.donation.donationSplit[0].recommended = HardshipRelief;
        state.donation.donationSplit[1].recommended = HousingWork;
        state.donation.donationSplit[2].recommended = Education;
        state.settings = row;
      } else {
        state.settings = [];
      }
    },
    SET_OPTIONS(state, payload) {
      state.options = payload;
    },
    SET_CUSTOMER_REF(state, payload) {
      state.customerRef = payload;
    },
    SET_STRIPE(state, payload) {
      state.stripe = payload;
    },
    SET_LOCALSTATE_DATA(state, payload) {
      localStorage.setItem("journyData", JSON.stringify(state));
    },
    SET_JOURNY_DATA(state, payload) {
      if (
        localStorage.getItem("journyData") !== null &&
        localStorage.getItem("journyData") !== "undefined"
      ) {
        let AllStates = JSON.parse(localStorage.getItem("journyData"));

        this.replaceState(Object.assign(state, AllStates));
      }
    },
    SET_IP_ADDRESS(state, payload) {
      state.user._ip = payload._ip;
    },
    SET_STORE(state, payload) {
      // console.log('SET_STORE', payload);

      // state = payload;

      this.replaceState(
        Object.assign(state, JSON.parse(localStorage.getItem("user_data")))
      );

      // console.log('state', state);
    },
    SET_WEIGHT_SELECT(state, payload) {
      state.goldSilverWeightSettings[payload.name] = payload.val;
    },
    SET_WEIGHT_VALUE(state, payload) {
      if (payload.name == "gold") {
        state.goldSilverWeightSettings.goldWeight = payload.val;
      } else if (payload.name == "silver") {
        state.goldSilverWeightSettings.silverWeight = payload.val;
      }
    },
    SET_LOADING(state) {
      state.loadingText = true;
    },
    SET_BACK_HASH(state, payload) {
      state.transitions.backHash = payload;
    },
    SET_OTHER_WAYS_PAGE(state, payload) {
      state.pages.orderWaysToGive = payload;
    },
    SET_ST_ERROR_PAGE(state, payload) {
      state.pages.stErrorPage = payload;
    },
  },
  actions: {
    clearStore(context) {
      let emptyStateCopy = new EmptyObjectFunc();

      context.commit("RESET_PROGRESS");
      context.commit("SET_ASSETS", emptyStateCopy.content.user.assets);
      context.commit("CLEAR_RECOMMENDED_ZAKAT");
      context.commit("CLEAR_PENSION_TYPE");
      context.commit("CLEAR_DONATION", emptyStateCopy.content.donation);
      context.commit(
        "CLEAR_CALCULATION",
        emptyStateCopy.content.calculationSettings
      );
      context.commit(
        "CLEAR_GOLD_SILVER",
        emptyStateCopy.content.goldSilverWeightSettings
      );
      context.commit(
        "CLEAR_PAYMENT_DETAILS",
        emptyStateCopy.content.user.paymentDetails
      );
      context.commit("SET_ALLOCATION", "nzf");
      context.commit("CLEAR_FILTERS");
      context.dispatch(
        "setRecommendedDonation",
        context.state.donation.donationSplit
      );
      EventBus.$emit("zakatUpdateDonationItem", "");
      EventBus.$emit("globalClear");
    },
    fetchData(context) {
      // context.dispatch('fetchCharities');
      context.dispatch("fetchGold");
      // Before By Plug And Play
      // context.dispatch('fetchLabels').then(()=>{
      //     context.commit('SET_LOADING')
      // });
      // New By Tahir
      context.dispatch("fetchLabels");
      context.dispatch("fetchOptions");
      context.dispatch("fetchSettings").then(() => {
        context.commit("SET_LOADING");
      });
    },
    fetchCharities(context) {
      if (
        JSON.parse(localStorage.getItem("vuex")).donation.donationSplit.length >
        0
      ) {
        return;
      }

      axios.get(process.env.VUE_APP_TEST_API_URL + "/charities").then((res) => {
        context.commit("SET_CHARITY", res.data);
      });
    },
    fetchGold(context) {
      axios
        .get(process.env.VUE_APP_API_URL + "/info/gold-silver")
        .then((res) => {
          context.commit("SET_NISSAB", res.data);
        });
    },
    fetchSettings(context) {
      return new Promise((resolve, reject) => {
        axios
          .get(process.env.VUE_APP_API_URL + "/settings")
          .then((res) => {
            context.commit("SET_SETTINGS", res.data);
            resolve(res);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },
    fetchOptions(context) {
      return new Promise((resolve, reject) => {
        axios
          .get(process.env.VUE_APP_API_URL + "/options")
          .then((res) => {
            context.commit("SET_OPTIONS", res.data);
            resolve(res);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },
    fetchLabels(context) {
      return new Promise((resolve, reject) => {
        axios
          .get(process.env.VUE_APP_API_URL + "/labels")
          .then((res) => {
            context.commit("SET_LABELS", res.data);
            resolve(res);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },
    updateStripeData(context, payload) {
      context.commit("SET_STRIPE", payload);
    },
    updateUserJourny(context) {
      context.commit("SET_JOURNY_DATA");
    },
    SaveLocalStateData(context) {
      context.commit("SET_LOCALSTATE_DATA");
    },
    updateDonationsAmount(context, payload) {
      let remainder = 0;

      payload.map((el) => {
        let amount = context.getters.getAllocatableZakat() * el.split;
        let twoDp = parseFloat(roundToTwo(amount));

        remainder += amount - twoDp;

        el.amount = amount;

        return el;
      });
      remainder = roundToTwo(remainder, 0);

      let zak = context.state.donation.zakat;
      let splitTotal = 0;
      payload.map((el) => {
        splitTotal += roundToTwo(el.amount);
      });
      context.state.donation.donationTypes.map((el) => {
        if (el.id === 3 && el.name === deliveryFeeTextNoAddOn) {
          splitTotal += roundToTwo(el.amount);
        }
      });

      let dif = zak - (splitTotal + remainder);
      remainder += dif;

      remainder = roundToThree(remainder, 0);
      if (payload[_.findKey(payload, (p) => p["amount"] > 0)]) {
        payload[_.findKey(payload, (p) => p["amount"] > 0)][
          "amount"
        ] += remainder;
      }

      if (context.state.allocation !== "custom") {
        context.commit("SET_CHARITY", payload);
      }
    },
    setRecommendedDonation(context, payload) {
      let remainder = 0;

      payload.map((el) => {
        let amount = context.getters.getAllocatableZakat() * el.recommended;
        let twoDp = parseFloat(roundToTwo(amount));

        remainder += amount - twoDp;

        el.amount = context.getters.getAllocatableZakat() * el.recommended;
        el.split = el.recommended;

        return el;
      });

      if (payload[_.findKey(payload, (p) => p["amount"] > 0)]) {
        payload[_.findKey(payload, (p) => p["amount"] > 0)][
          "amount"
        ] += parseFloat(remainder.toFixed(2));
      }

      context.commit("SET_CHARITY", payload);
    },
    setEvenDonation(context, payload) {
      payload.map((el, index) => {
        let originalSplit = 1 / payload.length;

        if (index == 0) {
          //Round **UP** to to regard less of what decimal is
          let split = Math.ceil(originalSplit * 100) / 100;
          let splitAmount = bigNumberMult(
            context.getters.getAllocatableZakat(),
            split
          );
          el.split = split;
          el.amount = splitAmount;
        } else {
          let split = Math.floor(originalSplit * 100) / 100;
          let splitAmount = bigNumberMult(
            context.getters.getAllocatableZakat(),
            split
          );

          el.split = split;
          // el.amount = roundToTwo(context.getters.getZakat() * split);
          el.amount = splitAmount;
        }

        return el;
      });

      context.commit("SET_CHARITY", payload);
    },
    addDonation(context, payload) {
      if (
        context.state.donation.donationTypes.some((el) => el.id === payload.id)
      ) {
        context.commit("SET_DONATION", payload);
      } else {
        context.commit("ADD_DONATION", payload);
      }

      context.dispatch("updateTotal");

      if (payload.id == 0) {
        context.dispatch("updateSplit");
      }
    },
    setPaymentType(context, payload) {
      context.commit("SET_PAYMENT_TYPE", payload);
    },
    deleteDonation(context, donationId) {
      let typesClone = _.clone(context.state.donation.donationTypes);

      let index = typesClone.findIndex(function(i) {
        return i.id === donationId;
      });

      typesClone.splice(index, 1);
      if (index > -1) {
        context.commit("SET_DONATIONS", typesClone);

        context.dispatch("updateTotal");
      }
    },
    updateTotal(context) {
      let total = context.getters.getTotalDonation();

      context.commit("SET_TOTAL_DONATION", total);
    },
    updateSplit(context) {
      let donationSplit = context.state.donation.donationSplit.map((el) => {
        if (el.amount > 0) {
          el.split = el.amount / context.getters.getZakat();
        }

        return el;
      });

      context.commit("SET_CHARITY", donationSplit);
    },
    updateAmountByPercent(context) {
      let donationSplit = context.state.donation.donationSplit.map((el) => {
        el.amount = bigNumberMult(
          context.getters.getAllocatableZakat(),
          el.split
        );

        return el;
      });

      context.commit("SET_CHARITY", donationSplit);
    },
    roundZakatOne(context) {
      let newZakat = context.getters.getZakatCalc();

      context.commit("SET_SINGLE_DONATION", {
        name: "Zakat",
        amount: Math.ceil(newZakat),
      });
    },
    roundZakatTen(context) {
      let newZakat = context.getters.getZakatCalc();

      context.commit("SET_SINGLE_DONATION", {
        name: "Zakat",
        amount: Math.ceil(newZakat / 10) * 10,
      });
    },
    roundZakatHundred(context) {
      let newZakat = context.getters.getZakatCalc();

      context.commit("SET_SINGLE_DONATION", {
        name: "Zakat",
        amount: Math.ceil(newZakat / 100) * 100,
      });
    },
    roundZakatFifty(context) {
      let newZakat = context.getters.getZakatCalc();

      context.commit("SET_SINGLE_DONATION", {
        name: "Zakat",
        amount: Math.ceil(newZakat / 50) * 50,
      });
    },
    resetZakat(context) {
      context.commit("SET_SINGLE_DONATION", {
        name: "Zakat",
        amount: zakatCalc(),
      });
    },
    updateZakat(context, newZakat) {
      var reg = new RegExp("[+-]?([0-9]*[.])?[0-9]+");

      if (!reg.test(newZakat.amount) || newZakat.amount <= 0) {
        newZakat.amount = 0;
      }

      context.commit("SET_ZAKAT", newZakat.amount);

      if (context.state.donation.donationTypes.length > 0) {
        context.commit("SET_SINGLE_DONATION", newZakat);
      } else {
        context.dispatch("addDonation", newZakat);
      }

      // Update delivery fee if it is set
      if (context.state.donation.donationTypes.find((el) => el.id == 3)) {
        context.commit("SET_SINGLE_DONATION", {
          name: deliveryFeeText,
          amount: context.getters.getZakatDeliveryCost(),
          id: 3,
          paymentType: newZakat.paymentType,
        });
      }
    },
    resetSplit(context) {
      let donationSplit = context.state.donation.donationSplit.map((el) => {
        el.split = 0;
        el.amount = 0;

        return el;
      });

      context.commit("SET_CHARITY", donationSplit);
    },
    addCashAsset(context, payload) {
      //if item exists update it. Otherwise add it
      if (
        context.state.user.assets.cash.other.some((el) => el.id == payload.id)
      ) {
        context.commit("UPDATE_CASH_ASSET", payload);
      } else {
        context.commit("ADD_CASH_ASSET", payload);
      }
    },
    addLiabilitiesAsset(context, payload) {
      //if item exists update it. Otherwise add it
      if (
        context.state.user.assets.liabilities.other.some(
          (el) => el.id == payload.id
        )
      ) {
        context.commit("UPDATE_LIABILITIES_ASSET", payload);
      } else {
        context.commit("ADD_LIABILITIES_ASSET", payload);
      }
    },
    addBusinessAsset(context, payload) {
      //if item exists update it. Otherwise add it
      if (
        context.state.user.assets.businessAssets.other.some(
          (el) => el.id == payload.id
        )
      ) {
        context.commit("UPDATE_BUSINESS_ASSET", payload);
      } else {
        context.commit("ADD_BUSINESS_ASSET", payload);
      }
    },
    addCryptoAsset(context, payload) {
      //if item exists update it. Otherwise add it
      if (
        context.state.user.assets.crypto.other.some((el) => el.id == payload.id)
      ) {
        context.commit("UPDATE_CRYPTO_ASSET", payload);
      } else {
        context.commit("ADD_CRYPTO_ASSET", payload);
      }
    },
    addInvestmentAsset(context, payload) {
      //if item exists update it. Otherwise add it
      if (
        context.state.user.assets.investment.other.some(
          (el) => el.id == payload.id
        )
      ) {
        context.commit("UPDATE_INVESTMENT_ASSET", payload);
      } else {
        context.commit("ADD_INVESTMENT_ASSET", payload);
      }
    },
    addMoneyOwedAsset(context, payload) {
      //if item exists update it. Otherwise add it
      if (
        context.state.user.assets.moneyOwed.other.some(
          (el) => el.id == payload.id
        )
      ) {
        context.commit("UPDATE_MONEY_OWED_ASSET", payload);
      } else {
        context.commit("ADD_MONEY_OWED_ASSET", payload);
      }
    },
    setProgressBar(context, payload) {
      context.commit("SET_PROGRESS", payload);
    },
    addGoldSilverAsset(context, payload) {
      //if item exists update it. Otherwise add it
      if (
        context.state.user.assets.goldSilver.other.some(
          (el) => el.id == payload.id
        )
      ) {
        context.commit("UPDATE_GOLD_SILVER_ASSET", payload);
      } else {
        context.commit("ADD_GOLD_SILVER_ASSET", payload);
      }
    },
    submitPayment(context, payload) {
      context.commit("SET_CARD_DETAILS", payload);
      context.commit("SET_RECOMMENDED_ZAKAT");

      let singleDonationSplit = () => {
        let zakatSingle = context.getters
          .getSingleDonations()
          .find((x) => x.id == "0");

        if (zakatSingle && zakatSingle.amount) {
          return context.state.donation.donationSplit;
        } else {
          return emptySplit;
        }
      };

      // Single donation object
      let singleDonation = {
        paymentMethod: "Secure Trading",
        user: {
          ...context.state.user,
          assets: {
            ...context.getters.getFormattedAssets(),
          },
          cardDetails: {
            xid: "-",
            status: "-",
            cavv: "-",
            dccenabled: false,
            ...context.state.user.cardDetails,
          },
          paymentDetails: {
            ...context.state.user.paymentDetails,
            paymentType: 1,
            numberOfPayments: 1,
            accountHolderName: "Single Payment",
            accountNumber: 12345678,
            bankSortCode: 123456,
            paymentStartDate: moment().format("YY-MM-DD"),
          },
          misc: {
            selectedPension: context.state.zakatCalculation.selectedPension,
          },
        },
        donation: {
          ...context.state.donation,
          // If Zakat is single donation, add donation split to api call
          donationSplit: singleDonationSplit(),
          giftAidAmount: calcPercentOfNum(
            context.getters.getSingleDonationsTotal(),
            giftAidPercent
          ),
          donationTypes: context.getters.getSingleDonations(),
          totalDonation: context.getters.getSingleDonationsTotal(),
          totalChargeable: context.getters.getSingleDonationsTotal(),
        },
      };

      return new Promise((resolve, reject) => {
        submitDonationToApi(singleDonation)
          .then((res) => {
            // {"data":{"customer":{"status":200,"ref":"5fe19692496739.495239771608619666"}}}

            context.commit("SET_CUSTOMER_REF", res.data);
            context.commit("CLEAR_SINGLE_DONATIONS");
            context.commit("SET_SUCCESS_MSG", "Card Payment Successful");

            if (context.getters.getRegularDonationsTotal() > 0) {
              return context
                .dispatch("submitDDPaymentApi")
                .then((res) => {
                  context.commit("CLEAR_REGULAR_DONATIONS");
                  resolve(res);
                })
                .catch((err) => {
                  context.commit(
                    "SET_PAYMENT_ERRORS",
                    "Error processing Direct Debit Details"
                  );
                  reject(err);
                });
            } else {
              resolve(res);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    loadStripePyamentIntent(context, payload) {
      console.log('loadStripePyamentIntent test')
      // console.log(context)
       console.log(payload)

      context.commit("SET_CARD_DETAILS", payload);
      context.commit("SET_RECOMMENDED_ZAKAT");

      let singleDonationSplit = () => {
        let zakatSingle = context.getters
          .getSingleDonations()
          .find((x) => x.id == "0");

        if (zakatSingle && zakatSingle.amount) {
          return context.state.donation.donationSplit;
        } else {
          return emptySplit;
        }
      };

      let donationTypes = context.getters.getSingleDonations();
      if (context.state.settings.SupportCostSlider == "1") {
        let splits = singleDonationSplit();
        donationTypes = context.getters.getSingleDonations().map((itm) => {
          if (itm.id === 3) {
            itm.amount = splits.find((sp) => sp.id === 4).amount;
            return itm;
          } else {
            return itm;
          }
        });
      }
      // Single donation object
      let singleDonation = {
        stripe: payload.card,
        paymentMethod: "Stripe",
        user: {
          ...context.state.user,
          assets: {
            ...context.getters.getFormattedAssets(),
          },
          cardDetails: {
            xid: "-",
            status: "-",
            cavv: "-",
            dccenabled: false,
            paymenttypedescription: payload.brand,
            ...context.state.user.cardDetails,
          },
          paymentDetails: {
            ...context.state.user.paymentDetails,
            paymentType: 1,
            numberOfPayments: 1,
            accountHolderName: "Single Payment",
            accountNumber: 12345678,
            bankSortCode: 123456,
            paymentStartDate: moment().format("YY-MM-DD"),
          },
          misc: {
            selectedPension: context.state.zakatCalculation.selectedPension,
          },
        },
        donation: {
          ...context.state.donation,
          donationSplit: singleDonationSplit(),
          giftAidAmount: calcPercentOfNum(
            context.getters.getSingleDonationsTotal(),
            giftAidPercent
          ),
          donationTypes: donationTypes,
          totalDonation: context.getters.getSingleDonationsTotal(),
          totalChargeable: context.getters.getSingleDonationsTotal(),
        },
      };

      // console.log('loadind console data')
       console.log('loading single donation')
       console.log(JSON.stringify(singleDonation) )

      return new Promise((resolve, reject) => {
        loadPaymentIntent(singleDonation)
          .then((res) => {
            if (typeof res.data.message == "undefined") {
              resolve(res);
            } else {
              resolve(res);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    stripePIDonation(context, payload) {
      let cardNo = JSON.stringify({ cardNumber: "" });
      localStorage.setItem("cardNumber", cardNo);
      payload.paymenttypedescription = payload.brand;
      context.commit("SET_CARD_DETAILS", payload);
      context.commit("SET_RECOMMENDED_ZAKAT");

      let singleDonationSplit = () => {
        let zakatSingle = context.getters
          .getSingleDonations()
          .find((x) => x.id == "0");

        if (zakatSingle && zakatSingle.amount) {
          return context.state.donation.donationSplit;
        } else {
          return emptySplit;
        }
      };
      // Single donation object
      let singleDonation = {
        stripe: payload.card,
        paymentMethod: payload.method,
        _ip: context.state._ip,
        user: {
          ...context.state.user,
          assets: {
            ...context.getters.getFormattedAssets(),
          },
          cardDetails: {
            xid: "-",
            status: "-",
            cavv: "-",
            dccenabled: false,
            paymenttypedescription: payload.brand,
            transactionreference: "",
            ...context.state.user.cardDetails,
          },
          paymentDetails: {
            ...context.state.user.paymentDetails,
            paymentType: 1,
            numberOfPayments: 1,
            accountHolderName: "Single Payment",
            accountNumber: 12345678,
            bankSortCode: 123456,
            paymentStartDate: moment().format("YY-MM-DD"),
          },
          misc: {
            selectedPension: context.state.zakatCalculation.selectedPension,
          },
        },
        donation: {
          ...context.state.donation,
          // If Zakat is single donation, add donation split to api call
          donationSplit: singleDonationSplit(),
          giftAidAmount: calcPercentOfNum(
            context.getters.getSingleDonationsTotal(),
            giftAidPercent
          ),
          donationTypes: context.getters.getSingleDonations(),
          totalDonation: context.getters.getSingleDonationsTotal(),
          totalChargeable: context.getters.getSingleDonationsTotal(),
        },
      };

      return new Promise((resolve, reject) => {
        submitDonationToStripePIApi(singleDonation)
          .then((res) => {
            if (typeof res.data.message == "undefined") {
              resolve(res);
            } else {
              resolve(res);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    MarkPaymentInCMS(context, payload) {
      let AllStates = JSON.parse(localStorage.getItem("journyData"));

      // context.commit('SET_RECOMMENDED_ZAKAT');
      let singleDonationSplit = () => {
        let zakatSingle = context.getters
          .getSingleDonations()
          .find((x) => x.id == "0");

        if (zakatSingle && zakatSingle.amount) {
          return context.state.donation.donationSplit;
        } else {
          return emptySplit;
        }
      };
      // Single donation object
      let singleDonation = {
        stripe: "",
        secret: "",
        _ip: context.state._ip,
        PI: payload.PI,
        paymentMethod:
          typeof payload.method !== "undefined" ? payload.method : "Stripe",
        user: {
          ...context.state.user,
          assets: {
            ...context.getters.getFormattedAssets(),
          },
          cardDetails: {
            xid: "-",
            status: "-",
            cavv: "-",
            dccenabled: false,
            paymenttypedescription: payload.brand,
            transactionreference: payload.PI,
            ...context.state.user.cardDetails,
          },
          paymentDetails: {
            ...context.state.user.paymentDetails,
            paymentType: 1,
            numberOfPayments: 1,
            accountHolderName: "Single Payment",
            accountNumber: 12345678,
            bankSortCode: 123456,
            paymentStartDate: moment().format("YY-MM-DD"),
            ...payload.paymentDetails,
          },
          misc: {
            selectedPension: context.state.zakatCalculation.selectedPension,
          },
        },
        donation: {
          ...context.state.donation,
          // If Zakat is single donation, add donation split to api call
          donationSplit: singleDonationSplit(),
          giftAidAmount: calcPercentOfNum(
            context.getters.getSingleDonationsTotal(),
            giftAidPercent
          ),
          donationTypes: AllStates.donation.donationTypes,
          totalDonation: context.getters.getSingleDonationsTotal(),
          totalChargeable: context.getters.getSingleDonationsTotal(),
        },
      };
      return new Promise((resolve, reject) => {
        submitDonationToCMS(singleDonation)
          .then((res) => {
            context.commit("SET_CUSTOMER_REF", res.data);
            context.commit("CLEAR_SINGLE_DONATIONS");
            context.commit("SET_SUCCESS_MSG", "Card Payment Successful");
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    stripeDonation(context, payload) {
      let cardNo = JSON.stringify({
        cardNumber: context.state.stripe.card.last4,
      });
      localStorage.setItem("cardNumber", cardNo);
      payload.paymenttypedescription = context.state.stripe.card.brand;
      context.commit("SET_CARD_DETAILS", payload);
      context.commit("SET_RECOMMENDED_ZAKAT");

      let singleDonationSplit = () => {
        let zakatSingle = context.getters
          .getSingleDonations()
          .find((x) => x.id == "0");

        if (zakatSingle && zakatSingle.amount) {
          return context.state.donation.donationSplit;
        } else {
          return emptySplit;
        }
      };

      // Single donation object
      let singleDonation = {
        stripe: context.state.stripe,
        paymentMethod: "Stripe",
        user: {
          ...context.state.user,
          assets: {
            ...context.getters.getFormattedAssets(),
          },
          cardDetails: {
            xid: "-",
            status: "-",
            cavv: "-",
            dccenabled: false,
            paymenttypedescription: context.state.stripe.card.brand,
            ...context.state.user.cardDetails,
          },
          paymentDetails: {
            ...context.state.user.paymentDetails,
            paymentType: 1,
            numberOfPayments: 1,
            accountHolderName: "Single Payment",
            accountNumber: 12345678,
            bankSortCode: 123456,
            paymentStartDate: moment().format("YY-MM-DD"),
          },
          misc: {
            selectedPension: context.state.zakatCalculation.selectedPension,
          },
        },
        donation: {
          ...context.state.donation,
          // If Zakat is single donation, add donation split to api call
          donationSplit: singleDonationSplit(),
          giftAidAmount: calcPercentOfNum(
            context.getters.getSingleDonationsTotal(),
            giftAidPercent
          ),
          donationTypes: context.getters.getSingleDonations(),
          totalDonation: context.getters.getSingleDonationsTotal(),
          totalChargeable: context.getters.getSingleDonationsTotal(),
        },
      };

      return new Promise((resolve, reject) => {
        submitDonationToStripeApi(singleDonation)
          .then((res) => {
            if (typeof res.data.message == "undefined") {
              context.commit("SET_CUSTOMER_REF", res.data);
              context.commit("CLEAR_SINGLE_DONATIONS");
              context.commit("SET_SUCCESS_MSG", "Card Payment Successful");

              if (context.getters.getRegularDonationsTotal() > 0) {
                return context
                  .dispatch("submitDDPaymentApi")
                  .then((res) => {
                    context.commit("CLEAR_REGULAR_DONATIONS");
                    resolve(res);
                  })
                  .catch((err) => {
                    context.commit(
                      "SET_PAYMENT_ERRORS",
                      "Error processing Direct Debit Details"
                    );
                    reject(err);
                  });
              } else {
                resolve(res);
              }
            } else {
              resolve(res);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    submitDirectDebitPayment(context) {
      context.commit("SET_TOTALS", {
        totalChargeable: context.getters.getRegularDonationsTotal(),
        totalDonation: context.getters.getTotalDonation(),
      });
      return context.dispatch("submitDDPaymentApi");
    },
    submitDDPaymentApi(context) {
      //If Zakat is not set to regular donation return empty donation split
      let regDonationSplit = () => {
        let zakatReg = context.getters
          .getRegularDonations()
          .find((x) => x.id == "0");

        if (zakatReg && zakatReg.amount) {
          return context.state.donation.donationSplit;
        } else {
          return emptySplit;
        }
      };

      // Regular donation object
      let regDonation = {
        paymentMethod: "Direct Debit - Stripe",
        user: {
          ...context.state.user,
          assets: {
            ...context.getters.getFormattedAssets(),
          },
          paymentDetails: {
            ...context.state.user.paymentDetails,
            paymentType: 2,
            numberOfPayments: 99,
          },
          misc: {
            selectedPension: context.state.zakatCalculation.selectedPension,
          },
        },
        donation: {
          ...context.state.donation,
          donationSplit: regDonationSplit(),
          giftAidAmount: calcPercentOfNum(
            context.getters.getRegularDonationsTotal(),
            giftAidPercent
          ),
          donationTypes: context.getters.getRegularDonations(),
          totalDonation: context.getters.getRegularDonationsTotal(),
          totalChargeable: context.getters.getRegularDonationsTotal(),
        },
      };

      return submitDonationToApi(regDonation);
    },
    submitSessionData(context, payload) {
      context.commit("SET_IP_ADDRESS", payload);
      return submitSessionDataApi(payload);
    },
    getSecureTradingJwt(context, params) {
      return axios
        .post(process.env.VUE_APP_API_URL + "/jwtToken", params)
        .then((res) => {
          context.commit("SET_SECURE_TRADING_JWT", res.data);
        });
    },
    convertToNum(context) {
      let assets = context.state.user.assets;

      //Convert assets to number
      assets.gold = stringToNum(assets.gold);
      assets.silver = stringToNum(assets.silver);

      assets.cash.inHand = stringToNum(assets.cash.inHand);
      assets.cash.inBank = stringToNum(assets.cash.inBank);
      assets.cash.sharesCapital = stringToNum(assets.cash.sharesCapital);
      assets.cash.sharesDividend = stringToNum(assets.cash.sharesDividend);
      assets.cash.receivables = stringToNum(assets.cash.receivables);
      assets.cash.cashIsa = stringToNum(assets.cash.cashIsa);
      assets.cash.sharesInvestments = stringToNum(
        assets.cash.sharesInvestments
      );
      assets.cash.pension = stringToNum(assets.cash.pension);
      assets.cash.crypto = stringToNum(assets.cash.crypto);
      assets.cash.cashOwedToYou = stringToNum(assets.cash.cashOwedToYou);
      assets.cash.loanOwedToYou = stringToNum(assets.cash.loanOwedToYou);
      assets.cash.soldOwedToYou = stringToNum(assets.cash.soldOwedToYou);

      if (assets.cash.other.length > 0) {
        assets.cash.other.map((el) => {
          el.value = stringToNum(el.value);
        });
      }
      if (assets.goldSilver.other.length > 0) {
        assets.goldSilver.other.map((el) => {
          el.value = stringToNum(el.value);
        });
      }

      if (assets.moneyOwed.other.length > 0) {
        assets.moneyOwed.other.map((el) => {
          el.value = stringToNum(el.value);
        });
      }
      if (assets.crypto.other.length > 0) {
        assets.crypto.other.map((el) => {
          el.value = stringToNum(el.value);
        });
      }

      if (assets.investment.other.length > 0) {
        assets.investment.other.map((el) => {
          el.value = stringToNum(el.value);
        });
      }

      assets.businessAssets.cash = stringToNum(assets.businessAssets.cash);
      assets.businessAssets.receivables = stringToNum(
        assets.businessAssets.receivables
      );
      assets.businessAssets.stock = stringToNum(assets.businessAssets.stock);

      if (assets.businessAssets.other.length > 0) {
        assets.businessAssets.other.map((el) => {
          el.value = stringToNum(el.value);
        });
      }

      assets.liabilities.housePayments = stringToNum(
        assets.liabilities.housePayments
      );
      assets.liabilities.bills = stringToNum(assets.liabilities.bills);
      assets.liabilities.borrowed = stringToNum(assets.liabilities.borrowed);
      assets.liabilities.overdraft = stringToNum(assets.liabilities.overdraft);
      assets.liabilities.credit = stringToNum(assets.liabilities.credit);
      assets.liabilities.tax = stringToNum(assets.liabilities.tax);

      if (assets.liabilities.other.length > 0) {
        assets.liabilities.other.map((el) => {
          el.value = stringToNum(el.value);
        });
      }

      let donation = context.state.donation;

      if (donation.giftAidAmount) {
        donation.giftAidAmount = stringToNum(donation.giftAidAmount);
      }

      if (donation.donationTypes.length > 0) {
        donation.donationTypes.map((el) => {
          if (typeof el.amount == "object") {
            el.amount = el.amount.toString();
          } else {
            el.amount = stringToNum(el.amount);
          }
        });
      }

      if (donation.donationSplit.length > 0) {
        donation.donationSplit.map((el) => {
          el.amount = stringToNum(el.amount);
        });
      }

      context.commit("SET_ASSETS", { ...context.state.user.assets, ...assets });

      // Will set donation
      context.commit("CLEAR_DONATION", {
        ...context.state.donation,
        ...donation,
      });
    },
    fetchWaysToGivePage(context) {
      axios
        .get(
          process.env.VUE_APP_API_URL +
            "/page/" +
            context.state.pages.orderWaysToGive.slug
        )
        .then((res) => {
          context.commit("SET_OTHER_WAYS_PAGE", res.data.data);
        });
    },
    fetchStErrorPagePage(context) {
      axios
        .get(
          process.env.VUE_APP_API_URL +
            "/page/" +
            context.state.pages.stErrorPage.slug
        )
        .then((res) => {
          context.commit("SET_ST_ERROR_PAGE", res.data.data);
        });
    },
    sendCalculationJourny(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(process.env.VUE_APP_API_URL + "/send", payload)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getCalculationJourny(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(process.env.VUE_APP_API_URL + "/getJourney", payload)
          .then((res) => {
            context.commit("SET_CALCULATION_JOURNY", res.data);
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
  plugins: [
    createPersistedState({
      paths: [
        "user.assets",
        "calculatorFilter.selected",
        "calculationSettings",
        "goldSilverWeightSettings",
        "zakatCalculation.selectedPension",
      ],
      storage: {
        getItem: (key) => Cookies.get(key),
        setItem: (key, value) => Cookies.set(key, value, { expires: 1 / 24 }),
        removeItem: (key) => Cookies.remove(key),
      },
    }),
  ],
});

export default store;
