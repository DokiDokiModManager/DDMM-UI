<template>
    <div>
        <h1>{{_("renderer.tab_options.section_language.title")}}</h1>
        <p>{{_("renderer.tab_options.section_language.subtitle")}}</p>
        <br>
        <p>
            <Link to="https://example.org">{{_("renderer.tab_options.section_language.link_contribute")}}</Link>
        </p>
        <br>
        <p><label>{{_("renderer.tab_options.section_language.label_language")}}</label></p>
        <p>
            <select v-model="language_interim" @change="setLanguage">
                <option v-for="language in languages" :value="language.code">
                    {{language.name}}
                </option>
            </select>
        </p>
    </div>
</template>

<script>
    import languages from "../../../../data/languages";
    import Link from "../../elements/Link";
    import Vue from "vue";

    export default {
        name: "LanguageOptions",
        components: {Link},
        methods: {
            _: ddmm.translate,
            setLanguage() {
                ddmm.config.saveConfigValue("language", this.language_interim);
                ddmm.reloadLanguages();
                window.location.reload();
            }
        },
        data() {
            return {
                language_interim: ddmm.config.readConfigValue("language"),
                languages: languages.languages
            }
        }
    }
</script>

<style scoped>

</style>