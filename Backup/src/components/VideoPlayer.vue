<template>
    <div class="relative" @mouseleave="hideOverlay" @mousemove="mouseMove">
        <!-- Video needs a place holder image -->
        <video class="w-full "
               ref="video"
               poster="/static/img/video-poster.png"
               src="/static/videos/zakat-small.mp4" playsinline>
        </video>

        <transition name="fade" mode="out-in" duration="100" >
            <div class="z-20 w-full h-full absolute top-0
                 flex justify-center items-center text-white text-5xl  cursor-pointer"
                 @click="play" style="background: rgba(0,0,0, 0.1)"
                 v-if="show">

                <div class="border border-white rounded-full w-20 h-20 flex justify-center items-center">
                    <transition name="fade" mode="out-in" duration="100">
                        <i class="ion-ios-play -mb-5 -mr-1" key="2" v-if="!playing"></i>
                        <i class="ion-ios-pause -mb-5 " key="0" v-else></i>
                    </transition>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import _ from 'lodash';

    export default {
        name: "Video",
        data(){
            return {
                playing: false,
                show: true
            }
        },
        methods: {
            play(){
                let video = this.$refs.video;

                if(video.paused == true) {
                    video.play();
                    this.playing = true;
                } else {
                    this.pause();
                }
            },
            pause(){
                let video = this.$refs.video;
                video.pause();
                this.playing = false;
            },
            showOverlay(){
                this.show = true;
            },
            hideOverlay(){
                this.show = false;
            },
            mouseMove: function(){
                this.show = true;
                this.debounce();
            },
            debounce:  _.debounce(function(){
                this.show = false;
            }, 1500)
        }
    }
</script>

<style scoped>

</style>
