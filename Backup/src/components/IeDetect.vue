<template>
    <div class="fixed top-0 w-full h-auto bg-red-100 text-white p-8 text-center" style="z-index: 100000" v-if="browserName">
       <span class="font-book">WARNING:</span> This site is not compatible with Internet Explorer
        <br>
        <br>

        Please use <a href="https://www.mozilla.org/en-GB/firefox/new/" target="_blank" class="underline">Firefox</a> or <a href="https://www.google.com/intl/en_uk/chrome/" target="_blank" class="underline" >Google Chrome</a>
    </div>
</template>

<script>
    import { detect } from 'detect-browser';

    export default {
        name: "IeDetect",
        data(){
            return {
                browserName:''
            }
        },
        mounted(){
            const browser = detect();

            if (browser.name == 'ie') {
                console.log(browser.name);

                this.browserName = browser.name;
            } else {
                this.browserName = '';
            }
        }
    }
</script>

<style scoped>

</style>
