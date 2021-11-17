<!--
 * @Author: your name
 * @Date: 2021-06-24 17:19:53
 * @LastEditTime: 2021-10-11 10:47:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MoveDapWebUi\src\views\myservice\index.vue
-->
<template>
<div class="serviceBox">
    <el-row :gutter="20" style="height:100%">
        <el-col :span="4" :offset="4" style="height:99%;">
            <el-card style="text-align:center;background:rgba(44, 44, 44, 0.4);height:100%;border:0px solid">
                <div style="color:white">
                    <img style="width: 50px;  height: 50px;border-radius:50%" :src="userinfo.portrait" />
                    <div style="margin:5px 0"><span>{{userinfo.userName || '-'}}</span></div>
                    <div style="font-size:14px;opacity:0.6;margin-bottom:10px"><span>{{userinfo.userDept || '-'}}</span></div>
                </div>
                <div>
                    <ul class="infinite-list">
                        <li class="infinite-list-item" v-for="(item,index) in serviceList" :key="index" :class="{ activeClass: num == index }" @click="handleQuery(index,item.id)">
                            <span>{{item.name}}</span>
                        </li>
                    </ul>

                </div>
            </el-card>
        </el-col>
        <el-col :span="12" style="height:99%;">
            <div class="serviceInfo">
                <div>
                    <div>{{Math.round(myInfo.duration) || 0}}天</div>
                    <span>服务时长</span>
                </div>
                <div>
                    <div>{{myInfo.reports || 0}}份</div>
                    <span>分析报告</span>
                </div>
                <div>
                    <div>{{myInfo.events || 0}}件</div>
                    <span>事件上报</span>
                </div>
                <div>
                    <div>{{myInfo.moveCount || 0}}次</div>
                    <span>走航次数</span>
                </div>
                <div>
                    <div>{{myInfo.moveMileage>10000?myInfo.moveMileage+'W' :myInfo.moveMileage|| 0}}公里</div>
                    <span>走航里程</span>
                </div>
                <div>
                    <div>{{myInfo.serviceAssess || 0}}星</div>
                    <span>服务评价</span>
                </div>
            </div>
            <el-card style="height: calc(100vh - 143px);text-align:center;background:rgba(44, 44, 44, 0.4);border:0px solid #000;">
                <event-info :id="eventId" v-if="infoOpen" @backEve="getEventInfo"></event-info>
                <el-tabs v-else type="border-card" v-model="tabName" @tab-click="tabClick" style="border:0px solid #00;background:rgba(0, 0, 0, 0);">
                    <el-tab-pane label="我的事件" name="event">
                        <my-event ref="eventTab" @getInfo="getEventInfo"></my-event>
                    </el-tab-pane>
                    <el-tab-pane label="服务计划" name="plan">
                        <service-plan ref="planTab"></service-plan>
                    </el-tab-pane>
                    <el-tab-pane label="我的报告" name="report">
                        <my-report ref="reportTab"></my-report>
                    </el-tab-pane>
                    <el-tab-pane label="走航记录" name="record">
                        <sailing-record ref="recordTab"></sailing-record>
                    </el-tab-pane>
                    <el-tab-pane label="飞行记录" name="airborne">
                        <airborne ref="airborneTab"></airborne>
                    </el-tab-pane>
                </el-tabs>
            </el-card>
        </el-col>
    </el-row>
</div>
</template>

<script>
import MyEvent from './myEvent';
import MyReport from './myReport';
import ServicePlan from './servicePlan';
import SailingRecord from './sailingRecord';
import Airborne from './airborne'
import EventInfo from './eventInfo/index'
import {
    serviceInfo,
    listService,
    listServiceall
} from '@/api/mysevice/service'
import {
    getInfo
} from '@/api/login'
let base_url = process.env.VUE_APP_BASE_API
export default {
    name: "MyService",
    components: {
        MyEvent,
        MyReport,
        ServicePlan,
        SailingRecord,
        EventInfo,
        Airborne
    },
    data() {
        return {
            colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
            serviceList: [],
            myInfo: {},
            userinfo: {
                portrait: '../../assets/images/user@2x.png'
            },
            id: null,
            num: 0,
            tabName: 'event',
            infoOpen: false,
            eventId: null
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            listService().then(res => {
                this.serviceList = res.rows
                this.serviceList.unshift({
                    name: '全部',
                    id: 'all'
                })
                this.serviceList.forEach((item, index) => {
                    item.active = false
                    if (index == 0) {
                        this.num = index
                        this.id = item.id
                        this.handleQuery(index, item.id)
                    }
                });
            })
            getInfo().then(res => {
                this.userinfo.userName = res.user.nickName
                this.userinfo.userDept = res.user.dept.deptName;
                this.userinfo.portrait = base_url + res.user.avatar
            })
        },
        handleQuery(index, id) {
            this.num = index
            this.id = id
            let params = {
                serviceId: index == 0 ? undefined : id
            }
            serviceInfo(params).then(res => {
                this.myInfo = res.obj
                this.myInfo.moveMileage = (this.myInfo.moveMileage / 1000).toFixed(1)
            })
            this.tabClick()
        },
        tabClick() {
            this.$refs[this.tabName + 'Tab'].getList(this.id)
        },
        getEventInfo(id, open) {
            this.eventId = id;
            this.infoOpen = open;
            if (!open) {
                this.$nextTick(() => {
                    this.$refs['eventTab'].getList(this.id)
                })
            }
        }
    }
};
</script>

<style>
.serviceBox {
    background-image: url('../../assets/images/bg@2x.png');
    height: calc(100vh - 50px);
    padding-top: 10px;
}

.pagination-container {
    background: none !important;
}

.el-card__body {
    padding: 10px;
}

.serviceBox .el-tabs__item.is-top {
    color: white !important;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    margin: 0 10px;
    border: 0px solid;
}

.el-tabs--border-card>.el-tabs__header .el-tabs__item {
    border: 0px solid;
}

.el-tabs--border-card {
    box-shadow: none;
    border: 0px solid;
}

.el-tabs--border-card>.el-tabs__header {
    background: rgba(44, 44, 44, 0);
    color: white !important;
    border: none;
}

.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
    color: #fff;
    background: #18A0FB;
    opacity: 1;
    border: none;
}

.el-tabs--border-card>.el-tabs__content {
    background: rgba(44, 44, 44, 0);
    padding: 10px 0;
}

.serviceInfo {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
}

.serviceInfo>div {
    width: 144px;
    height: 64px;
    /* border-radius: 10px; */
    padding: 5px 10px;
    font-size: 20px;
    font-family: DIN-Bold, DIN;
    font-weight: 700;
    color: #FFFFFF;

}

.serviceInfo>div>span {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
}

.serviceInfo>div:first-child {
    background: url('../../assets/images/img01@2x.png') center no-repeat;
    background-size: cover;
}

.serviceInfo>div:nth-child(2) {
    background: url('../../assets/images/img02@2x.png') center no-repeat;
    background-size: cover;
}

.serviceInfo>div:nth-child(3) {
    background: url('../../assets/images/img03@2x.png') center no-repeat;
    background-size: cover;
}

.serviceInfo>div:nth-child(4) {
    background: url('../../assets/images/img04@2x.png') center no-repeat;
    background-size: cover;
}

.serviceInfo>div:nth-child(5) {
    background: url('../../assets/images/img05@2x.png') center no-repeat;
    background-size: cover;
}

.serviceInfo>div:last-child {
    background: url('../../assets/images/img06@2x.png') center no-repeat;
    background-size: cover;
}

.infinite-list {
    padding: 0;
    margin: 0;
    list-style: none;
    /* height: calc(100% - 30px); */
    overflow-y: auto;
}

.infinite-list-item {
    width: 100%;
    color: white;
    text-align: center;
    border-radius: 10px;
    padding: 5px;
    font-size: 14px;
    margin-bottom: 5px;
}

.infinite-list li.infinite-list-item:hover {
    cursor: pointer;
    background: rgba(255, 255, 255, 0.2);
}

.activeClass {
    background-color: #18A0FB;
    color: white;
}
</style>
