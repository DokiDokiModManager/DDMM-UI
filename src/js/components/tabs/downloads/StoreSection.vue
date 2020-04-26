<template>
    <div>
        <h1>{{_("renderer.tab_downloads.store.title_ddmc")}}</h1>
        <p>{{_("renderer.tab_downloads.store.description")}}</p>

        <template v-if="!loaded">
            <br>
            <p><i class="fas fa-spinner fa-spin"></i> {{_("renderer.tab_downloads.store.text_loading")}}</p>
        </template>

        <template v-else-if="error">
            <br>
            <p><i class="fas fa-exclamation-triangle"></i> Can't load the mods right now.</p>
        </template>

        <br>


        <div v-for="mod in mods" class="mod" @click="viewMod(mod)">
            <div class="image">
                <img :src="mod.icon" width="75" v-if="mod.icon">
                <img src="../../../../../src/images/logo.png" width="75" v-else>
            </div>
            <div>
                <h3><strong>{{mod.name}}</strong></h3>
                <p>{{mod.shortDescription}}</p>
<!--                <p>{{mod.downloadURL}}</p>-->
                <!--            <br>-->
                <!--            <button class="primary" @click="startDownload(mod.url, mod.filename)" :disabled="hasModAlready(mod.filename)"><i class="fas fa-download fa-fw"></i> Download</button>-->
            </div>
        </div>
    </div>
</template>

<script>
    import DDLCModClub from "../../../stores/DDLCModClub";
    import Logger from "../../../utils/Logger";

    export default {
        name: "StoreSection",
        data() {
            return {
                modStore: new DDLCModClub(),
                loaded: false,
                error: false,
                mods: []
            }
        },
        methods: {
            _: ddmm.translate,
            viewMod(mod) {
                this.$store.commit("preview_mod", mod);
            }
        },
        mounted() {
            this.modStore.getListing(0).then(listing => {
                this.mods = listing.mods;
                this.loaded = true;
            }).catch(err => {
                Logger.error("Mod Store", err.toString());
                this.loaded = true;
                this.error = true;
            });
        }
    }
</script>

<style scoped>

</style>
