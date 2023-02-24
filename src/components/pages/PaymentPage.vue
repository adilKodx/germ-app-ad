<template>
  <scroll-container id="top">
    <div class="pt-32 px-4" style="z-index: 30">
      <h1 class="header-2 header mb-3">{{ getLabel("Your details") }}</h1>

      <p class="mb-6">
        {{
          getLabel(
            "Please fill in your details below to complete your donation"
          )
        }}

        <span
          class="block mt-4 flex flex-col lg:hidden"
          v-if="getSingleDonationsTotal() > 0"
        >
          <span class="text-lg" v-if="getSingleDonationsTotal() > 0">
            <span class="bold-dark">Totaal:</span>
            {{ formatCommas(parseFloat(getSingleDonationsTotal()).toFixed(2)) }}
          </span>
          <span class="details-btn mt-4">
            <div class="btn -active -small" @click="openNav">
              Mijn overzicht
            </div>
          </span>
        </span>
      </p>

      <div class="w-full sm:w-1/2 sm:pr-4">
        <div class="mb-1 text-gray font-semibold sm:text-lg font-heading-2">
          {{ getLabel("Titel") }}
        </div>
        <radio
          :buttons="buttons"
          name="allocation"
          class=""
          id="allocation"
          @change="setTitle"
          @init="setTitle"
          :fullWidth="true"
          :wrap="false"
          :border="false"
          :largeLabel="true"
        >
        </radio>
      </div>

      <div class="flex flex-col sm:flex-row">
        <div class="w-full sm:w-1/2 sm:mr-4">
          <text-input
            name="Voornaam"
            placeholder="Gib deinen Namen ein"
            :currency="false"
            v-model="paymentDetails.firstName"
            :small="true"
          >
          </text-input>
        </div>

        <div class="w-full sm:w-1/2 sm:ml-4">
          <text-input
            name="Nachname"
            placeholder="Gib bitte Deinen Nachnamen ein"
            :currency="false"
            v-model="paymentDetails.lastName"
            :small="true"
          >
          </text-input>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row">
        <div class="w-full sm:w-1/2 sm:mr-4">
          <text-input
            name="E-mailadres*"
            placeholder="Gib bitte deine E-Mailadresse ein"
            :currency="false"
            v-model="paymentDetails.address.emailAddress"
            :validators="{ required: v.required, email: v.email }"
            errormessage="Bitte gib uns eine gültige E-Mailadresse an"
            @errors="setValidate"
            :tooltip="true"
            :small="true"
          >
            <template v-slot:toolTip>
              <tool-tip
                :text="getLabel('Email Tooltip')"
                class="flex justify-start"
                :width="'50%'"
              >
                <div
                  class="
                    bg-gray-200
                    w-4
                    h-4
                    flex
                    justify-center
                    items-center
                    rounded-full
                    cursor-pointer
                    relative
                    z-50
                  "
                >
                  <span
                    class="icon-container -blue h-full overflow-hidden h-full"
                  >
                    <i
                      class="
                        ion-ios-help
                        text-white
                        help-icon
                        h-full
                        flex
                        items-center
                      "
                    ></i>
                  </span>
                </div>
              </tool-tip>
            </template>
          </text-input>
        </div>

        <div class="w-full sm:w-1/2 sm:ml-4">
          <text-input
            name="Telefoonnummer"
            id="phonenumber"
            placeholder="Vul jouw telefoonnummer"
            :currency="false"
            type="number"
            v-model="paymentDetails.address.contactNumber"
            :validators="{ phoneNumberCheck: v.phoneNumberCheck }"
            errormessage="Geef een geldig telefoonnummer op"
            @errors="setValidate"
            :tooltip="true"
            :small="true"
          >
            <template v-slot:toolTip>
              <tool-tip
                :text="getLabel('Mobile Number Tooltip')"
                class="flex justify-start"
                :width="'50%'"
              >
                <div
                  class="
                    bg-gray-200
                    w-4
                    h-4
                    flex
                    justify-center
                    items-center
                    rounded-full
                    cursor-pointer
                    relative
                    z-50
                  "
                >
                  <span
                    class="icon-container -blue h-full overflow-hidden h-full"
                  >
                    <i
                      class="
                        ion-ios-help
                        text-white
                        help-icon
                        h-full
                        flex
                        items-center
                      "
                    ></i>
                  </span>
                </div>
              </tool-tip>
            </template>
          </text-input>
        </div>
      </div>
    </div>
    <div
      class="pb-6 px-4"
      v-if="this.getSingleDonationsTotal() > 0"
      style="z-index: 20"
      id="card-details"
    >
      <div class="mb-4">
        Wij gebruiken deze gegevens om je op de hoogte te houden van jouw
        impact. Bekijk onze
        <a
          href="https://nationaalzakatfonds.nl/privacy-verklaring/"
          class="bold text-blue-100"
          target="_blank"
          >privacyverklaring</a
        >
        voor meer informatie.
      </div>
      <div class="mb-4">{{ getLabel("Wij accepteren") }}:</div>

      <div class="mb-6">
        <div v-if="PaymentMethod == 'Stripe'">
          <img src="/static/img/icons8-visa.svg" alt="" style="float: left" />
          <img
            src="/static/img/icons8-mastercard.svg"
            alt=""
            style="padding-left: 7px; float: left"
          />
          <img
            src="/static/img/icons8-american-express.svg"
            alt=""
            style="padding-left: 7px; float: left"
          />
          <img
            src="/static/img/icons8-maestro.svg"
            alt=""
            style="padding-left: 7px; float: left"
          />
          <img
            src="/static/img/ideal-logo.svg"
            alt=""
            style="padding-left: 7px"
            class="idealImage"
          />
        </div>
      </div>

      <h2 class="header header-3 font-style-2 font-semibold mb-4">
        {{ getLabel("Single donation payment details") }}
      </h2>
      <div v-if="CheckValidationExist">
      <stripe-checkout ref="stripe"></stripe-checkout>
      </div>
    </div>

    <div class="pb-12 px-4">
      <div
        class="text-sm leading-normal mt-4"
        v-if="ContactTextCheck"
        v-html="ContactText"
      ></div>
    </div>

    <!-- <div class="w-full sm:w-1/2 mb-40 px-4">
      <btn
        id="complete-payment"
        :class="{ '-active': validates }"
       
        @click="handleClick"
      >
        <span >check stripe</span>
       
      </btn>
    </div> -->

    <div class="w-full sm:w-1/2 mb-40 px-4">
      <btn
        id="complete-payment"
        :class="{ '-active': validates }"
        @click="submitPayment"
      >
        <span v-if="!loading" id="complete-payment-text">{{
          getLabel("Complete Payment")
        }}</span>
        <span v-else><spinner></spinner></span>
      </btn>
    </div>

    <flash-container>
      <transition name="fade">
        <error-message v-if="errors">
          <span v-if="msg.length > 0">
            {{ msg }}
          </span>
          <span v-else> Überprüfe deine Zahlungsdetails </span>
        </error-message>
      </transition>
    </flash-container>
  </scroll-container>
</template>

<script>
import ScrollContainer from "../scroll/ScrollContainer";
import FlashContainer from "../containers/FlashContainer";
import StripeCheckout from "../payment/Stripe";
import TextInput from "../inputs/TextInput";
import Btn from "../inputs/Btn";
import Spinner from "../Spinner";
import { mapGetters, mapState } from "vuex";
import { mapFields } from "vuex-map-fields";
import { EventBus } from "../../utils/eventBus.js";
import { numberWithCommas } from "../../utils/helpers.js";
import ErrorMessage from "../ErrorMessage";
import validators from "../../utils/validators";
import moment from "moment";
import { paths } from "../../utils/GlobalVars";
import queryString from "query-string";
import Radio from "../inputs/Radio";
import ToolTip from "../inputs/ToolTip";
// import $ from "jquery";

export default {
  name: "PaymentPage",
  components: {
    ScrollContainer,
    TextInput,
    Btn,
    StripeCheckout,
    Spinner,
    ErrorMessage,
    FlashContainer,
    Radio,
    ToolTip,
  },
  data() {
    return {
      titles: ["Mr.", "Mw."],
      paymentTypes: ["Direct Debit", "Card"],
      address: false,
      CheckValidationExist:true,
      validates: false,
      checkPaymentType : "Zakat",
      stripelements:"",
      emitClientSecret:"",
      payment: 'stripe',
      // fieldsShow: false,
      errorsArr: [],
    };
  },
  methods: {

    handleClick() {
      
      this.CheckValidationExist = !this.CheckValidationExist;
      console.log('handleClick')
      console.log(this.CheckValidationExist)
    },

    // handleFields () {
    //   this.fieldsShow = !this.fieldsShow
    // },
    checkPayment(){
      return this.getSingleDonationsCheck();
    },
    formatCommas(value) {
      return numberWithCommas(value);
    },
    emit(eventName) {
      return new Promise((resolve, reject) => {
        this.$emit(eventName);
        this.$nextTick(resolve);
      });
    },
    async emitCheckValidation() {
      await EventBus.$emit("checkValidation");
    },
    storePaymentDetailsStripeRouting() {
      localStorage.setItem("journyData", JSON.stringify(this.journyData));
    },
    payWithCard(stripe, clientSecret, card, name) {
      // Initiate the payment.
      // If authentication is required, confirmCardPayment will automatically display a modal
      const email = this.paymentDetails.address.emailAddress;
      stripe
        .confirmCardPayment(clientSecret, {
          payment_method: {
            card: card,
            billing_details: {
              name: name && name !== "" && name !== " " ? name : email,
            },
          },
        })
        .then((result) => {
          if (result.error) {
            // Show error to your customer
            this.showError(result.error.message);
            this.errorMsg(result.error);
          } else {
            this.loading = false;
            this.msg = "";
            this.checkPaymentType = this.checkPayment();
            // console.log(this.checkPaymentType);
            // return false;
              if (this.checkPaymentType == 'Zakat') {
                this.$router.push({ path: "/bedankt-voor-jouw-zakat" });
              }else if(this.checkPaymentType == 'Sadaqah'){
                this.$router.push({ path: "/bedankt-voor-jouw-sadaqah" });
              }else{
                this.$router.push({ path: "/bedankt-voor-jouw-betaling" });
              }
            // The payment has been processed!
            // this.orderComplete(clientSecret);
          }
        });
    },

    payWithiDEAL(stripe, clientSecret, ideal, name) {
      this.storePaymentDetailsStripeRouting();
      const email = this.paymentDetails.address.emailAddress;
      stripe
        .confirmIdealPayment(clientSecret, {
          payment_method: {
            ideal: ideal,
            billing_details: {
              name: name && name !== "" && name !== " " ? name : email,
            },
          },
          return_url: `${window.location.origin}/bereken/`,
        })
        .then((result) => {
          // console.log('result', result);
          if (result.error) {
            // Show error to your customer
            this.showError(result.error.message);
            this.errorMsg(result.error);
          } else {
            // this.orderComplete(clientSecret);
          }
        });
    },

    orderComplete(secret) {
      this.$refs.stripe.stripe.retrievePaymentIntent(secret).then((result) => {
        let payload = {
          card: "",
          brand: "",
          PI: result.paymentIntent.id,
        };
        document.querySelector(".sr-payment-form").classList.add("hidden");
        if (result.paymentIntent.status === "succeeded") {
          payload.secret = secret;
          // this.loading = false;
          // this.msg = "";
          // this.$router.push({ path: "/bedankt-voor-jouw-betaling" });

          this.$store.dispatch("MarkPaymentInCMS", payload).then((res) => {
            let payload = {
              _ip: this._ip,
              _uetsid: localStorage.getItem("_uetsid"),
              _uetsid_exp: localStorage.getItem("_uetsid_exp"),
              _uetvid: localStorage.getItem("_uetvid"),
              _uetvid_exp: localStorage.getItem("_uetvid_exp"),
              firstname: this.paymentDetails.firstName,
              lastname: this.paymentDetails.lastName,
              email: this.paymentDetails.address.emailAddress,
              URLString: location.search,
              dataObject: JSON.stringify(queryString.parse(location.search)),
              customerRef:
                typeof this.customerRef.data.customer !== "undefined"
                  ? this.customerRef.data.customer.ref
                  : null,
              journyStatus: "Completed",
            };
            this.$store.dispatch("submitSessionData", payload);
            if (res.status == 200) {
              console.log(this)
              this.loading = false;
              this.msg = "";
              this.checkPaymentType = this.checkPayment();
            // console.log(this.checkPaymentType);
            // return false;
              if (this.checkPaymentType == 'Zakat') {
                this.$router.push({ path: "/bedankt-voor-jouw-zakat" });
              }else if(this.checkPaymentType == 'Sadaqah'){
                this.$router.push({ path: "/bedankt-voor-jouw-sadaqah" });
              }else{
                this.$router.push({ path: "/bedankt-voor-jouw-betaling" });
              }

            } else {
              this.loading = false;
              // this.$router.push({ path: '/bedankt-voor-jouw-betaling' });
            }
          });
        }
      });
    },

    showError(errorMsgText) {
      this.loading = false;
      var errorMsg = document.querySelector(".sr-field-error");
      errorMsg.textContent = errorMsgText;
      setTimeout(() => {
        errorMsg.textContent = "";
      }, 4000);
    },

    async  submitPayment(e) {
    //async  handleSubmit(e) {

      // handling validation
      console.log('clicked submit payment')
      //console.log(this.paymentDetails)
      const regex = /[‘´ʼʹ’]/gi;

      this.paymentDetails.accountHolderName =
        this.paymentDetails.accountHolderName.replace(regex, "'");
      this.paymentDetails.firstName = this.paymentDetails.firstName.replace(
        regex,
        "'"
      );
      this.paymentDetails.lastName = this.paymentDetails.lastName.replace(
        regex,
        "'"
      );
      this.paymentDetails.companyName = this.paymentDetails.companyName.replace(
        regex,
        "'"
      );      

      this.setLocalStorage();

      if (
        this.getSingleDonationsTotal() == 0 &&
        this.getRegularDonationsTotal() == 0
      ) {
        this.errorMsg("Basket is empty");
        this.$scrollTo("#regular-payment", 500, { offset: -175 });
        return;
      } else if (this.regularZakat + this.regularNoZakat > 800) {
        this.errorMsg("Regular payments must be below £800");
        return;
      } else if (
        this.regularNoZakat + this.regularZakat > 0 &&
        this.regularNoZakat + this.regularZakat < 1
      ) {
        this.errorMsg("Regular payments must be at least £1.");
        return;
      }

      this.emitCheckValidation();

      this.loading = true;

      setTimeout(async () => {
        let scrollId =
          this.errorsArr.filter((el) => el.error).length > 0
            ? this.errorsArr.filter((el) => el.error)[0].id
            : "top";

        if (this.validates) {
          console.log('consoling validation true')

          if(this.payment ){  
          var elements =this.stripelements
          console.log('loading payment element')
          console.log(elements)
          var stripe = this.$refs.stripe;
          // console.log('loading refs')
          // console.log(stripe)
          //if (!this.getGateway("paypal")) {
            //stripe = this.$refs.stripe;
          // } else {
          //   stripe = this.$refs.radioStripe.$refs.stripe[0];
          // }

          let name = this.paymentDetails.firstName +
                    "/" +
                    this.paymentDetails.lastName+
                    "/" +
                    this.paymentDetails.companyName;
            
            this.loading = true;
            let that = this;
            this.msg = "";
            await stripe.stripe.confirmPayment({
                elements,
                confirmParams: {
                  return_url: this.redirectPage,
                  payment_method_data: {
                    billing_details: {
                      
                      address: {
                            city: that.paymentDetails.address.townCity,
                            // country: "PK",
                            line1: that.paymentDetails.address.lineOne,
                            line2: that.paymentDetails.address.lineTwo,
                            postal_code: that.paymentDetails.address.postCode,
                            state: null
                          },
                          email: that.paymentDetails.address.emailAddress,
                          name: name ,
                          phone: that.paymentDetails.address.contactNumber,
                    },
                  },
                },
              })
              .then(async  function (result) {                
                  if (result.error) {
                    that.loading = false;
                    console.log(result.error)
                    
                    that.errorMsg(result.error.message);
                    
                    console.log("foundasas error")
                    // Inform the customer that there was an error.
                  }else{
                    that.loading = false;
                    console.log("success")

                  }
                });//  ********END**********
            }else{
            console.log('payment methord')
            this.errorMsg("Please Select Payment Method");
          }
        }else{
          this.loading = false;
          console.log('validation failed')
          this.errorMsg("Please check required fields");
          
          
          this.$scrollTo("#" + scrollId, 500, { offset: -175 });
        }
      // end handling validation  

      }, 5);// set tieout end
    },

    // async submitPayment() {
    //   if (this.loading) {
    //     return true;
    //   }
    //   var elements =this.stripelements;
    //   console.log('submit payment stripe');
    //   console.log(elements);

    //   const selectedPaymentMethod = document.querySelector(
    //     ".sr-pm-button.selected"
    //   );

    //   const regex = /[‘´ʼʹ’]/gi;

    //   this.paymentDetails.firstName = this.paymentDetails.firstName.replace(
    //     regex,
    //     "'"
    //   );
    //   this.paymentDetails.lastName = this.paymentDetails.lastName.replace(
    //     regex,
    //     "'"
    //   );

    //   this.setLocalStorage();

    //   if (this.getSingleDonationsTotal() == 0) {
    //     this.errorMsg(
    //       "Je hebt geen betaling in jouw overzicht. Ga terug naar de andere sectie en vul daar een bedrag in dat je wil afdragen."
    //     );
    //     return;
    //   }

    //   this.emitCheckValidation();

    //   this.loading = true;

    //   setTimeout(async () => {
    //     let scrollId =
    //       this.errorsArr.filter((el) => el.error).length > 0
    //         ? this.errorsArr.filter((el) => el.error)[0].id
    //         : "top";

    //     if (this.validates) {
    //       if (this.getSingleDonationsTotal() > 0) {
    //         if (this.PaymentMethod == "Stripe") {
    //           var stripe = this.$refs.stripe;
    //           let payload = {
    //             card: stripe.card,
    //             brand: stripe.cardBrand,
    //             method:
    //               selectedPaymentMethod.id == "card-button" ? "Card" : "iDEAL",
    //           };
    //           this.$store
    //             .dispatch("stripePIDonation", payload)
    //             .then((res) => {
    //               if (res.status == 200) {
    //                 if (typeof res.data.message !== "undefined") {
    //                   this.errorMsg(res.data.message);
    //                 } else {
    //                   // Make stripe payment with Payment Intent ID
    //                   let secret = res.data.client_secret;
    //                   let name =
    //                     this.paymentDetails.firstName +
    //                     " " +
    //                     this.paymentDetails.lastName;
    //                   this.$store.dispatch("SaveLocalStateData");
    //                   switch (selectedPaymentMethod.id) {
    //                     case "card-button":
    //                       this.payWithCard(
    //                         stripe.stripe,
    //                         secret,
    //                         stripe.card,
    //                         name
    //                       );
    //                       return;
    //                     case "ideal-button":
    //                       this.payWithiDEAL(
    //                         stripe.stripe,
    //                         secret,
    //                         stripe.ideal,
    //                         name
    //                       );
    //                       return;
    //                     default:
    //                       console.log("Error: no payment method selected");
    //                   }
    //                 }
    //               } else {
    //                 console.error("Stripe API call failed");
    //               }
    //             })

    //             .catch((e) => {
    //               if (typeof e.message !== "undefined") {
    //                 this.errorMsg(e.message);
    //               } else {
    //                 this.errorMsg(
    //                   "Er ging iets mis met de betaling. Probeer het opnieuw of neem contact met ons op."
    //                 );
    //               }
    //             });
    //         }
    //       }
    //     } else {
    //       console.log("all validation failed");

    //       this.errorMsg("Controleer de verplichte velden");
    //       this.$scrollTo("#" + scrollId, 500, { offset: -175 });
    //     }
    //   });
    // },

    
    errorMsg(msg) {
      this.loading = false;
      this.errors = true;
      this.msg = msg;

      setTimeout(() => {
        this.errors = false;
        this.msg = "";
      }, 5000);
    },
    setValidate(payload) {
      if (!this.errorsArr.some((error) => error.id === payload.id)) {
        this.addError(payload);
      } else {
        this.updateError(payload);
      }

      this.errorsArr.some((error) => error.error)
        ? (this.validates = false)
        : (this.validates = true);
    },
    addError(error) {
      this.errorsArr.push(error);
    },
    updateError(updatedError) {
      this.errorsArr.forEach((error, index) => {
        if (error.id === updatedError.id) {
          this.errorsArr[index] = updatedError;
        }
        return error;
      });
    },
    contactCheckbox(val) {
      this.paymentDetails.contactSubject = val;
    },
    setTitle(title) {
      this.paymentDetails.title = title;
    },
    optInCheckbox(val) {
      // {name:'Email', value: 1},
      this.paymentDetails.optIn.email = val.includes(1);
      // {name:'Post', value: 2},
      this.paymentDetails.optIn.post = val.includes(2);
      // {name:'SMS', value: 3},
      this.paymentDetails.optIn.sms = val.includes(3);
      // {name:'Telephone', value: 4},
      this.paymentDetails.optIn.phone = val.includes(4);

      this.paymentDetails.optIn.whatsapp = val.includes(5);

      this.paymentDetails.optIn.telegram = val.includes(6);
    },
    setLocalStorage() {
      localStorage.setItem("basket", JSON.stringify(this.donationTypes));
      localStorage.setItem("donationSplit", JSON.stringify(this.donationSplit));

      localStorage.setItem(
        "address",
        JSON.stringify({
          postCode: this.paymentDetails.postCode,
          address: {
            ...this.paymentDetails.address,
          },
        })
      );

      localStorage.setItem(
        "giftAid",
        JSON.stringify({ giftAid: this.giftAid })
      );

      let accNum = String(this.paymentDetails.accountNumber);

      localStorage.setItem(
        "accountNumber",
        JSON.stringify({
          accountNumber: accNum.substring(accNum.length - 3),
        })
      );
    },
    openNav() {
      EventBus.$emit("openMobileNav");
    },
  },
  computed: {
    ...mapFields([
      "user.paymentDetails",
      "user.cardDetails.maskedpan",
      "paymentSubmit.loading",
      "paymentSubmit.errors",
      "paymentSubmit.msg",
      "flash.success",
      "donation.giftAid",
    ]),
    ...mapGetters([
      "getLabel",
      "getSingleDonations",
      "getSingleDonationsCheck",
      "getSingleDonationsTotal",
      "getRegularDonationsTotal",
      "getRegularDonations",
    ]),
    ...mapState({
      journyData: (state) => state,
      _ip: (state) => state._ip,
      donationTypes: (state) => state.donation.donationTypes,
      donationSplit: (state) => state.donation.donationSplit,
      ContactTextCheck: (state) =>
        state.settings.ContactTextCheck == 1 ? true : false,
      PaymentMethod: (state) => state.settings.PaymentMethod,
      ContactText: (state) => state.settings.ContactText,
      stripe: (state) => state.stripe,
      customerRef: (state) => state.customerRef,
    }),
    
    buttons() {
      return [
        {
          name: "Man",
          value: "Man",
          selected: this.paymentDetails.title == "Man" ? true : false,
        },
        {
          name: "Vrouw",
          value: "Vrouw",
          selected: this.paymentDetails.title == "Vrouw" ? true : false,
        },
      ];
    },
    paths() {
      return paths;
    },
    v() {
      return { ...validators };
    },
    formettedDate() {
      if (this.paymentDetails.paymentStartDate) {
        return moment(this.paymentDetails.paymentStartDate, "YY-MM-DD").format(
          "DD/MM/YY"
        );
      }

      return "";
    },
  },
  mounted() {

    let finalurl = window.location.origin 
    this.redirectPage = finalurl;

    console.log(this.redirectPage)    
    EventBus.$on("changeTitle", (event ) =>{
       this.stripelements =event; 
   
    });
    EventBus.$on("emitClientSecret", (event ) =>{
       this.emitClientSecret =event; 
   
    });
    console.log('check load validation');
    console.log(this.validates);
    
    if (this.$route.hash) {
      this.$scrollTo(this.$route.hash, 1, { offset: -200 });
    } else {
      window.scrollTo(0, 0);
    }
    let query = queryString.parse(location.search);
    if (typeof query.redirect_status == "undefined") {
      if (query.redirect_status == "failed") {
        this.validates = false;
        this.loading = false;
        this.errorMsg("Error processing payment");
      }
    }

    this.$store.dispatch("convertToNum");

    this.loading = false;
  },
  beforeDestroy() {
    this.errors = false;
    this.$store.commit("SET_SUCCESS_MSG", "");
  },
};
</script>
<style scoped>
@media only screen and (max-width: 540px) {
  .idealImage {
    width: 13% !important;
  }
}

@media only screen and (max-width: 600px) {
  .idealImage {
    width: 12% !important;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .idealImage {
    width: 8% !important;
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .idealImage {
    width: 8% !important;
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  .idealImage {
    width: 10% !important;
  }
}
</style>
