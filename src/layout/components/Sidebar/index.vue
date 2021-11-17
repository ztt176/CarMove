<!--
 * @Author: your name
 * @Date: 2021-04-27 09:13:00
 * @LastEditTime: 2021-10-09 16:57:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MoveDapWebUi\src\layout\components\Sidebar\index.vue
-->
<template>
<div :class="{'has-logo':showLogo}" v-if="$route.path!='/index'">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
        <el-menu :default-active="activeMenu" :collapse="isCollapse" background-color="rgba(68, 68, 68, 0)" text-color="#fff" :unique-opened="true" :active-text-color="settings.theme" :collapse-transition="false" mode="vertical">
            <sidebar-item v-for="(route, index) in sidebarRouters" :key="route.path  + index" :item="route" :base-path="route.path" />
        </el-menu>
    </el-scrollbar>
</div>
</template>

<script>
import {
    mapGetters,
    mapState
} from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.scss";

export default {
    components: {
        SidebarItem,
        Logo
    },
    computed: {
        ...mapState(["settings"]),
        ...mapGetters(["sidebarRouters", "sidebar"]),
        activeMenu() {
            const route = this.$route;
            const {
                meta,
                path
            } = route;
            // if set path, the sidebar will highlight the path you set
            if (meta.activeMenu) {
                return meta.activeMenu;
            }
            return path;
        },
        showLogo() {
            return this.$store.state.settings.sidebarLogo;
        },
        variables() {
            return variables;
        },
        isCollapse() {
            return !this.sidebar.opened;
        }
    }
};
</script>
