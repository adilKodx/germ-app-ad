import 'babel-polyfill'
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import Sticky from 'vue-sticky-directive/vue-sticky-directive'
import VueScrollTo from 'vue-scrollto';
import Vuelidate from 'vuelidate';
import SlideUpDown from 'vue-slide-up-down';
import { VTooltip, VPopover, VClosePopover } from 'v-tooltip'
import VueMeta from 'vue-meta'
import VueCurrencyInput from 'vue-currency-input'
// import VueGtm from 'vue-gtm'
// import VueGtag from "vue-gtag"
import VModal from 'vue-js-modal'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'


Vue.component('v-icon', Icon)

Vue.use(VueMeta)

require('es6-promise/auto');

Vue.directive('tooltip', VTooltip)
Vue.directive('close-popover', VClosePopover)
Vue.component('v-popover', VPopover)
Vue.use(Vuelidate);

// const pluginOptions = {
//     /* see config reference */
//     globalOptions: { currency: "EUR", locale: "de-DE" }
//   }
Vue.use(VueCurrencyInput)

Vue.use(VueScrollTo, {
    container: "body",
    duration: 500,
    easing: "ease",
    offset: 0,
    force: true,
    cancelable: true,
    onStart: false,
    onDone: false,
    onCancel: false,
    x: false,
    y: true
});

Vue.component('slide-up-down', SlideUpDown);

Vue.use(Sticky);
Vue.use(VueRouter);

Vue.config.productionTip = false;

import routes from './routes';
import store from './store';

const router = new VueRouter({
    mode: 'history',
    routes
});

router.afterEach((to, from) => {
    console.log(from.path)
    router.push({ path: to.path +location.search});
    localStorage.setItem('last-route', from.path);
});

// Vue.use(VueGtm, {
//     id: process.env.VUE_APP_BRANCH != 'test' ? ['GTM-5WPG8JF'] : ['GTM-K74S99V'], // Your GTM single container ID or array of container ids ['GTM-xxxxxxx', 'GTM-yyyyyyy']
//     enabled: true, // defaults to true. Plugin can be disabled by setting this to false for Ex: enabled: !!GDPR_Cookie (optional)
//     debug: false, // Whether or not display console logs debugs (optional)
//     loadScript: true,
//     vueRouter: router,
// });
// Vue.use(VueGtag, {
//     config: { id: "UA-74254724-1" },
//     debug: false
//   });

Vue.directive('click-outside', {
    bind: function (el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
            // here I check that click was outside the el and his childrens
            if (!(el == event.target || el.contains(event.target))) {
                // and if it did, call method provided in attribute value
                vnode.context[binding.expression](event);
            }
        };
        document.body.addEventListener('click', el.clickOutsideEvent)
    },
    unbind: function (el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
    },
});
Vue.use(VModal);

new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app');
