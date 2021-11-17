<!--
 * @Author: your name
 * @Date: 2021-08-05 11:26:05
 * @LastEditTime: 2021-09-29 11:31:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \VehicleDapWebUI\src\views\homechild\sector.vue
-->
<template>
<div>
    <el-table :data="tableData" ref="sectorTable" @select="sectorClick" :row-key="getRowKeys" :max-height="maxH">
        <el-table-column type="selection" reserve-selection width="30">
        </el-table-column>
        <el-table-column prop="time" label="时间" align="center">
        </el-table-column>
    </el-table>
</div>
</template>

<script>
import {
    getSectorPics,
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
            sectorlayer: [],
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
                this.$refs.sectorTable.clearSelection()
            }
            if (newVal.length == 0 && this.sectorlayer.length > 0) {
                this.sectorlayer.forEach(item => {
                    item.layer.clear()
                })
                this.sectorlayer = []
            } else {
                this.$emit('sendSeleted', this.selecteData)
            }
        }
    },
    methods: {
        //剖面扫描记录点击事件
        sectorClick(val, row) {
            let isTrue = this.sectorlayer.filter(item => {
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
                    this.sectorlayer = val;
                    this.lidarID = row.path;
                    this.sectorScan(row);
                }
            }
        },
        //剖面扫描数据
        sectorScan(row) {
            this.$emit('biginLoading');
            let param = {
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
            getSectorPics(param).then(res => {
                if (res.code == 200) {
                    let obj = res.obj;
                    let object3Dlayer = new AMap.Object3DLayer({
                        opacity: this.paramData.transparency
                    });
                    this.sectorlayer.forEach(item => {
                        if (item.path == this.lidarID) {
                            item.layer = object3Dlayer
                            this.selecteData.push(this.lidarID)
                            this.$emit('sendSeleted', this.selecteData)
                        }
                    })
                    this.map.add(object3Dlayer);
                    const map = this.map;

                    this.map.setZoomAndCenter(this.map.getZoom(), [obj.centerLng, obj.centerLat]);
                    let item = {
                        startLng: obj.sectorStartLng,
                        startLat: obj.sectorStartLat,
                        endLng: obj.sectorEndLng,
                        endLat: obj.sectorEndLat,
                        picBase64: obj.base64
                    }
                    this.oneWall(item, this.map, object3Dlayer, param.highMin, param.highMax);
                    this.loading.close()
                } else {
                    this.$refs.sectorTable.toggleRowSelection(row, false);
                    this.loading.close();
                    this.$message({
                        type: 'waring',
                        message: '请求失败，请重试'
                    })
                }
            })
        },
        //单张走航图
        oneWall(item, map, object3Dlayer, minHeigh, maxHeight) {
            let wall = new AMap.Object3D.Mesh()
            let geometry = wall.geometry;
            let lnglat1 = new AMap.LngLat(item.startLng, item.startLat)
            let lnglat2 = new AMap.LngLat(item.endLng, item.endLat)
            let v0xy = map.lngLatToGeodeticCoord(lnglat1);
            let v1xy = map.lngLatToGeodeticCoord(lnglat2);
            geometry.vertices.push(v0xy.x, v0xy.y, -minHeigh);
            geometry.vertices.push(v1xy.x, v1xy.y, -minHeigh);
            geometry.vertices.push(v1xy.x, v1xy.y, -maxHeight);
            geometry.vertices.push(v0xy.x, v0xy.y, -maxHeight);

            geometry.faces.push(0, 1, 3)
            geometry.faces.push(1, 2, 3)

            this.reportImgUrl(item.picBase64, 1024, 512).then(canvasToUrl => {
                wall.backOrFront = 'both';
                wall.transparent = true;
                wall.textures.push(canvasToUrl);
                // console.log(wall.textureIndices)
                geometry.vertexUVs.push(0, 1);
                geometry.vertexUVs.push(1, 1);
                geometry.vertexUVs.push(1, 0);
                geometry.vertexUVs.push(0, 0);

                wall.needUpdate = true;
                wall.reDraw();
                object3Dlayer.add(wall);
                // this.map.on('mousemove', this.wallClick);
            })

        },
        // //绑定地图事件
        // wallClick(ev) {
        //     this.sectorlayer.forEach(item => {
        //         let pixel = ev.pixel;
        //         let px = new AMap.Pixel(pixel.x, pixel.y);
        //         let obj = this.map.getObject3DByContainerPos(px, [item.layer], false) || {};
        //         if (Object.keys(obj).length > 0) {
        //             // 选中的 face 所在的索引
        //             let index = obj.index;
        //             // 选中的 object3D 对象，这里为当前 Mesh
        //             let object = obj.object;
        //             // 被拾取到的对象和拾取射线的交叉点的3D坐标
        //             let point = obj.point;
        //             // 交叉点距透视原点的距离
        //             let distance = obj.distance;
        //             // console.log(point[2])
        //         }
        //     })
        // },
        removeLayer() {
            this.sectorlayer.forEach(item => {
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
