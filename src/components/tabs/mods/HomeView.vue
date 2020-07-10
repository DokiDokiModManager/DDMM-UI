<template>
    <div class="main-content">
        <h1>Home</h1>
        <br>
        <div>
            <h2>Continue Playing</h2>
            <h3>{{lastInstall.name}}</h3>
            <br>
            <p><button class="success"><i class="fas fa-play fa-fw"></i> Play</button></p>
        </div>
        <br>
        <h2>Your Library</h2>
        <template v-for="category in categories">
            <h3>{{category || _("renderer.tab_mods.list.header_installed")}}</h3>
            <div class="library-view">
                <div class="library-install"
                     v-for="install in installs.filter(install => install.category === category)"
                     @click="handleInstallClick(install.folderName)">
                    <div class="library-install-content">
                        <LazyLoadedImage :src="'D:\\DDMM\\DDMM\\installs\\ddlc\\ddmm-poster.png'"></LazyLoadedImage>
                    </div>
                    <div class="library-install-content text">
                        <p><strong>{{install.name}}</strong></p>
                        <!--                    <p>bruh</p>-->
                        <br>
                        <p>
                            <button class="success" @click.stop="launchInstall(install)"><i class="fas fa-play"></i>
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    import LazyLoadedImage from "../../elements/LazyLoadedImage";
    import Logger from "../../../js/utils/Logger";
    import Launcher from "../../../js/utils/Launcher";

    export default {
        name: "HomeView",
        components: {LazyLoadedImage},
        computed: {
            installs() {
                return this.$store.state.game_data.installs;
            },
            categories() {
                return this.$store.getters.install_categories;
            },
            lastInstall() {
                const lastInstall = ddmm.config.readConfigValue("lastLaunchedInstall");
                return this.installs.find(install => install.folderName === lastInstall);
            }
        },
        methods: {
            _: ddmm.translate,
            handleInstallClick(folderName) {
                Logger.info("Mod List", "Selected install " + folderName);
                this.$store.commit("install_list_selection", {
                    type: "install",
                    id: folderName
                });
            },

            launchInstall(install) {
                Launcher.launch(install, this.$store);
            }
        }
    }
</script>

<style scoped>
    .library-view {
        display: flex;
        flex-wrap: wrap;
    }

    .library-install {
        width: 150px;
        height: 225px;
        cursor: pointer;
        margin: 1em;
        position: relative;
    }

    @media screen and (max-width: 1280px) {
        .library-install {
            width: 100px;
            height: 150px;
        }

        .library-install button {
            font-size: 0.75em;
        }
    }

    .library-install-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .library-install-content.text {
        background: rgba(0, 0, 0, 0.75);
        text-align: center;
        padding: 0.5em 0.25em;
        opacity: 0;
        transition: opacity 0.5s;
    }

    .library-install-content.text:hover {
        opacity: 1;
    }

    img {
        width: 100%;
        height: 100%;
    }
</style>
