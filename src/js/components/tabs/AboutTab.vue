<template>
    <div class="page-content">
        <div class="text-container">
            <h1>{{_("renderer.tab_about.title")}}</h1>
            <p>{{_("renderer.tab_about.description")}}</p>

            <br>

            <h2>{{_("renderer.tab_about.title_socials")}}</h2>
            <p>
                <Link to="https://doki.space/discord"><i class="fab fa-discord fa-fw"></i>
                    {{_("renderer.tab_about.social_discord")}}
                </Link>
            </p>
            <p>
                <Link to="https://www.reddit.com/message/compose?to=zuudo"><i class="fab fa-reddit fa-fw"></i>
                    {{_("renderer.tab_about.social_reddit")}}
                </Link>
            </p>
            <p>
                <Link to="mailto:zudo@doki.space"><i class="fas fa-envelope fa-fw"></i>
                    {{_("renderer.tab_about.social_email")}}
                </Link>
            </p>

            <br>

            <template v-if="translators.length > 0">
                <h2>{{_("renderer.tab_about.title_translators")}}</h2>
                <ul>
                    <li v-for="translator in translators">
                        <strong>{{translator.name}}</strong> - {{translator.language}}
                    </li>
                </ul>
                <br>
                <p>
                    <Link to="https://hosted.weblate.org/engage/doki-doki-mod-manager/">
                        <i class="fas fa-globe"></i>
                        {{_("renderer.tab_about.link_weblate")}}
                    </Link>
                </p>
            </template>

            <br>

            <h2>{{_("renderer.tab_about.title_disclaimer")}}</h2>
            <p>{{_("renderer.tab_about.disclaimer_1")}}</p>
            <br>
            <p>{{_("renderer.tab_about.disclaimer_2")}}</p>
        </div>
    </div>
</template>

<script>
    import Link from "../elements/Link.vue";

    const THANKS_URL = "https://dokidokimodmanager.github.io/Meta/thanks.json";

    export default {
        name: "AboutTab",
        components: {Link},
        data() {
            return {
                supporters: [],
                translators: []
            }
        },
        methods: {
            _: ddmm.translate
        },
        mounted() {
            fetch(THANKS_URL).then(res => res.json()).then(thanks => {
                this.supporters = thanks.patreon;
                this.translators = thanks.translations;
            });
        }
    }
</script>

<style scoped>

</style>
