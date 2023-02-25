<template>
    <div v-if="!show">
        <back-btn>Terug</back-btn>
    </div>
</template>

<script>
    import BackBtn from '../inputs/BackBtn';
    export default {
        name: "BackBtnContainer",
        components: { BackBtn },
        computed:{
            show(){
                if(this.$store.state.mode === 'give'){
                    return this.$route.path === '/donation';
                } else {
                    return false;
                }
            }
        }
    }
</script>

<style scoped>

</style>