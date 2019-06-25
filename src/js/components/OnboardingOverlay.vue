<template>
    <div class="cover">
        <h1>{{_("renderer.onboarding.title")}}</h1>
        <p>{{_("renderer.onboarding.description_download")}}</p>
        <br>
        <p><button class="primary" :disabled="!online || downloading" @click="download">{{_("renderer.onboarding.button_download")}}</button> <button class="secondary" :disabled="downloading" @click="open">{{_("renderer.onboarding.button_choose")}}</button></p>
        <br>
        <div v-if="!downloading">{{_("renderer.onboarding.description_location", install_folder)}} <a href="javascript:;" @click="changeFolder">{{_("renderer.onboarding.link_change")}}</a><br><br></div>
        <p>{{_("renderer.onboarding.heading_why")}}</p>
        <div>{{_("renderer.onboarding.description_why")}}</div>
        <br>
        <div>{{_("renderer.onboarding.description_unexpected")}}</div>
        <br>
        <div v-if="downloading && online">
            <div class="progress">
                <div class="bar" :style="{'width': formattedPercentage}"></div>
            </div>
            <br>
            <div>{{_("renderer.onboarding.status_downloading", formattedPercentage, eta, speed)}}</div>
            <br>
        </div>
        <div v-if="!online"><strong>{{_("renderer.onboarding.status_offline")}}</strong><br></div>
        <div v-if="errored"><strong>{{_("renderer.onboarding.status_errored")}}</strong><br></div>
    </div>
</template>

<script>
    export default {
        name: "OnboardingOverlay",

        data() {
            return {
                online: navigator.onLine,
                downloading: false,
                errored: false,
                percentage: 0,
                eta: 0,
                speed: 0,
                install_folder: ddmm.config.readConfigValue("installFolder")
            }
        },

        methods: {
            _: ddmm.translate,
            _progressCallback(progressData) {
                if (progressData.meta !== "ONBOARDING_DOWNLOAD") return;
                if (progressData.total !== 0) {
                    this.percentage = Math.floor((progressData.downloaded / progressData.total) * 100);

                    const elapsedTime = Date.now() / 1000 - progressData.startTime;

                    const etaSeconds = (elapsedTime * (progressData.total / progressData.downloaded)) - elapsedTime;

                    const speed = (progressData.downloaded / 1000000) / elapsedTime;

                    this.speed = Math.floor(speed * 100) / 100;

                    this.eta = (etaSeconds <= 60 ? "about a minute" : Math.floor(etaSeconds / 60) + 1 + " minutes");
                }
            },

            _downloadedCallback() {
                this.$emit("close");
            },

            _stalledCallback() {
                this.errored = true;
                this.downloading = false;
            },
            _onlineCallback() {
                this.online = navigator.onLine;
            },
            download() {
                this.downloading = true;
                ddmm.onboarding.downloadGame();
            },
            open() {
                ddmm.onboarding.browseForGame();
            },
            changeFolder() {
                ddmm.app.beginMoveInstall();
            }
        },

        computed: {
            formattedPercentage(percentage) {
                return percentage + "%";
            }
        },

        mounted() {
            ddmm.on("download progress", this._progressCallback);
            ddmm.on("download stalled", this._stalledCallback);
            ddmm.on("onboarding download failed", this._stalledCallback);
            window.addEventListener("online", this._onlineCallback);
            window.addEventListener("offline", this._onlineCallback);
        },

        destroyed() {
            ddmm.off("download progress", this._progressCallback);
            ddmm.off("download stalled", this._stalledCallback);
            ddmm.off("onboarding download failed", this._stalledCallback);
            window.removeEventListener("online", this._onlineCallback);
            window.removeEventListener("offline", this._onlineCallback);
        }
    }
</script>

<style scoped>

</style>