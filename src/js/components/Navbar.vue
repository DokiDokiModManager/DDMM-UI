<template>
    <div class="navbar">
        <div class="nav-links">
            <div v-for="t in tabs" :class="{'active': t.component === tab}" @click="setTab(t)">{{t.name()}}</div>
        </div>
    </div>
</template>

<script>
    import Logger from "../utils/Logger";

    export default {
        name: "Navbar",
        props: ["tabs"],
        computed: {
            tab() {
                return this.$store.state.tab;
            }
        },
        methods: {
            setTab: function (t) {
                gtag("event", "screen_view", {
                    "screen_name": t.id
                });
                Logger.info("Navbar", "Navigated to tab " + t.component);
                this.$store.commit("set_tab", t.component);
            }
        }
    }
</script>

<style scoped>

</style>
