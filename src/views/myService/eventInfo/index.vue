<!--
 * @Author: your name
 * @Date: 2021-06-24 09:09:11
 * @LastEditTime: 2021-10-11 10:51:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MoveDapWebUi\src\views\business\event\UnconfirmedInfo.vue
-->
<template>
<div class="infocontainer">
    <el-row :gutter="10" type="flex" justify="space-between">
        <el-col :span="2">
            <el-button type="text" style="font-size:16px;color:white" @click="backEvent"><i class="el-icon-arrow-left"></i>返回事件列表</el-button>
        </el-col>
        <el-col :span="2">
            <el-button v-if="form.status == 0" type="primary" v-hasPermi="['move:event:confirm']" @click="handleConfirm">确认</el-button>
            <!-- <el-button type="primary" @click="handleConfirm">确认</el-button> -->
        </el-col>
    </el-row>
    <div style="position: relative;background: rgba(0, 0, 0, 0.1);border-radius: 4px;padding:10px">
        <img v-if="form.status == 0" style="position:absolute;right:30px;top:0px;width:56px;" src="../../../assets/images/confirm_1@2x.png" alt="">
        <img v-if="form.status == 1" style="position:absolute;right:30px;top:0px;width:56px;" src="../../../assets/images/confirm_2@2x.png" alt="">
        <h1 style="text-align:center">{{form.name}}</h1>
        <el-row :gutter="20" style="text-align:left">
            <el-col :span="8"><span class="itemLabel">上报时间</span><span style="margin-left:20px">{{form.uploadTime}}</span></el-col>
            <el-col :span="6"><span class="itemLabel">事件类型</span><span style="margin-left:20px">{{eventTypes[form.pollutionType]}}</span></el-col>
            <el-col :span="5"><span class="itemLabel">上报人</span><span style="margin-left:20px">{{form.uploadBy}}</span></el-col>
        </el-row>
        <p style="text-align:left"><span class="itemLabel">事件描述</span><span style="margin-left:20px">{{form.pollutionDecription}}</span></p>
        <div style="text-align:start">
            <span style="margin-right:44px;display:block;float:left" class="itemLabel">图片</span>
            <el-image v-for="item in form.imagePathList" style="width: 100px; height: 100px;margin-top:5px" :src="item" :key="item" :preview-src-list="form.imagePathList"></el-image>
        </div>
        <div>
            <div style="margin-right:44px;float:left;height:100%" class="itemLabel">位置</div>
            <p style="text-align:left">{{form.location}}</p>
            <div style="margin-left:68px">
                <baidu-map class="infoMap" :mapClick="false" :center="map.center" :zoom="map.zoom" @ready="handlerMap">
                    <!--缩放-->
                    <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
                    <!--定位-->
                    <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
                    <!--点-->
                    <bm-marker :position="map.center" :dragging="map.dragging" animation="BMAP_ANIMATION_DROP">

                    </bm-marker>
                </baidu-map>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {
    eventInfo,
    eventConfirm
} from "@/api/business/event";
export default {
    name: "EventInfo",
    props: {
        id: Number
    },
    components: {},
    data() {
        return {
            form: {},
            map: {
                center: {
                    lng: 117.448459,
                    lat: 31.797296
                },
                zoom: 15,
                show: true,
                dragging: true
            },
            eventTypes: {}
        }
    },
    created() {
        //查询事件类型状态字典
        this.getDicts("move_pollution_type").then(response => {
            response.data.forEach(item => {
                this.eventTypes[item.dictValue] = item.dictLabel
            });

        });

    },
    methods: {
        getList() {
            let id = this.id
            eventInfo(id).then(res => {
                this.form = res.data
                this.map.center.lat = this.form.latitude
                this.map.center.lng = this.form.longitude
            })
        },

        handlerMap({
            BMap,
            map
        }) {
            let that = this;

            // 鼠标缩放
            map.enableScrollWheelZoom(true);
            // 点击事件获取经纬度
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
        handleConfirm() {
            this.form.status = 1
            eventConfirm(this.form).then((res) => {
                this.$message({
                    message: res.msg,
                    type: 'success'
                });
            })
        },
        backEvent() {
            this.$emit('backEve', null, false)
        }
    },
    mounted() {
        this.getList()
    }
};
</script>
<style>
.infoMap {
    width: 100%;
    height: 400px;
    background-color: white;
    opacity: 1 !important;
    margin: 0;
}

.infoMap .anchorBL {
    display: none !important;
    
}

.infocontainer {
    color: white;
    overflow-y: auto;
    overflow-x: hidden;
}
.itemLabel{
    font-weight: 700;
}
</style>
