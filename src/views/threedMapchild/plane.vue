<!--
 * @Author: your name
 * @Date: 2021-08-04 15:45:29
 * @LastEditTime: 2021-09-26 09:51:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \VehicleDapWebUI\src\views\homechild\plane.vue
-->
<template>
<div>
    <el-table :data="tableData" ref="planeTable" @select="scanClick" :row-key="getRowKeys" :max-height="maxH">
        <el-table-column type="selection" reserve-selection width="30">
        </el-table-column>
        <el-table-column prop="time" label="时间" align="center">
        </el-table-column>
    </el-table>
</div>
</template>

<script>
import {
    getPlanPics,
    // getfixedPlanescan,
} from '@/api/index'
export default {
    props: {
        tableData: Array,
        maxHeight: Number,
        paramData: Object,
        map: Object,
        // reportImgUrl: Function,
        loading: Object,
        selecteData: Array,
        isClear: Boolean
    },
    data() {
        return {
            //平面3d图层实例
            planeLayer: [],
            lidarID: null,
            getRowKeys(row) {
                return row.path;
            }
        }
    },
    computed: {
        maxH() {
            return this.maxHeight - 40
        }
    },
    watch: {
        selecteData(newVal, oldVal) {
            if (newVal.length == 0) {
                this.$refs.planeTable.clearSelection()
            }
            if (newVal.length == 0 && this.planeLayer.length > 0) {
                this.planeLayer.forEach(item => {
                    this.map.remove(item.layer)
                })
                this.planeLayer = [];
            } else {
                this.$emit('sendSeleted', this.selecteData)
            }
        }
    },
    methods: {
        //平面扫描记录点击事件
        scanClick(val, row) {

            let isTrue = this.planeLayer.filter(item => {
                if (item.layer == row.layer && item.layer) {
                    this.map.remove(item.layer)
                    this.$delete(row, 'layer')
                    this.selecteData.forEach((ele, index) => {
                        if (ele == row.path) {
                            this.selecteData.slice(index, 1)
                            this.$emit('sendSeleted', this.selecteData)
                        }
                    })
                    return true
                }
            })
            if (val.length > 0) {
                if (isTrue.length == 0) {
                    this.planeLayer = val;
                    this.lidarID = row.path;
                    this.planeScan(row);
                }
            }

        },
        //平面扫描数据
        planeScan(row) {
            this.$emit('biginLoading');
            let param = this.paramData;
            param.lidarID = this.lidarID;
            param.groundResolution = this.map.getZoom() > 14 ? 8.212516097744487 : this.map.getResolution(this.map.getCenter())

            getPlanPics(param).then(res => {
                if (res.code == 200) {
                    let circle = new AMap.Circle({
                        center: new AMap.LngLat(res.obj.centerLng, res.obj.centerLat), // 圆心位置
                        radius: param.highMax, // 圆半径
                        strokeWeight: 1, // 描边宽度
                    });
                    let bounds = circle.getBounds();
                    this.map.setZoomAndCenter(this.map.getZoom(), [res.obj.centerLng, res.obj.centerLat]);
                    let canvasToUrl = 'data:image/png;base64,' + res.obj.base64;
                    let layer = new AMap.ImageLayer({
                        url: canvasToUrl,
                        bounds: bounds,
                        opacity: this.paramData.transparency
                    })
                    this.map.add(layer)
                    this.planeLayer.forEach(item => {
                        if (item.path == this.lidarID) {
                            item.layer = layer
                            this.selecteData.push(this.lidarID)
                            this.$emit('sendSeleted', this.selecteData)
                        }
                    })
                    this.loading.close()
                } else {
                    this.$refs.planeTable.toggleRowSelection(row, false);
                    this.loading.close();
                    this.$message({
                        type: 'waring',
                        message: '请求失败，请重试'
                    })
                }
            })
        },
        removeLayer() {
            this.planeLayer.forEach(item => {
                this.map.remove(item.layer)
            })
        }
    },
    beforeDestroy() {
        if (this.selecteData.length == 0) {
            this.removeLayer()
        }
    }
}
</script>
