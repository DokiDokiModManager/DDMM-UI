const OnboardingOverlay = Vue.component("ddmm-onboarding", {
    "template": `
    `,
    "data": function () {
        return {
            "online": navigator.onLine,
            "downloading": false,
            "errored": false,
            "percentage": 0,
            "eta": 0,
            "speed": 0,
            "install_folder": ddmm.config.readConfigValue("installFolder")
        }
    },
    "computed": {
        "formattedPercentage": function () {
            return this.percentage + "%";
        }
    },
    "methods": {
        "_": ddmm.translate,
        "_progressCallback": function (progressData) {
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
        "_downloadedCallback": function () {
            this.$emit("close");
        },
        "_stalledCallback": function () {
            this.errored = true;
            this.downloading = false;
        },
        "_onlineCallback": function () {
            this.online = navigator.onLine;
        },
        "download": function () {
            this.downloading = true;
            ddmm.onboarding.downloadGame();
        },
        "open": function () {
            ddmm.onboarding.browseForGame();
        },
        "changeFolder": function () {
            ddmm.app.beginMoveInstall();
        }
    },
    "mounted": function () {

    },
    "destroyed": function () {

    }
});