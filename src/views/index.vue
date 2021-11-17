<!--
 * @Author: your name
 * @Date: 2021-04-27 09:13:00
 * @LastEditTime: 2021-10-11 09:09:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MoveDapWebUi\src\views\index.vue
-->
<template>
<div class="amapWindow">
    <div class="topRight">
        <el-button type="text" @click="modeChange" :icon="valueMode == '2D'?'el-icon-image-realtime':'el-icon-image-history'" size="mini">{{valueMode == '2D'?'实时模式':'历史模式'}}</el-button>
        <el-dropdown style="margin: 0 10px;background:rgba(44,44,44,0.9);padding:4px 0px;border-radius:3px;margin-right:0;">
            <span class="el-dropdown-link" style="color:white"><i class="el-icon-image-layer"></i>图层<i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown" style="background:rgba(44,44,44,0.9);color: white;border:none">
                <el-dropdown-item command="station" style="color:white" v-if="valueMode == '2D'">
                    <el-checkbox v-model="stationLayer" @change="stationChange" size="mini" style="color:white;">国控点</el-checkbox>
                </el-dropdown-item>
                <el-dropdown-item command="source" style="color:white">
                    <el-checkbox v-model="sourceLayer" size="mini" style="color:white;">污染源</el-checkbox>
                </el-dropdown-item>
                <el-dropdown-item command="road" style="color:white" v-if="command == 'satellite'">
                    <el-checkbox v-model="roadLayer" size="mini" style="color:white;" @change="roadChage">路网</el-checkbox>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown @command="handleMap" style="margin: 0 10px;background:rgba(44,44,44,0.9);padding:4px 0px;border-radius:3px">
            <span class="el-dropdown-link" style="color:white"><i class="el-icon-image-map"></i>{{mapType}}<i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown" style="background:rgba(44,44,44,0.9);border:none">
                <el-dropdown-item command="satellite" :style="command == 'satellite'?'background: #1890ff;color: white;':'color: white;'">卫星地图</el-dropdown-item>
                <el-dropdown-item command="standard" :style="command == 'standard'?'background: #1890ff;color: white;':'color: white;'">标准地图</el-dropdown-item>
                <el-dropdown-item command="dark" :style="command == 'dark'?'background: #1890ff;color: white;':'color: white;'">深色地图</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-button type="text" @click="modeChange('3D')">最新走航</el-button> -->
        <el-button type="text" icon="el-icon-image-carselect" @click="carSelect" size="mini">车辆选择</el-button>
    </div>
    <plane-map v-if="valueMode == '2D'" ref="planeMap" />
    <threed-map v-else ref="threedMap" />
</div>
</template>

<script>
import PlaneMap from './homeChilde/PlaneMap/index';
import ThreedMap from './homeChilde/ThreedMap/index';
import '@/assets/styles/icon.css';
export default {
    name: "index",
    components: {
        PlaneMap,
        ThreedMap,
    },
    data() {
        return {
            //地图模式
            valueMode: '2D',

            mapType: '卫星地图',
            data: [],
            //地图主题
            command: 'satellite',
            //站点标注图层
            stationLayer: true,
            //污染源图层
            sourceLayer: false,
            roadLayer: true,
            loading: null,
        };
    },
    created() {
        // this.loadingFun('.amapWindow');
    },
    methods: {
        //二维三维地图切换
        modeChange(val) {
            this.mapType = '卫星地图';
            this.command = 'satellite';
            this.roadLayer = true;
            if (val == '3D') {
                this.valueMode = val;
                this.$nextTick(() => {
                    this.$refs.threedMap.mapLoad(true);
                })
                return
            } else {
                if (this.valueMode == '2D') {
                    this.valueMode = '3D';
                    this.$nextTick(() => {
                        this.$refs.threedMap.mapLoad(true);
                    })
                    return
                } else {
                    this.valueMode = '2D';
                    this.$nextTick(() => {
                        this.$refs.planeMap.mapLoad(true);
                    })
                    return
                }
            }
        },
        //地图主题更改
        handleMap(command) {
            this.command = command;
            if (this.valueMode == '2D') {
                this.$refs.planeMap.changeMaptype(command)
                if (command == 'satellite') {
                    this.mapType = '卫星地图';
                    this.roadLayer = true;
                } else if (command == 'standard') {
                    this.mapType = '标准地图'
                } else {
                    this.mapType = '深色地图'
                }
            } else {
                this.$refs.threedMap.changeMaptype(command)
                if (command == 'satellite') {
                    this.mapType = '卫星地图';
                    this.roadLayer = true;
                } else if (command == 'standard') {
                    this.mapType = '标准地图'
                } else {
                    this.mapType = '深色地图'
                }
            }
        },
        //国控点的显示与隐藏
        stationChange(checked) {
            if (checked) {
                this.$refs.planeMap.markerShow()
            } else {
                this.$refs.planeMap.markerHide()
            }

        },
        //路网图层
        roadChage(checked) {
            if (checked) {
                if (this.valueMode == '3D') {
                    this.$refs.threedMap.map.setFeatures(['point']);
                    this.$refs.threedMap.roadNet.show();
                } else {
                    this.$refs.planeMap.map.setFeatures(['point']);
                    this.$refs.planeMap.roadNet.show();
                }
            } else {
                if (this.valueMode == '3D') {
                    this.$refs.threedMap.map.setFeatures([]);
                    this.$refs.threedMap.roadNet.hide();
                } else {
                    this.$refs.planeMap.map.setFeatures([]);
                    this.$refs.planeMap.roadNet.hide();
                }
            }
        },
        //车辆选择
        carSelect() {
            if (this.valueMode != '3D') {
                this.modeChange('3D');
            }
            this.$nextTick(() => {
                this.$refs.threedMap.carSelect()
            })
        },
        //loading效果
        loadingFun(target) {
            this.loading = this.$loading({
                target: document.querySelector(target),
                lock: true,
                text: '正在加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
        },

    },
    mounted() {
        // let dowItem = document.querySelector('.el-dropdown-menu__item')
        // this.loading.close()
        this.$refs.planeMap.mapLoad()
    },
    beforeDestroy() {

    },
};
</script>

<style lang="scss">
.amapWindow {

    height: calc(100vh - 50px);
    position: relative;

    .BMap_cpyCtrl.BMap_noprint.anchorBL,
    .BMap_cpyCtrl.anchorBL {
        display: none;
    }

    .topRight {
        position: fixed;
        z-index: 9;
        top: 60px;
        right: 5px;
        // padding: 0px 10px;

        .el-dropdown-link {
            cursor: pointer;
            color: #1890ff;
            font-size: 12px;
            margin: 0 10px;
        }

        .el-popper[x-placement^=bottom] .popper__arrow::after {
            border-top-color: #000;
            opacity: 0.7;
        }

        .el-button {
            background-color: rgba(44, 44, 44, 0.9);
            padding: 5px 10px;
            // opacity: 0.8;
            color: white;
        }
    }

    .otherList {
        position: fixed;
        right: 10px;
        top: 180px;
        z-index: 9;

        .el-button {
            width: 100%;
            margin-left: 0;
        }
    }

}

.el-dropdown-menu__item:not(.is-disabled):hover,
.el-dropdown-menu__item:focus {
    background: none;
    color: #04fc94 !important;
}
</style>
