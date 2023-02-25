<template>
    <scroll-container id="top">
        <div class="pt-32 pb-10 px-4 lg:px-0"  style="z-index: 30" >

            <h1 class="header-2 header mb-8">{{ page.title }}</h1>

<!--Change text-xs to text-lg -->
            <div class="mb-4 text-sm" v-html="page.content">

            </div>

            <back-btn :primary="true">
                Back
            </back-btn>

        </div>
    </scroll-container>
</template>

<script>
    import ScrollContainer from '../scroll/ScrollContainer';
    import BackBtn from '../inputs/BackBtn';

    export default {
        name: "PaymentPage",
        components: {
            ScrollContainer,
            BackBtn
        },
        computed:{
            page(){
                return this.$store.state.pages.orderWaysToGive;
            }
        },
        mounted(){
            window.scrollTo(0, 0);
            this.$store.dispatch('fetchWaysToGivePage');
        }
    }
</script>
