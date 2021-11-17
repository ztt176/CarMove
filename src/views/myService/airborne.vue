<!--
 * @Author: your name
 * @Date: 2021-09-27 10:36:05
 * @LastEditTime: 2021-10-11 10:38:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MoveDapWebUi\src\views\myService\airborne.vue
-->
<template>
<div>
    <el-row :gutter="20" style="padding:0 5px">
        <el-col :span="12" v-for="(item,index) in recordsList" :key="index" style="margin-bottom:10px">
            <el-row :gutter="10" style="padding:10px;background:rgba(255, 255, 255, 0.1);color:white;border-radius:5px;">
                <el-col :span="18">
                    <div style="font-weight: 600;text-align:left">{{item.name}}</div>
                    <div style="font-size:14px;padding:5px 0;text-align:left"><i class="el-icon-alarm-clock"></i>{{' '+item.beginTime}} ~ {{item.endTime}}</div>
                    <div style="font-size:12px;text-align:left;display:flex;justify-content: space-around;"><span>{{item.distance/1000}} km</span><span>{{item.distance/1000}} min</span></div>
                </el-col>
                <el-col :span="6" style="height:100%">
                    <el-button type="primary" @click="readPath(item.id)">查看路径</el-button>
                    <el-button type="primary" @click="readPath(item.id)" style="margin-left:0;margin-top:10px">报告分析</el-button>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
    <pagination v-show="total>12" :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="getList" />
    <el-dialog title="走航路径" :visible.sync="pathMap" width="50%" append-to-body>
        <div>
            <div id="pathMap"></div>
        </div>
    </el-dialog>
</div>
</template>

<script>
import {
    listAirborne,
    getPath
} from '@/api/mysevice/service'
import GPS from '@/utils/gpstoGD'
export default {

    data() {
        return {
            recordsList: [],
            form: {
                pageSize: 10,
                pageNum: 1
            },
            total: 0,
            pathMap: false,
            map: null,
            pathData: []
        }
    },
    created() {},
    methods: {
        getList(id) {
            this.form.serviceId = id == 'all' ? undefined : id
            listAirborne(this.form).then(res => {
                this.recordsList = res.rows
                this.total = res.total
            })

        },
        readPath(id) {
            this.pathMap = true;
            this.$nextTick(() => {
                this.map = new AMap.Map("pathMap", {
                    zoom: 8, //级别
                    // center: [117.1959, 31.7848], //中心点坐标
                    viewMode: "2D", //使用2D视图
                });
                getPath(id).then((res) => {
                    let data = res.rows;
                    let that = this;
                    if (data.length > 0) {
                        data.forEach((item, index) => {
                            var gps = GPS.gcj_encrypt(item.lat, item.lng)
                            that.pathData[index] = [gps.lon, gps.lat];
                            if (index == data.length - 1) {
                                this.drawPath()
                            }
                        })
                    } else {
                        this.pathData = [];
                        this.$message({
                            type: 'waring',
                            message: '当前走航记录没有路径'
                        })
                    }
                })
            })
        },
        drawPath() {
            let that = this;
            AMapUI.load(['ui/misc/PathSimplifier'], function (PathSimplifier) {
                if (!PathSimplifier.supportCanvas) {
                    alert('当前环境不支持路径查看');
                    return;
                }
                //启动页面
                that.initPage(PathSimplifier);
            })
        },
        initPage(PathSimplifier) {
            var pathSimplifierIns = new PathSimplifier({
                zIndex: 100,
                map: this.map, //所属的地图实例
                getPath: function (pathData, pathIndex) {

                    return pathData.path;
                },
                getHoverTitle: function (pathData, pathIndex, pointIndex) {

                    if (pointIndex >= 0) {
                        //point 
                        return pathData.name + '，点：' + pointIndex + '/' + pathData.path.length;
                    }

                    return pathData.name + '，点数量' + pathData.path.length;
                },
                renderOptions: {
                    //轨迹线的样式
                    pathLineStyle: {
                        strokeStyle: 'red',
                        lineWidth: 6,
                        dirArrowStyle: true
                    }
                }
            });
            //这里构建两条简单的轨迹，仅作示例
            pathSimplifierIns.setData([{
                name: '走航轨迹',
                path: this.pathData
            }]);

            function onload() {
                pathSimplifierIns.renderLater();
            }

            function onerror(e) {
                alert('图片加载失败！');
            }
            //创建一个巡航器
            var navg0 = pathSimplifierIns.createPathNavigator(0, //关联第1条轨迹
                {
                    loop: true, //循环播放
                    speed: 20000,
                    pathNavigatorStyle: {
                        width: 32,
                        height: 32,
                        // initRotateDegree: -90,
                        content: PathSimplifier.Render.Canvas.getImageContent('/car.png', onload, onerror),
                        strokeStyle: null,
                        fillStyle: null
                    }
                });

            navg0.start();
        }
    }
}
</script>

<style>
#pathMap {
    height: 600px
}

.amap-logo,
.amap-copyright {
    display: none !important;
}
</style>
