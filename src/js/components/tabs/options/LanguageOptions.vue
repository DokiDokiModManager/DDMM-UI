<template>
    <div>
        <h1>{{_("renderer.tab_options.section_language.title")}}</h1>
        <p>{{_("renderer.tab_options.section_language.subtitle")}}</p>
        <br>
        <p><strong>{{_("renderer.tab_options.section_language.description_restart")}}</strong></p>
        <div class="form-group">
            <p><label>{{_("renderer.tab_options.section_language.label_language")}}</label></p>
            <p>
                <select v-model="language_interim" @change="setLanguage">
                    <option v-for="language in languages" :value="language.code">
                        {{language.name}}
                    </option>
                </select>
            </p>
        </div>
    </div>
</template>

<script>
    import languages from "../../../../data/languages";

    export default {
        name: "LanguageOptions",
        methods: {
            _: ddmm.translate,
            setLanguage() {
                this.$store.commit("options", {language: this.language_interim});
            }
        },
        data() {
            return {
                language_interim: this.$store.state.options.language,
                languages: languages.languages
            }
        }
    }
</script>

<style scoped>

</style>