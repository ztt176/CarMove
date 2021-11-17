<!--
 * @Author: your name
 * @Date: 2021-08-05 11:30:11
 * @LastEditTime: 2021-09-24 11:16:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \VehicleDapWebUI\src\views\homechild\cone.vue
-->
<template>
<div>
    <el-table :data="tableData" ref="coneTable" @select="coneClick" :row-key="getRowKeys" :max-height="maxH">
        <el-table-column type="selection" reserve-selection width="30">
        </el-table-column>
        <el-table-column prop="time" label="时间" align="center">
        </el-table-column>
    </el-table>
</div>
</template>

<script>
import {
    getConePics
} from '@/api/index'
export default {
    props: {
        tableData: Array,
        maxHeight: Number,
        paramData: Object,
        map: Object,
        reportImgUrl: Function,
        loading: Object,
        selecteData: Array
    },
    data() {
        return {
            //平面3d图层实例
            conelayer: [],
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
                this.$refs.coneTable.clearSelection()
            }
            if (newVal.length == 0 && this.conelayer.length > 0) {
                this.conelayer.forEach(item => {
                    item.layer.clear()
                })
                this.conelayer = []
            } else {
                this.$emit('sendSeleted', this.selecteData)
            }
        }
    },
    methods: {
        //锥体扫描记录点击事件
        coneClick(val, row) {
            let isTrue = this.conelayer.filter(item => {
                if (item.layer == row.layer && item.layer) {
                    item.layer.clear();
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
                    this.conelayer = val;
                    this.lidarID = row.path;
                    this.coneScan(row);
                }
            }
        },
        //锥体扫描数据
        coneScan(row) {
            this.$emit('biginLoading');
            let paramMap = {
                distancePos: this.paramData.distancePos,
                dmax: this.paramData.dmax,
                dmin: this.paramData.dmin,
                lidarID: this.lidarID,
                groundResolution: this.map.getZoom() > 14 ? 8.212516097744487 : this.map.getResolution(this.map.getCenter()),
                factorname: this.paramData.factorname,
                highMin: this.paramData.highMin,
                highMax: this.paramData.highMax,
                pblFlag: this.paramData.pblFlag,
                fixFlag: this.paramData.fixFlag
            }
            let object3Dlayer = new AMap.Object3DLayer({
                opacity: this.paramData.transparency
            });

            this.map.add(object3Dlayer);

            getConePics(paramMap).then(res => {
                if (res.code == 200) {
                    let obj = res.obj
                    this.map.setZoomAndCenter(this.map.getZoom(), [obj.conicalList[0].lng1, obj.conicalList[0].lat1]);
                    var x1y1 = null;
                    var x2y2 = null;
                    var x3y3 = null;
                    var x4y4 = null;
                    obj.conicalList.forEach((ele, index) => {
                        x1y1 = new AMap.LngLat(ele.lng1, ele.lat1)
                        x1y1 = this.map.lngLatToGeodeticCoord(x1y1)
                        x2y2 = new AMap.LngLat(ele.lng2, ele.lat2)
                        x2y2 = this.map.lngLatToGeodeticCoord(x2y2)
                        x3y3 = new AMap.LngLat(ele.lng3, ele.lat3)
                        x3y3 = this.map.lngLatToGeodeticCoord(x3y3)
                        x4y4 = new AMap.LngLat(ele.lng4, ele.lat4)
                        x4y4 = this.map.lngLatToGeodeticCoord(x4y4)
                        this.drawCone(obj.highMax, x1y1, x2y2, x3y3, x4y4, ele.base64, object3Dlayer) //圆锥
                    });
                    this.conelayer.forEach(item => {
                        if (item.path == this.lidarID) {
                            item.layer = object3Dlayer
                            this.selecteData.push(this.lidarID)
                            this.$emit('sendSeleted', this.selecteData)
                        }
                    })
                    this.loading.close()
                } else {
                    this.$refs.coneTable.toggleRowSelection(row, false);
                    this.loading.close();
                    this.$message({
                        type: 'waring',
                        message: '请求失败，请重试'
                    })
                }
            })
        },
        //绘制圆锥
        drawCone(height, x1y1, x2y2, x3y3, x4y4, base64, object3Dlayer) {

            let cylinder = new AMap.Object3D.Mesh();
            let geometry = cylinder.geometry;

            let z = -height
            geometry.vertices.push(x1y1.x, x1y1.y, z)
            geometry.vertices.push(x2y2.x, x2y2.y, z)
            geometry.vertices.push(x3y3.x, x3y3.y, 0)
            geometry.vertices.push(x4y4.x, x4y4.y, 0)
            geometry.faces.push(0, 1, 3)
            geometry.faces.push(1, 2, 3)

            this.reportImgUrl(base64, 128, 512).then(canvasToUrl => {
                cylinder.textures.push(canvasToUrl);
                cylinder.backOrFront = 'both';
                cylinder.transparent = true;
                geometry.vertexUVs.push(0, 0);
                geometry.vertexUVs.push(1, 0);
                geometry.vertexUVs.push(0, 1);
                geometry.vertexUVs.push(1, 1);
                cylinder.reDraw();
                object3Dlayer.add(cylinder);
            })

        },
        removeLayer() {
            this.conelayer.forEach(item => {
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
