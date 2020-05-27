<template>
    <div>
        <h1>{{_("renderer.tab_options.section_backgrounds.title")}}</h1>
        <p>{{_("renderer.tab_options.section_backgrounds.subtitle")}}</p>

        <br>

        <div class="screenshots">
            <LazyLoadedImage v-for="img in backgrounds" :alt="img" :src="'src/renderer/images/backgrounds/' + img" width="150"
                             @click.native="setBackground(img)"></LazyLoadedImage>
        </div>

        <br>

        <p>
            <button class="success" @click="chooseBackground"><i class="fas fa-image fa-fw"></i>
                {{_("renderer.tab_options.section_backgrounds.button_custom")}}
            </button>

            <button class="danger" @click="setBackground('none')"><i class="fas fa-times fa-fw"></i>
                {{_("renderer.tab_options.section_backgrounds.button_none")}}
            </button>
        </p>

        <br>

        <p>
            <label><input type="checkbox" v-model="modbg_interim" @change="setModBackgrounds(modbg_interim)"> {{_("renderer.tab_options.section_backgrounds.checkbox_modbg")}}</label>
        </p>

        <br>

        <p>{{_("renderer.tab_options.section_backgrounds.description_credit")}}</p>

        <br>

        <p>{{_("renderer.tab_options.section_backgrounds.description_custom")}}</p>
    </div>
</template>

<script>
    import LazyLoadedImage from "../../elements/LazyLoadedImage";
    export default {
        name: "BackgroundOptions",
        components: {LazyLoadedImage},
        methods: {
            _: ddmm.translate,
            setBackground(background) {
                this.$store.commit("set_background", background);
            },
            setModBackgrounds(modBackgrounds) {
                ddmm.config.saveConfigValue("modBackgrounds", modBackgrounds);
            },
            chooseBackground() {
                const el = document.createElement("input");
                el.type = "file";
                el.accept = "image/*";
                el.onchange = () => {
                    console.log(el.files[0]);
                    this.$store.commit("set_background", "custom:" + el.files[0].path);
                };
                el.click();
            }
        },
        data() {
            return {
                backgrounds: ddmm.app.getBackgrounds(),
                modbg_interim: ddmm.config.readConfigValue("modBackgrounds")
            }
        }
    }
</script>

<style scoped>

</style>
