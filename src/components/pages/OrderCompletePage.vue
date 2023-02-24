<template>
  <div></div>
</template>

<script>
import queryString from 'query-string';
import { mapFields } from 'vuex-map-fields';
export default {
  name: 'OrderCompletePage',
  components: {},
  data() {
    return {
      stripe: window.Stripe(process.env.VUE_APP_STRIPE_API_KEY, {
        locale: 'nl',
      }),
    };
  },
  computed: {
    ...mapFields([
      'user.paymentDetails',
      'user.cardDetails.maskedpan',
      'paymentSubmit.loading',
      'paymentSubmit.errors',
      'paymentSubmit.msg',
      'flash.success',
      'donation.giftAid',
    ]),
  },
  mounted() {
    window.scrollTo(0, 0);
    const client_secret = queryString.parse(location.search)
      .payment_intent_client_secret;
    this.stripe.retrievePaymentIntent(client_secret).then((result) => {
      let payload = {};

      if (result.paymentIntent.status === 'succeeded') {
        payload.secret = client_secret;

        const storedPaymentDetails = JSON.parse(
          localStorage.getItem('pDetails')
        );
        payload.paymentDetails = storedPaymentDetails.user.paymentDetails;
        payload.donationTypes = storedPaymentDetails.donation.donationTypes;

        this.$store
          .dispatch('MarkPaymentInCMS', payload)
          .then((res) => {
            if (res.status == 200) {
              if (location.search !== '' && location.search !== null) {
                let payload = {
                  _ip: this._ip,
                  _uetsid: localStorage.getItem('_uetsid'),
                  _uetsid_exp: localStorage.getItem('_uetsid_exp'),
                  _uetvid: localStorage.getItem('_uetvid'),
                  _uetvid_exp: localStorage.getItem('_uetvid_exp'),
                  firstname: this.paymentDetails.firstName,
                  lastname: this.paymentDetails.lastName,
                  email: this.paymentDetails.address.emailAddress,
                  URLString: location.search,
                  dataObject: JSON.stringify(
                    queryString.parse(location.search)
                  ),
                  customerRef:
                    typeof this.customerRef.data.customer !== 'undefined'
                      ? this.customerRef.data.customer.ref
                      : null,
                  journyStatus: 'Completed',
                };
                this.$store.dispatch('submitSessionData', payload);
              }
              this.loading = false;
              this.msg = '';
              this.$router.push({ path: '/thank-you' });
            }
          })
          .finally(() => {
            this.$router.replace({ path: '/thank-you' });
          });
      }

      this.loading = false;
    });
  },
};
</script>
