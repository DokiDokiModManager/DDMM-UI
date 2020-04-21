<template>
    <div>
        <h1>Featured Mods</h1>

        <div v-for="mod in mods" class="mod">
            <h3><strong>{{mod.name}}</strong> - {{mod.author}}</h3>
            <p>{{mod.description}}</p>
            <br>
            <button class="primary" @click="startDownload(mod.url, mod.filename)" :disabled="hasModAlready(mod.filename)"><i class="fas fa-download fa-fw"></i> Download</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "FeaturedModsSection",
        data() {
            return {
                mods: [],
                clickedDownloads: []
            }
        },
        methods: {
            startDownload(url, filename) {
                this.clickedDownloads.push(filename);
                ddmm.downloads.startDownload(url, filename);
            },
            hasModAlready(filename) {
                return (this.clickedDownloads.indexOf(filename) !== -1) || (this.$store.state.game_data.mods.indexOf(filename) !== -1) || (this.$store.state.downloads.find(dl => dl.filename === filename));
            }
        },
        mounted() {
            fetch("https://raw.githubusercontent.com/DokiDokiModManager/FeaturedMods/master/mods.json")
                .then(res => res.json())
                .then(mods => { this.mods = mods });
        }
    }
</script>

<style scoped>

</style>
