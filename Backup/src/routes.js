import BackBtnContainer from './components/containers/BackBtnContainer';
import DonationSideBarContainer from './components/containers/DonationSideBarContainer';
import ProgressContainer from './components/containers/ProgressContainer';
import ThankYouSideBarContainer from './components/containers/ThankYouSideBarContainer';
import CalculatorPage from './components/pages/CalculatorPage';
import DirectDebitGuarantee from './components/pages/DirectDebitGuarantee';
import DonationPage from './components/pages/DonationPage';
import OrderCompletePage from './components/pages/OrderCompletePage';
import OtherWaysPage from './components/pages/OtherWaysPage';
import PaymentPage from './components/pages/PaymentPage';
import StPaymentErrorPage from './components/pages/StPaymentErrorPage';
// import SupportPage from './components/pages/SupportPage';
import ThankYouPage from './components/pages/ThankYouPage';
import ThankYouForZakat from './components/pages/ThankYouForZakat';
import ThankYouForSadaqah from './components/pages/ThankYouForSadaqah';
import { paths } from './utils/GlobalVars';


const routes = [
  {
    name: 'calculator',
    path: paths.calculator,
    components: {
      center: CalculatorPage,
      right: ProgressContainer,
    },
    meta: {
      prev: '',
      next: paths.donation,
    },
  },
  {
    name: 'donation',
    path: paths.donation,
    components: {
      left: BackBtnContainer,
      center: DonationPage,
      right: DonationSideBarContainer,
    },
    meta: {
      prev: paths.calculator,
      next: paths.support,
      scrollTo: 'filter-section',
    },
  },
  {
    name: 'support',
    path: paths.support,
    components: {
      left: BackBtnContainer,
      center: DonationPage,
      right: DonationSideBarContainer,
    },
    meta: {
      prev: paths.calculator,
      next: paths.payment,
    },
  },
  {
    name: 'support',
    path: paths.energy,
    components: {
      left: BackBtnContainer,
      center: DonationPage,
      right: DonationSideBarContainer,
    },
    meta: {
      prev: paths.calculator,
      next: paths.payment,
    },
  },
  {
    name: 'payment',
    path: paths.payment,
    components: {
      left: BackBtnContainer,
      center: PaymentPage,
      right: DonationSideBarContainer,
    },
    meta: {
      prev: paths.support,
      next: '',
    },
  },
  {
    name: 'orderComplete',
    path: paths.orderComplete,
    components: {
      center: OrderCompletePage,
    },
  },
  {
    name: 'thankyou',
    path: paths.thankYou,
    components: {
      center: ThankYouPage,
      right: ThankYouSideBarContainer,
    },
    meta: {
      prev: paths.support,
      next: '',
    },
  },
  {
    name: 'thankyouzakat',
    path: paths.thankYouZakat,
    components: {
      center: ThankYouForZakat,
      right: ThankYouSideBarContainer,
    },
    meta: {
      prev: paths.support,
      next: '',
    },
  },
  {
    name: 'thankyousadaqah',
    path: paths.thankYouSadaqah,
    components: {
      center: ThankYouForSadaqah,
      right: ThankYouSideBarContainer,
    },
    meta: {
      prev: paths.support,
      next: '',
    },
  },
  {
    name: 'other-ways',
    path: paths.otherWays,
    components: {
      left: BackBtnContainer,
      center: OtherWaysPage,
      right: DonationSideBarContainer,
    },
    meta: {
      prev: '',
      next: '',
    },
  },
  {
    name: 'direct-debit-guarantee',
    path: paths.directDebitGuarantee,
    components: {
      left: BackBtnContainer,
      center: DirectDebitGuarantee,
      right: DonationSideBarContainer,
    },
    meta: {
      prev: '',
      next: '',
    },
  },
  {
    name: 'st-payment-error',
    path: paths.stPaymentError,
    components: {
      center: StPaymentErrorPage,
    },
    meta: {
      prev: '',
      next: '',
    },
  },
  // { path: 'https://calculator.nationaalzakatfonds.nl/', 
  //   beforeEnter (to) {
  //     window.location = `https://calculator.nationaalzakatfonds.nl/bereken`
  //   }
  // },
  // { path: 'http://localhost:3001/', 
  //   beforeEnter (to) {
  //     window.location = `http://localhost:3001/bereken`
  //   }
  // },
 
  
  // { path: '*', 
  //   beforeEnter (to) {
  //     if(window.location.href !== 'https://secure.zakat-deutschland.de/' && window.location.href !== 'http://localhost:3000/' && window.location.href !== 'http://localhost:3001/' && window.location.href !== 'http://localhost:5000/' && window.location.href !== 'https://calculator.tahiramjad.com/'){
  //       window.location = `${window.location.origin}/404`
  //     }
  //   }
  // }
];

export default routes;
