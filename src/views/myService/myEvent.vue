<!--
 * @Author: your name
 * @Date: 2021-06-25 10:53:28
 * @LastEditTime: 2021-09-10 14:09:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MoveDapWebUi\src\views\myService\myEvent.vue
-->
<template>
<div>
    <el-row :gutter="20" style="padding:0 5px">
        <el-col :span="12" v-for="(item,index) in eventList" :key="index" style="overflow:hidden;margin-bottom:10px">
            <el-row :gutter="10" style="padding:10px;background:rgba(255, 255, 255, 0.1);color:white;border-radius:5px">
                <el-col :span="6">
                    <el-image style="width: 80px; height: 80px" :src="item.imagePathList[0]" fit="fill"></el-image>
                </el-col>
                <el-col :span="14">
                    <div class="ellipsis">{{item.name}}
                        <el-tag :type="item.status==0?'danger':'success'" effect="dark">{{item.status==0?'未确认': '已确认'}}</el-tag>
                    </div>
                    <div class="ellipsisinfo">{{item.pollutionDecription}}</div>
                    <div class="elladdress">
                        <el-link type="primary" style="color:white" @click="handleAddress(item)"><i class="el-icon-location-outline"></i>{{' '+item.location}}</el-link>
                    </div>
                    <div style="font-size:12px;padding:0 0 5px 0;text-align: left;"><i class="el-icon-alarm-clock"></i>{{' '+item.uploadTime}}</div>
                </el-col>
                <el-col :span="4" style="height:100%">
                    <div>
                        <el-button type="primary" @click="handleInfo(item.id)">详情</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
    <pagination v-show="total>12" :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="getList" />
    <el-dialog title="查看地址" :visible.sync="mapOpen" append-to-body>
        <div class="head-container">
            <baidu-map class="map" :mapClick="false" :center="map.center" :zoom="map.zoom" @ready="handlerMap">
                <!--缩放-->
                <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
                <!--定位-->
                <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
                <!--点-->
                <bm-marker :position="map.center" :dragging="map.dragging" animation="BMAP_ANIMATION_DROP">

                </bm-marker>
            </baidu-map>
        </div>
    </el-dialog>
</div>
</template>

<script>
import {
    eventCustomer
} from '@/api/mysevice/service'

export default {
    data() {
        return {
            eventList: [],
            total: 0,
            form: {
                pageNum: 1,
                pageSize: 10
            },
            id:null,
            open:false,
            mapOpen: false,
            map: {
                center: {
                    lng: 117.448459,
                    lat: 31.797296
                },
                zoom: 15,
                show: true,
                dragging: true
            },
        }
    },
    created() {},
    methods: {
        getList(id) {
            this.form.serviceId = id == 'all' ? undefined : id
            eventCustomer(this.form).then(res => {
                this.eventList = res.rows
                this.total = res.total;
            })

        },
        handleInfo(id) {
            this.id = id;
            this.open = true
            this.$emit('getInfo',this.id,this.open)
        },
        handleAddress(item) {
            this.map.center.lat = item.latitude
            this.map.center.lng = item.longitude
            this.mapOpen = true
        },
        handlerMap({
            BMap,
            map
        }) {
            let that = this;
            // 鼠标缩放
            map.enableScrollWheelZoom(true);
            // // 点击事件获取经纬度
            // map.addEventListener('click', function (e) {
            //     var markers = map.getOverlays();
            //     markers.forEach((item) => {
            //         map.removeOverlay(item);
            //     })
            //     var point = new BMap.Point(e.point.lng, e.point.lat);
            //     var marker = new BMap.Marker(point); // 创建标注    
            //     map.addOverlay(marker);
            // })
        },
    }
}
</script>

<style>
.ellipsis {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    font-weight: 600;
    text-align: left;
}
.ellipsisinfo{
    font-size: 14px;
    text-align: left;
}
.elladdress{
    font-size: 12px;
    text-align: left;
    color: white;
    margin: 5px 0;
}
.map {
    width: 100% !important;
    height: 600px;
}

.map .anchorBL {
    display: none !important;
}
</style>
