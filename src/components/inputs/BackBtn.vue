<template>
    <div>
        <div v-if="primary">

            <btn @click="goBack" class="-active">
                <slot></slot>
            </btn>

        </div>
        <div v-else class="back-btn md:bg-white md:rounded-lg md:border border-red-300 cursor-pointer">
            <a class="text-bold md:py-3 block md:text-center text-base leading-none font-semibold"
               @click="goBack">

                <slot></slot>

            </a>
        </div>
    </div>
</template>

<script>
    import Btn from './Btn';
    import { paths } from '../../utils/GlobalVars';
    import { mapState } from 'vuex';

    export default {
        name: "BackBtn",
        props:['primary'],
        components: { Btn },
        methods: {
            goBack() {
                let prev;
                console.log(this.$route.meta);
                if(this.$route.name == 'other-ways' || this.$route.name == 'direct-debit-guarantee'){
                    prev = localStorage.getItem('last-route') !== '/' ? localStorage.getItem('last-route') : paths.calculator;
                } else {
                    let checkPrev = localStorage.getItem('last-route');
                    if(checkPrev == '/geef-zakat' || checkPrev == '/geef-sadaqah'){
                        prev = localStorage.getItem('last-route');
                    }else{
                        prev = this.$route.meta.prev;

                    }
                }

                //if there is a previous route go to it, otherwise go '/'
                (prev.length) ? this.$router.push({path: prev, hash: this.hash}) : this.$router.push('/');
            }
        },
        computed: {
            ...mapState({
                hash: state => state.transitions.backHash
            })
        }
    }
</script>

<style scoped>
    .back-btn {
        max-width: 120px;
        border-radius: 50px;
    }
</style>
