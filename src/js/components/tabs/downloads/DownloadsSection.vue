<template>
    <div>
        <h1>{{_("renderer.tab_downloads.downloads.title")}}</h1>

        <div class="mod" v-for="download in downloads">
            <h3>{{download.filename}}</h3>
            <template v-if="download.total === 0">
                <p>{{_("renderer.tab_downloads.downloads.status_text_downloading_uncertain",
                    bytesToMB(download.downloaded), downloadSpeed(download.downloaded, download.startTime))}}</p>
                <br>
                <div class="progress uncertain">
                    <div class="bar"></div>
                </div>
            </template>
            <template v-else>
                <p>{{_("renderer.tab_downloads.downloads.status_text_downloading", percentage(download.downloaded,
                    download.total), downloadSpeed(download.downloaded, download.startTime), eta(download.downloaded,
                    download.total, download.startTime))}}</p>
                <br>
                <div class="progress">
                    <div class="bar"></div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DownloadsSection",
        methods: {
            _: ddmm.translate,
            percentage(downloaded, total) {
                return Math.floor((downloaded / total) * 100) || 0;
            },
            downloadSpeed(downloaded, startTime) {
                const currentTime = Date.now();
                const dlDuration = Math.floor((currentTime - startTime) / 1000);
                const downloadedMB = downloaded / 1e6;
                const speedRaw = downloadedMB / dlDuration;
                return (Math.floor(speedRaw * 10) / 10) || 0;
            },
            bytesToMB(bytes) {
                return Math.floor(bytes / 1e7) / 10;
            },
            eta(downloaded, total, startTime) {
                const speed = this.downloadSpeed(downloaded, startTime) * 1e6;
                const remaining = total - downloaded;
                const seconds = remaining / speed;
                let timeStr = new Date(seconds * 1000).toISOString().substr(11, 8);
                if (seconds < 36e5) {
                    timeStr = timeStr.substr(3);
                }
                return timeStr;
            }
        },
        data() {
            return {
                downloads: [
                    {
                        filename: "test-download.zip",
                        downloaded: 1e7,
                        total: 5e8,
                        startTime: Date.now() - 10000
                    },
                    {
                        filename: "uncertain-download.zip",
                        downloaded: 1e7,
                        total: 0,
                        startTime: Date.now() - 10000
                    }
                ]
            }
        }
    }
</script>

<style scoped>

</style>
