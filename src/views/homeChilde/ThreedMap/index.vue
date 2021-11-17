<!--
 * @Author: your name
 * @Date: 2021-05-25 08:48:06
 * @LastEditTime: 2021-11-05 14:54:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MoveDapWebUi\src\components\ThreedMap\index.vue
-->
<template>
<div class="threeView">
    <div id="container" @click.stop />
    <div class="carDrawer">
        <div class="drawerBox">
            <el-tabs v-model="carrierName" tab-position="left">
                <el-tab-pane label="走航车" name="vehicle">
                    <el-tabs v-model="tabName">
                        <el-tab-pane label="走航模式" :name="sailingModel">
                            <el-form label-width="70px" :model="carForm" ref="carForm" :rules="rules" hide-required-asterisk>
                                <el-form-item label="车辆设备" prop="moveId">
                                    <el-select placeholder="请选择" v-model="carForm.moveId" size="mini" style="color:white">
                                        <el-option v-for="dict in carrierList" :key="dict.id" :label="dict.decription" :value="dict.id"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="开始时间" prop="startTime">
                                    <el-date-picker key="picker_single1" v-model="carForm.startTime" type="datetime" placeholder="开始日期" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" size="mini">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="结束时间" prop="endTime">
                                    <el-date-picker key="picker_single2" v-model="carForm.endTime" type="datetime" placeholder="结束日期" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" size="mini">
                                    </el-date-picker>
                                </el-form-item>
                                <div class="flexright">
                                    <el-button type="primary" size="mini" @click="moveConfirm">确认</el-button>
                                </div>
                            </el-form>
                            <el-table :data="recordList" style="width: 100%" size="mini" :max-height="170" @row-click="recordClick" :cell-style="{background:'none',border:'none',padding:'0'}" :row-class-name="recordRowClassName">
                                <el-table-column prop="name" align="center" label="走航编号">
                                </el-table-column>
                                <el-table-column prop="beginTime" align="center" label="时间">
                                </el-table-column>
                            </el-table>
                            <el-form class="carinfo" :model="form" label-width="100px" label-position="left" v-if="form.beginTime">
                                <el-form-item label="设备编号" prop="devId">
                                    <span>{{form.bizMoveCode}}</span>
                                </el-form-item>
                                <el-form-item label="最后位置" prop="devId">
                                    <span>{{form.beginLongitude+','+form.beginLatitude}}</span>
                                </el-form-item>
                                <el-form-item label="最新走航时间" prop="devId">
                                    <span>{{form.beginTime}}</span>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="固定模式" :name="fixedModel">
                            <el-form label-width="70px">
                                <el-form-item label="车辆设备">
                                    <el-select placeholder="请选择" v-model="carForm.device" size="mini" style="color:white" @change="staticMoveChange" clearable>
                                        <el-option v-for="dict in carrierList" :key="dict.id" :label="dict.decription" :value="dict.id"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="位置">
                                    <el-select v-model="carForm.position" placeholder="请选择观测位置" size="mini" @change="addressChange" clearable>
                                        <el-option v-for="(item,index) in addressList" :label="item" :value="item" :key="index"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="开始时间">
                                    <el-date-picker key="picker_double1" v-model="carForm.startTime2" type="datetime" placeholder="开始日期" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" size="mini">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="结束时间">
                                    <el-date-picker key="picker_double2" v-model="carForm.endTime2" type="datetime" placeholder="结束日期" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" size="mini">
                                    </el-date-picker>
                                </el-form-item>
                                <div class="flexright">
                                    <el-button type="primary" size="mini" @click="staticConfirm">确认</el-button>
                                </div>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                </el-tab-pane>
                <el-tab-pane label="无人机" name="airborne">
                    <el-form label-width="70px" :model="airborneForm" ref="airborneForm" :rules="rules" hide-required-asterisk style="padding-top:20px">
                        <el-form-item label="车辆设备" prop="moveId">
                            <el-select placeholder="请选择" v-model="airborneForm.moveId" size="mini" style="color:white">
                                <el-option v-for="dict in carrierList" :key="dict.id" :label="dict.decription" :value="dict.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="开始时间" prop="startTime">
                            <el-date-picker v-model="airborneForm.startTime" type="datetime" placeholder="开始日期" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss" size="mini">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间" prop="endTime">
                            <el-date-picker v-model="airborneForm.endTime" type="datetime" placeholder="结束日期" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss" size="mini">
                            </el-date-picker>
                        </el-form-item>
                        <div class="flexright">
                            <el-button type="primary" size="mini" @click="airborneConfirm">确认</el-button>
                        </div>
                    </el-form>
                </el-tab-pane>
                <div class="closeTabs">
                    <el-button type="text" icon="el-icon-close" size="mini" style="float:right;" @click="closeCarSelect"></el-button>
                </div>
            </el-tabs>
        </div>
    </div>
    <div class="monitorList">
        <div class="dev">
            <div v-for="(item,index) in devList" :key="index">
                <el-button size="mini" :class="{activeDev:count == index}" @click="devClick(item,index)" style="width: 168px;padding: 8px 0;">{{item.name}}</el-button>
            </div>
            <el-button size="mini" v-if="tabName!=sailingModel&&devName=='多波长拉曼气溶胶激光雷达'" @click="exhibitionOpen = true" style="margin-top: 100px;">展示设置</el-button>
        </div>

        <div class="euip">
            <el-button style="margin-top:20px" size="mini" @click="exhibitionOpen = true" icon="el-icon-image-exhibition" v-if="tabName==sailingModel&&scalinglayer">展示设置</el-button>
            <el-button size="mini" @click="planView" icon="el-icon-image-picture" v-if="tabName==sailingModel&&scalinglayer">二维图</el-button>
        </div>
    </div>
    <el-dialog title="展示设置" :visible.sync="exhibitionOpen" width="30%">
        <el-form :model="exhibitionForm" label-width="80px">
            <el-form-item label="因子">
                <el-select v-model="exhibitionForm.factorname" placeholder="请选择因子" @change="factorChange">
                    <el-option v-for="(item,index) in factorList" :key="item.id" :label="item.chName" :value="index">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="色标">
                <vue-slider v-model="exhibitionForm.codeVal" :min="exhibitionForm.codemin" :max="exhibitionForm.codemax" :interval="0.1"></vue-slider>
            </el-form-item>
            <el-form-item label="高度/半径">
                <vue-slider v-model="exhibitionForm.highVal" :min="exhibitionForm.highmin" :max="exhibitionForm.highmax" :interval="100"></vue-slider>
            </el-form-item>
            <el-form-item label="透明度">
                <vue-slider v-model="exhibitionForm.transparency" :min="0" :max="1" :interval="0.1"></vue-slider>
            </el-form-item>
            <el-form-item label="距离标志">
                <el-input-number v-model="exhibitionForm.distancePos" :min="0" :max="2000" :step="100" step-strictly></el-input-number>
            </el-form-item>
            <el-form-item>
                <!-- <el-checkbox v-model="exhibitionForm.connect">二三维联动</el-checkbox> -->
                <el-checkbox v-model="exhibitionForm.meteVal">气象数值</el-checkbox>
                <el-checkbox v-model="exhibitionForm.pbFlag">边界层高度</el-checkbox>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="exhibitionOpen = false">取 消</el-button>
            <el-button type="primary" @click="submitExform">确 定</el-button>
        </div>
    </el-dialog>
    <div class="scanDrawer">
        <div class="drawerBox">
            <el-tabs v-model="scantabName">
                <el-tab-pane label="平面" name="plane">
                    <plane ref="movePlane" :tableData="filterScan" :maxHeight="tableMaxH" :paramData="scanform" :map="map" :reportImgUrl="reportImgUrl" @biginLoading="loadingFun() " :loading="loading" :selecteData="selecetPlane" @sendSeleted="sendPlane"></plane>
                </el-tab-pane>
                <el-tab-pane label="剖面" name="sector">
                    <sector ref="moveSector" :tableData="filterScan" :maxHeight="tableMaxH" :paramData="scanform" :map="map" :reportImgUrl="reportImgUrl" @biginLoading="loadingFun() " :loading="loading" :selecteData="selecetSector" @sendSeleted="sendSector"></sector>
                </el-tab-pane>
                <el-tab-pane label="锥体" name="conical">
                    <cone ref="moveConical" :tableData="filterScan" :maxHeight="tableMaxH" :paramData="scanform" :map="map" :reportImgUrl="reportImgUrl" @biginLoading="loadingFun() " :loading="loading" :selecteData="selecetCone" @sendSeleted="sendCone"></cone>
                </el-tab-pane>
            </el-tabs>
            <div class="closeTabs">
                <el-button type="text" icon="el-icon-close" size="mini" style="float:right;" @click="closeScanView"></el-button>
            </div>
        </div>
    </div>

    <div class="planDrawer">
        <div class="planTop">
            <div class="topLeft">
                <div style="font-size:14px;"><span>{{devName}}</span></div>
                <div style="font-size:12px;margin-top:5px">{{picTime.start}}~{{picTime.end}} <span v-if="mouseClickDates" style="padding-left: 30px;">当前点击值：{{mouseClickDates}}</span></div>
            </div>
            <!-- <div class="plantopRight">
                <el-button size="mini" @click="scanView" v-if="tabName!=sailingModel">扫描记录</el-button>
                <el-button size="mini" v-if="tabName!=sailingModel" @click="exhibitionOpen = true">展示设置</el-button>
            </div> -->
            <div class="closeTabs">
                <el-button type="text" icon="el-icon-close" size="mini" style="float:right;" @click="closePlan"></el-button>
            </div>
        </div>
        <!-- 雷达 -->
        <div class="planContainer">
            <div class="planContainerChart">
                <chart chartId="pcolorChart" ref="pcolorChart" :width="pcolorWidth" :height="pcolorHeight" :chartOptions="pcolorOption"></chart>
            </div>
            <img :src="ColorCard" alt="" ref="imgs">
            <chart chartId="verticalChart" ref="verticalChart" :width="verticalWidth" :height="pcolorHeight" :chartOptions="verticalOption"></chart>
        </div>

        <!-- <chart chartId="levelChart" ref="levelChart" width="80%" :height="pcolorHeight" :chartOptions="levelOption"></chart> -->
    </div>

    <div class="microStation">
        <div class="planTop">
            <div class="topLeft">
                <div style="font-size:14px;"><span>{{devName}}</span></div>
                <div style="font-size:12px;margin-top:5px">{{picTime.start}}~{{picTime.end}}</div>
            </div>
            <div class="closeTabs">
                <el-button type="text" icon="el-icon-close" size="mini" style="float:right;" @click="closeCurve"></el-button>
            </div>
        </div>
        <!-- 微站 -->
        <div ref="microStation">
            <chart chartId="microStationChart" ref="microStationChart" width="100%" :height="pcolorHeight" :chartOptions="microStationOption"></chart>
        </div>
        <!-- 粒径普 -->
        <div ref="particle">
            <chart chartId="particleChart" ref="particleChart" width="100%" :height="pcolorHeight" :chartOptions="particleOption"></chart>
        </div>
    </div>

</div>
</template>

<script>
import plane from '../../threedMapchild/plane.vue';
import sector from '../../threedMapchild/sector.vue';
import cone from '../../threedMapchild/cone.vue';
import Chart from '@/components/chart/index';
import vueSlider from '@/components/vueslider/index';
import GPS from '@/utils/gpstoGD'
import {
    listMove
} from '@/api/move/move';
import {
    listRecord,
} from "@/api/business/sailing";
import {
    getDevModel,
} from "@/api/move/devModel";
import {
    getMoveScans,
    getSailingpics,
    getPcolorpic,
    getPosition,
    getMoveDevice,
    getFactorInfo,
    getStaticSky,
    getStaticScan,
    getlidarHorizontalVertical,
    getMouseDate,
    getDOP,
    getMicroAir
} from "@/api/index";

export default {
    name: "ThreeMap",
    components: {
        plane,
        sector,
        cone,
        Chart,
        vueSlider
    },
    data() {
        return {
            mouseClickDates: null,
            devOptionList: {
                leiDa: '多波长拉曼气溶胶激光雷达',
                weiZhan: '空气微站',
                liJingPu: '粒径普',
                qiXiang: '气象五参数'
            },
            devName: null,
            verticalWidth: '',
            ColorCard: '',
            //地图api
            amapapi: null,
            //车辆信息弹窗
            drawer: false,
            carrierName: 'vehicle',
            //车辆设备表单
            carForm: {
                startTime: '2020-08-01 00:00',
                endTime: '2020-08-31 23:59',
                startTime2: '2021-10-01 00:00',
                endTime2: '2021-10-31 23:59',
                // position: '环境大厦'
            },
            //无人机表单
            airborneForm: {},
            //观测模式
            tabName: 'sailing',
            //走航模式
            sailingModel: 'sailing',
            //固定模式
            fixedModel: 'fixed',
            //车辆设备列表数据
            carrierList: [],
            //固定位置
            addressList: [],
            //表单验证
            rules: {
                moveId: [{
                    required: true,
                    message: '请选择载体',
                    trigger: 'change'
                }],
                startTime: [{
                    required: true,
                    message: '请选择开始时间',
                    trigger: 'change'
                }],
                endTime: [{
                    required: true,
                    message: '请选择结束时间',
                    trigger: 'change'
                }],
            },
            //载体所含设备列表
            devList: [],
            //设备监测因子列表
            factorList: [],
            //车辆走行信息
            form: {

            },
            //走航记录列表
            recordList: [],
            //走航记录行id
            recordRowid: null,
            //走航图数据
            moveImgList: [],
            //走航图图层
            scalinglayer: null,
            //展示设置弹窗
            exhibitionOpen: false,
            //地图
            map: null,
            //卫星主题
            satellite: null,
            //路网
            roadNet: null,
            //展示设置表单
            exhibitionForm: {
                transparency: 0.7,
                connect: false,
                meteVal: false,
                pblFlag: false,
                distancePos: 0,
            },
            //伪彩图时间
            picTime: {
                start: '',
                end: ''
            },
            //走航查询参数
            sailingForm: {},
            //固定模式查询参数
            fixForm: {},
            //扫描模式选项卡名称
            scantabName: 'plane',
            //扫描数据表格最大高度
            tableMaxH: 0,
            //扫描记录参数设置
            scanform: {},
            //扫描记录
            scanData: [],
            //筛选后的扫描记录
            filterScan: [],
            //已勾选的平扫数据
            selecetPlane: [],
            //已勾选的剖面数据
            selecetSector: [],
            //已勾选的锥体数据
            selecetCone: [],
            loading: null,
            //伪彩图背景宽度
            pcolorWidth: '',
            //伪彩图背景高度
            pcolorHeight: '',
            //伪彩图图表配置
            pcolorOption: {
                tooltip: {
                    trigger: 'axis',
                    // triggerOn:'click',
                    axisPointer: {
                        type: 'cross',
                        axis: 'x',
                        animation: false,
                        label: {
                            backgroundColor: '#ccc',
                            borderColor: '#aaa',
                            borderWidth: 1,
                            shadowBlur: 0,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            color: '#222'
                        },
                        snap: false
                    },
                    showContent: false,
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        },
                        // onZero:true
                    },
                    axisLabel: {
                        formatter: function (val) {
                            let str = val.replace(' ', '\n')
                            return str
                        }
                    },
                    boundaryGap: false,
                    // scale:false
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        },
                        // onZero:true
                    },
                    boundaryGap: false,
                    // axisTick:{alignWithLabel:true},
                    splitLine: {
                        show: false
                    },
                    interval: 0.5
                },

                grid: {
                    left: '3%',
                    top: '3%',
                    right: '3%',
                    bottom: '15%',
                },
                series: [{
                    data: [1, 2, 3, 4, 5, 6, 7],
                    type: 'line',
                    showSymbol: false,
                    hoverAnimation: false,
                    lineStyle: {
                        opacity: 0
                    },
                    symbol: 'none'
                }]
            },
            // 垂直扩线图
            verticalOption: {
                tooltip: {
                    trigger: 'axis',
                    formatter: '{b}km : {c}'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top: '5%',
                    containLabel: true
                },
                backgroundColor: 'rgba(255,255,255,0.5)',
                yAxis: {
                    type: 'category',
                    axisLabel: {
                        formatter: function (val) {
                            return (val / 1000).toFixed(1)
                        },
                    },
                    data: []
                },
                xAxis: {
                    type: 'value'
                },
                series: {
                    data: [],
                    type: 'line'
                }
            },
            // 微站
            microStationOption: {
                backgroundColor: 'rgba(255,255,255,.8)',
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['CO', 'NO2', 'O3', 'PM10', 'PM25', 'SO2', '湿度', '温度', '气压']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                        name: 'CO',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'NO2',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'O3',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'PM10',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'PM25',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'SO2',
                        type: 'line',

                        data: []
                    },
                    {
                        name: '湿度',
                        type: 'line',

                        data: []
                    },
                    {
                        name: '温度',
                        type: 'line',

                        data: []
                    },
                    {
                        name: '气压',
                        type: 'line',

                        data: []
                    }
                ]
            },
            // 粒径普
            particleOption: {
                backgroundColor: 'rgba(255,255,255,.8)',
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['PM1', 'PM10', 'PM25', 'PT0_5', 'PT0_75', 'PT1', 'PT1_3', 'PT1_5', 'PT2', 'PT2_5', 'PT3', 'PT4', 'PT5', 'PT6_5', 'PT8', 'PT10', 'PT12', 'PT14', 'PT16', 'PT18', 'PT20', 'PT22', 'PT25', 'PT30']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                        name: 'PM1',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'PM10',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'PM25',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'PT0_5',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'PT0_75',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'PT1',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'PT1_3',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'PT1_5',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'PT2',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'PT2_5',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'PT3',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'PT4',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'PT5',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'PT6_5',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'PT8',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'PT10',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'PT12',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'PT14',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'PT16',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'PT18',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'PT20',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'PT22',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'PT25',
                        type: 'line',

                        data: []
                    },
                    {
                        name: 'PT30',
                        type: 'line',

                        data: []
                    }
                ]
            },
            count: 0
        };
    },
    watch: {
        scantabName: { //监听扫描记录选项卡
            immediate: true,
            deep: true,
            handler: function (newVal, oldVal) {
                if (oldVal) {
                    this.filterScan = this.scanData.filter(item => { //更新表格数据
                        if (item.type == this.scantabName) {
                            return item
                        }
                    })
                }
            }
        },
        carrierName(newVal, oldVal) {
            if (newVal == 'airborne') {
                //请求设备车辆列表
                listMove({
                    category: 1
                }).then(res => {
                    this.carrierList = res.rows;
                });
            } else {
                //请求设备车辆列表
                listMove({
                    category: 0
                }).then(res => {
                    this.carrierList = res.rows;
                });
            }
        },
        tabName() {
            this.closePlan()
            this.closeCurve()
            this.closeScanView()
        }

    },
    created() {
        this.loadingFun()

    },
    methods: {
        //三维地图
        threedMap() {
            let that = this
            //图片加载完毕的回调函数
            //所有关于地图的逻辑全部都在这个回调里面，
            // 保证高德地图加载完毕
            this.map = new AMap.Map('container', {
                viewMode: '3D',
                labelzIndex: 130,
                pitch: 40,
                zoom: 13,
                layer: [
                    // 卫星
                    new AMap.TileLayer.Satellite({
                        // detectRetina: true
                    }),
                ],
                zooms: [1, 20],
                resizeEnable: true
            });
            this.satellite = new AMap.TileLayer.Satellite({
                map: this.map,
                // detectRetina: true
            });
            this.roadNet = new AMap.TileLayer.RoadNet({
                map: this.map
            })

            AMap.plugin(['AMap.ControlBar', ], function () {
                // 添加 3D 罗盘控制
                that.map.addControl(new AMap.ControlBar({
                    position: {
                        bottom: 0,
                        right: 0
                    },
                    showZoomBar: false
                }));
            });

            // this.mapLoad()
        },
        //地图加载完成时
        mapLoad(openTip) {
            let that = this;
            this.map.on("complete", function () {
                that.loading.close();
                log.success("地图加载完成！");
                if (openTip) {
                    that.$message({
                        message: '已切换至历史模式',
                        type: 'success'
                    });
                }
            });
        },
        //更改地图主题类型
        changeMaptype(maptype) {
            if (maptype == 'satellite') {
                this.satellite.show();
                this.roadNet.show();
            } else if (maptype == 'standard') {
                this.satellite.hide();
                // this.roadNet.hide();
                this.map.setMapStyle("amap://styles/normal");
            } else {
                this.satellite.hide();
                // this.roadNet.hide();
                this.map.setMapStyle("amap://styles/light");
            }
        },
        //打开车辆设备走航信息弹窗
        carSelect() {
            //请求设备车辆列表
            listMove({
                category: 0
            }).then(res => {
                this.carrierList = res.rows;
            });
            let carDrawer = document.querySelector('.carDrawer');

            carDrawer.style.left = '5px'
        },
        //关闭车辆设备走航信息弹窗
        closeCarSelect() {
            let carDrawer = document.querySelector('.carDrawer');
            carDrawer.style.left = '-384px'
        },
        //走航模式确定按钮
        moveConfirm() {
            this.$refs['carForm'].validate((valid) => {
                if (valid) {
                    this.loadingFun(document.querySelector('.carDrawer'))
                    //查询走航记录
                    listRecord(this.carForm).then((res) => {
                        if (res.code == 200) {
                            this.recordList = res.rows;
                            this.form = this.recordList[0];
                            this.loading.close();
                        } else {
                            this.loading.close();
                        }
                    })
                    //查询载体的设备
                    getMoveDevice({
                        deviceMode: 0,
                        moveId: this.carForm.moveId
                    }).then(res => {
                        this.devList = res.rows;

                        this.devName = this.devList[0].name
                        getDevModel(this.devList[0].bizDeviceModelDto.id).then(res => {
                            this.factorList = res.data.factorList;
                            this.exhibitionForm.factorname = 0;
                            this.factorChange(this.exhibitionForm.factorname)
                        })
                    })
                }
            })
        },
        //走航记录点击事件
        recordClick(row, col, eve) {

            if (this.recordRowid == row.index) {
                if (document.querySelector('.activeRow')) {
                    document.querySelector('.activeRow.isRow').classList.remove('activeRow');
                    if (this.scalinglayer) {
                        this.scalinglayer.clear();
                        this.map.remove(this.scalinglayer);
                        this.scanData = [];
                        this.filterScan = [];
                        this.selecetPlane = [];
                        this.selecetSector = [];
                        this.selecetCone = [];
                    }
                } else {
                    document.querySelector('.isRow').classList.add('activeRow')
                    this.recordRowid = row.index;
                    this.sailingForm.savePath = row.savePath;
                    this.getMovePics()
                }
            } else {
                this.recordRowid = row.index;
                this.sailingForm.savePath = row.savePath;
                this.getMovePics()
            }
        },
        //设置表格行的类名
        recordRowClassName({
            row,
            rowIndex
        }) {
            row.index = rowIndex;
            if (this.recordRowid == rowIndex) {
                return 'activeRow isRow'
            }
        },
        //请求走航图
        getMovePics() {
            this.loadingFun()
            this.sailingForm.lidarID = undefined;
            let params = this.sailingForm;
            params.groundResolution = this.map.getZoom() > 14 ? 8.212516097744487 : this.map.getResolution(this.map.getCenter());
            this.moveImgList = [];
            this.filterScan = [];
            this.scanView()
            getSailingpics(params).then(res => {
                if (res.code == 200) {
                    this.moveImgList = res.obj.allCarPic;
                    this.drawWall();
                    this.loading.close();
                } else {
                    this.loading.close();
                }
            })
        },
        //绘制走航
        drawWall() {
            if (this.scalinglayer) {
                this.scalinglayer.clear();
                this.map.remove(this.scalinglayer);
            }
            // param.displayDistancePos = 1000
            let object3Dlayer = new AMap.Object3DLayer({
                opacity: this.sailingForm.transparency
            });
            let len = Math.round(this.moveImgList.length / 2);
            this.scalinglayer = object3Dlayer;
            this.map.add(object3Dlayer);
            const map = this.map;
            map.setZoomAndCenter(map.getZoom(), [this.moveImgList[len].startLng, this.moveImgList[len].startLat]); //设置地图中心点，视图自动跳转到地图中心点
            let index = 0;
            let that = this;
            draw();
            let lnglat1 = new AMap.LngLat(that.moveImgList[0].startLng, that.moveImgList[0].startLat)

            let v0xy = this.map.lngLatToGeodeticCoord(lnglat1);

            // this.addPOints(v0xy.x,v0xy.y,-Math.random() * 10000)
            function draw() {
                if (index < that.moveImgList.length) {
                    // var gpsbeg = GPS.gcj_encrypt(that.moveImgList[index].startLat, that.moveImgList[index].startLng); //gps坐标转高德坐标
                    // var gpsend = GPS.gcj_encrypt(that.moveImgList[index].endLat, that.moveImgList[index].endLng);
                    // that.moveImgList[index].startLat = gpsbeg.lat;
                    // that.moveImgList[index].startLng = gpsbeg.lon;
                    // that.moveImgList[index].endLat = gpsend.lat;
                    // that.moveImgList[index].endLng = gpsend.lon;
                    that.oneWall(that.moveImgList[index], map, object3Dlayer, that.sailingForm.highMin, that.sailingForm.highMax);
                    index++;
                    draw();
                }
            }
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
            //返回走航图图片URL
            this.reportImgUrl(item.picBase64, 512, 1024).then(canvasToUrl => {
                wall.backOrFront = 'both';
                wall.transparent = true;
                wall.textures.push(canvasToUrl);
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
        // 地图添加点（二三维联动）
        addPOints(x, y, h) {
            var object3Dlayer = new AMap.Object3DLayer({
                zIndex: 11110,
                opacity: 1
            });
            this.map.add(object3Dlayer);
            var points3D = new AMap.Object3D.Points();
            var geometry = points3D.geometry;
            var p = 1
            console.log(x, y, h)
            // 随机高度。Z 轴正方向指向地下，因此这里设置高度要添加负号指向反方向
            geometry.vertices.push(x, y, h);
            geometry.pointSizes.push(70);
            geometry.vertexColors.push(0, 0, 0, 0.5);
            points3D.borderColor = [0.6, 0.8, 1, 1];
            points3D.borderWeight = 6;
            object3Dlayer.add(points3D);

        },
        //展示设置中因子发生变化
        factorChange(val, openplan) {
            getFactorInfo(this.factorList[val].id).then(res => {
                let option = res.data;
                this.exhibitionForm.codeVal = [option.colorCodeDefaultMin, option.colorCodeDefaultMax];
                this.exhibitionForm.highVal = [option.heightRadiusDefaultMin, option.heightRadiusDefaultMax];
                this.exhibitionForm.codemin = option.colorCodeMin;
                this.exhibitionForm.codemax = option.colorCodeMax;
                this.exhibitionForm.highmin = option.heightRadiusMin;
                this.exhibitionForm.highmax = option.heightRadiusMax;
                let params = {
                    fixFlag: this.tabName == this.sailingModel ? false : true,
                    dmin: [parseFloat(this.exhibitionForm.codeVal[0])],
                    dmax: [parseFloat(this.exhibitionForm.codeVal[1])],
                    highMin: parseFloat(this.exhibitionForm.highVal[0]),
                    highMax: parseFloat(this.exhibitionForm.highVal[1]),
                    factorname: [this.factorList[this.exhibitionForm.factorname].enName],
                    distancePos: this.exhibitionForm.distancePos,
                    transparency: this.exhibitionForm.transparency,
                    connect: this.exhibitionForm.connect,
                    metenum: this.exhibitionForm.meteVal,
                    pblFlag: this.exhibitionForm.pblFlag
                }
                if (this.tabName == this.sailingModel) {
                    params.savePath = this.sailingForm.savePath;
                    this.sailingForm = params;
                } else {
                    params.startTime = this.carForm.startTime2;
                    params.endTime = this.carForm.endTime2;
                    params.savePath = this.fixForm.savePath;
                    this.fixForm = params;

                }
                this.sailingForm.deviceName = this.sailingForm.deviceName ? this.sailingForm.deviceName : this.devList[0].name;
                this.fixForm.deviceName = this.fixForm.deviceName ? this.fixForm.deviceName : this.devList[0].name;
                if (openplan) {
                    if (this.fixForm.deviceName == this.devOptionList.leiDa) {
                        this.planView()
                        this.scanView()
                    }
                }
            })
        },
        //展示设置确定按钮
        submitExform() {
            let devName = this.sailingForm.deviceName;
            let params = {
                fixFlag: this.tabName == this.sailingModel ? false : true,
                dmin: [parseFloat(this.exhibitionForm.codeVal[0])],
                dmax: [parseFloat(this.exhibitionForm.codeVal[1])],
                highMin: parseFloat(this.exhibitionForm.highVal[0]),
                highMax: parseFloat(this.exhibitionForm.highVal[1]),
                factorname: [this.factorList[this.exhibitionForm.factorname].enName],
                distancePos: this.exhibitionForm.distancePos,
                transparency: this.exhibitionForm.transparency,
                connect: this.exhibitionForm.connect,
                metenum: this.exhibitionForm.meteVal,
                pblFlag: this.exhibitionForm.pblFlag,
                deviceName: devName,

            }
            this.exhibitionOpen = false;
            if (this.tabName == this.sailingModel) {
                params.savePath = this.sailingForm.savePath;
                this.getMovePics()
                return
            } else {
                params.startTime = this.carForm.startTime2;
                params.endTime = this.carForm.endTime2;
                params.savePath = this.fixForm.savePath;
                this.fixForm = params;
            }
        },
        //二维伪彩图按钮 / 固定雷达
        planView() {
            this.count = 0
            this.devName = this.devOptionList.leiDa
            this.closeCurve()
            let planDrawer = document.querySelector('.planDrawer');
            // this.loadingFun(planDrawer)
            planDrawer.style.bottom = '0.5%';
            let pcolorW = this.pcolorWidth.replace('px', '')
            let pcolorH = this.pcolorHeight.replace('px', '')
            let picWidth = pcolorW - (pcolorW * 0.06);
            let picHeight = pcolorH - (pcolorH * 0.15);
            // console.log(document.querySelector('#pcolorChart').children[0].children[0])
            let canvas = document.querySelector('#pcolorChart').children[0].children[0]
            if (this.tabName == this.sailingModel) {
                let params = this.sailingForm
                params.picWidth = Math.round(picWidth);
                params.picHeight = Math.round(picHeight);
                this.pcolorPic(params, canvas);
            } else {
                let params = this.fixForm
                params.picWidth = Math.round(picWidth);
                params.picHeight = Math.round(picHeight);
                this.lidarPcolorpic(params, canvas);
            }
        },
        // 曲线图弹窗
        curveView() {
            this.closePlan()
            let planDrawer = document.querySelector('.microStation');
            planDrawer.style.bottom = '0.5%';
        },
        //二维伪彩图数据
        pcolorPic(params, canvas) {
            if (this.pcolorOption.xAxis.data.length > 0) {
                this.$refs.pcolorChart.clearChart()
            }
            this.$refs.pcolorChart.chartResize()
            getPcolorpic(params).then(res => {
                if (res.code == 200) {
                    let planDrawer = document.querySelector('.planDrawer');
                    planDrawer.style.bottom = '0.5%';
                    let bgUrl = 'data:image/png;base64,' + res.obj.strBase64[0].base64;
                    canvas.style.backgroundImage = 'url(' + bgUrl + ')';
                    this.picTime = {
                        start: res.obj.allDatetime[0],
                        end: res.obj.allDatetime[res.obj.allDatetime.length - 1]
                    }
                    this.pcolorOption.xAxis.data = res.obj.allDatetime;

                    // 默认第一次展示垂直扩线图
                    let x = this.pcolorOption.xAxis.data[0]
                    let y = 0

                    this.sailingForm.currentFileTime = x
                    this.sailingForm.currentHigh = y
                    this.sailingForm.startTime = x
                    this.sailingForm.endTime = this.pcolorOption.xAxis.data[this.pcolorOption.xAxis.data.length - 1]

                    this.getHorizontalVertical(this.sailingForm)

                    this.pcolorOption.yAxis.min = (res.obj.highRes[0] / 1000).toFixed(1)
                    this.pcolorOption.yAxis.max = (res.obj.highRes[res.obj.highRes.length - 1] / 1000).toFixed(1)

                }
                this.$refs.pcolorChart.init(res.code, res.obj.allDatetime.length)
            })
            // this.loading.close()
            let that = this;
            window.onresize = function () {
                that.$refs.pcolorChart.chartResize()
            };
            // var config = this.$echarts.config;
            this.$refs.pcolorChart.chartGroup().getZr().on('click', 'series', this.chartClick)

        },
        //图表点击事件
        chartClick(params) {
            const pointInPixel = [params.offsetX, params.offsetY];
            if (this.$refs.pcolorChart.chartGroup().containPixel('grid', pointInPixel)) {
                let point = this.$refs.pcolorChart.chartGroup().convertFromPixel({
                    seriesIndex: 0
                }, [params.offsetX, params.offsetY]);
                /*事件处理代码书写位置*/
                let x = this.pcolorOption.xAxis.data[point[0]]
                let y = Math.round(point[1] * 1000).toFixed(1)

                if (this.tabName == this.sailingModel) { //走航
                    this.sailingForm.currentFileTime = x
                    this.sailingForm.currentHigh = y
                    this.sailingForm.startTime = this.pcolorOption.xAxis.data[0]
                    this.sailingForm.endTime = this.pcolorOption.xAxis.data[this.pcolorOption.xAxis.data.length - 1]

                    this.getHorizontalVertical(this.sailingForm)
                    this.getMouseDates(this.sailingForm)
                } else { // 固定
                    this.fixForm.currentFileTime = x
                    this.fixForm.currentHigh = y
                    this.fixForm.startTime = this.pcolorOption.xAxis.data[0]
                    this.fixForm.endTime = this.pcolorOption.xAxis.data[this.pcolorOption.xAxis.data.length - 1]
                    this.getHorizontalVertical(this.fixForm)
                    this.getMouseDates(this.fixForm)
                }
            }
        },
        // 获得水平和垂直廓线数据
        getHorizontalVertical(params) {
            this.$refs.verticalChart.createChart()
            this.$refs.verticalChart.chartResize()
            getlidarHorizontalVertical(params).then((res) => {
                if (res.code == 200) {
                    //  垂直廓线数据
                    this.verticalOption.yAxis.data = res.obj.highRes
                    this.verticalOption.series.data = res.obj.verticalDataList[0]

                    this.$refs.verticalChart.init(res.code, res.obj.verticalDataList.length)
                    this.$refs.verticalChart.chartResize()

                    // 水平廓线数据
                    // this.levelOption.yAxis.data = res.obj.horizonalDataList[0]
                    // this.levelOption.series.data = res.obj.horionalTime
                    // this.$refs.levelChart.init(res.code,res.obj.horizonalDataList.length)
                    // this.$refs.levelChart.chartResize()

                }
            })
        },
        //关闭二维伪彩图弹窗
        closePlan() {
            let planDrawer = document.querySelector('.planDrawer');
            planDrawer.style.bottom = '-35%'
        },
        //关闭曲线图
        closeCurve() {
            let planDrawer = document.querySelector('.microStation');
            planDrawer.style.bottom = '-35%'
        },
        //打开扫描数据弹窗
        scanView() {
            let scanDrawer = document.querySelector('.scanDrawer');
            scanDrawer.style.left = '5px';
            this.selecetPlane = [];
            this.selecetSector = [];
            this.selecetCone = [];
            if (this.tabName == this.sailingModel) {

                let params = {
                    deviceName: this.sailingForm.deviceName,
                    savePath: this.sailingForm.savePath
                }
                getMoveScans(params).then(res => {
                    this.scanData = res.rows;
                    this.scanform = this.sailingForm
                    this.filterScan = this.scanData.filter(item => { //更新表格数据
                        if (item.type == this.scantabName) {
                            return item
                        }
                    })
                })
            } else {
                let params = {
                    deviceName: this.fixForm.deviceName,
                    savePath: this.fixForm.savePath,
                    startTime: this.carForm.startTime2,
                    endTime: this.carForm.endTime2,
                    // scanType:this.scantabName
                }
                getStaticScan(params).then(res => {
                    this.scanData = res.rows;
                    this.scanform = this.fixForm
                    this.filterScan = this.scanData.filter(item => { //更新表格数据
                        if (item.type == this.scantabName) {
                            return item
                        }
                    })
                })
            }
        },
        //关闭扫描数据弹窗
        closeScanView() {
            let scanDrawer = document.querySelector('.scanDrawer');
            scanDrawer.style.left = '-19%'
        },
        //loading效果
        loadingFun(target) {
            this.loading = this.$loading({
                target: target,
                lock: true,
                text: '正在加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });

        },
        //子组件已选择的平面数据
        sendPlane(data) {
            this.selecetPlane = data;
        },
        //子组件已选择的剖面数据
        sendSector(data) {
            this.selecetSector = data;
        },
        //子组件已选择的锥体数据
        sendCone(data) {
            this.selecetCone = data;
        },
        //返回图片链接
        reportImgUrl(base64, width, height) {
            return new Promise(resolve => {
                let img = new Image();
                img.width = width;
                img.height = height;
                img.src = 'data:image/png;base64,' + base64;
                let canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height
                let ctx = canvas.getContext("2d");
                let canvasToUrl = null;
                img.onload = function () {
                    ctx.drawImage(img, 0, 0, width, height);
                    canvasToUrl = canvas.toDataURL("image/png");
                    resolve(canvasToUrl)
                }
            })
        },
        //固定观测载体改变时查询观测位置
        staticMoveChange(val) {
            getPosition(val).then(res => {
                this.addressList = res.rows;
            })
        },
        addressChange(val) {
            listRecord({
                name: val,
                mode: 1
            }).then(res => {
                this.fixForm.savePath = res.rows[0].savePath;
            })
        },
        //固定模式确认按钮
        staticConfirm() {
            //查询载体的设备
            getMoveDevice({
                deviceMode: 1,
                moveId: this.carForm.device
            }).then(res => {
                this.devList = res.rows;

                getDevModel(this.devList[0].bizDeviceModelDto.id).then(res => {
                    this.factorList = res.data.factorList;
                    this.exhibitionForm.factorname = 0;
                    this.fixForm.deviceName = this.fixForm.deviceName ? this.fixForm.deviceName : this.devList[0].name
                    this.devName = this.fixForm.deviceName
                    if (this.fixForm.deviceName == this.devOptionList.leiDa) {
                        this.$refs.pcolorChart.createChart();
                        this.$refs.verticalChart.createChart();
                        if (this.verticalOption.yAxis.data.length > 0) {
                            this.$refs.verticalChart.clearChart()
                            this.verticalOption.yAxis.data = []
                            this.verticalOption.series.data = []
                        }
                        this.factorChange(this.exhibitionForm.factorname, true)

                    } else if (this.fixForm.deviceName == this.devOptionList.qiXiang) {

                    } else if (this.fixForm.deviceName == this.devOptionList.weiZhan) {
                        this.$refs.microStationChart.createChart()
                        this.$refs.microStationChart.chartResize()
                        this.fixForm.lidarID = this.fixForm.savePath
                        this.fixForm.startTime = this.carForm.startTime2
                        this.fixForm.endTime = this.carForm.endTime2
                        this.getMicroAirs(this.fixForm)
                    } else if (this.fixForm.deviceName == this.devOptionList.liJingPu) {
                        this.$refs.particleChart.createChart()
                        this.$refs.particleChart.chartResize()
                        this.fixForm.lidarID = this.fixForm.savePath
                        this.fixForm.startTime = this.carForm.startTime2
                        this.fixForm.endTime = this.carForm.endTime2
                        this.getDOPs(this.fixForm)
                    }
                })
            })
        },
        //右侧设备点击事件
        devClick(dev, index) {
            this.count = index
            this.devName = dev.name
            this.factorList = dev.bizDeviceModelDto.factorList;
            console.log(dev)
            this.exhibitionForm.factorname = 0;
            if (this.tabName == this.sailingModel) { // 走航

                if (dev.name == this.devOptionList.leiDa) {
                    console.log('雷达', dev.name)
                    this.$refs.particle.style.display = 'none'
                    this.$refs.microStation.style.display = 'none'
                    this.sailingForm.deviceName = dev.name;
                    this.getMovePics() //走航图
                    // this.planView() //二维图弹窗
                    this.closeCurve()
                } else if (dev.name == this.devOptionList.weiZhan) {
                    this.scalinglayer.clear();
                    this.map.remove(this.scalinglayer);
                    this.scanData = [];
                    this.filterScan = [];
                    this.selecetPlane = [];
                    this.selecetSector = [];
                    this.selecetCone = [];
                    console.log('微站', dev.name)
                    this.curveView()
                    this.$refs.particle.style.display = 'none'
                    this.$refs.microStation.style.display = 'block'
                    this.$refs.microStationChart.createChart()
                    this.$refs.microStationChart.chartResize()
                    this.sailingForm.lidarID = this.sailingForm.savePath
                    this.sailingForm.startTime = this.carForm.startTime
                    this.sailingForm.endTime = this.carForm.endTime
                    this.getMicroAirs(this.sailingForm)
                } else if (dev.name == this.devOptionList.liJingPu) {
                    console.log('粒径谱', dev.name)
                    this.curveView()
                    this.$refs.microStation.style.display = 'none'
                    this.$refs.particle.style.display = 'block'
                    // if(this.microStationOption.xAxis.data.length >0) {
                    //     this.$refs.microStationChart.clearChart()
                    // }
                    this.$refs.particleChart.createChart()
                    this.$refs.particleChart.chartResize()
                    this.sailingForm.lidarID = this.sailingForm.savePath
                    this.sailingForm.startTime = this.carForm.startTime
                    this.sailingForm.endTime = this.carForm.endTime
                    this.getDOPs(this.sailingForm)
                } else if (dev.name == this.devOptionList.qiXiang) {
                    console.log('气象五参', dev.name)
                }

            } else { // 固定
                let scanDrawer = document.querySelector('.scanDrawer');
                scanDrawer.style.left = '-19%'
                this.selecetPlane = []
                this.selecetSector = []
                this.selecetCone = []
                this.fixForm.deviceName = dev.name;
                if (dev.name == this.devOptionList.leiDa) {
                    let scanDrawer = document.querySelector('.scanDrawer');
                    scanDrawer.style.left = '0%'
                    // this.planView()
                    // this.staticConfirm()
                    this.$refs.pcolorChart.createChart();
                    this.$refs.verticalChart.createChart();
                    if (this.verticalOption.yAxis.data.length > 0) {
                        this.$refs.verticalChart.clearChart()
                        this.verticalOption.yAxis.data = []
                        this.verticalOption.series.data = []
                    }
                    this.factorChange(this.exhibitionForm.factorname, true)
                    this.scanView()
                    return
                } else if (dev.name == this.devOptionList.weiZhan) {
                    this.curveView()
                    this.$refs.particle.style.display = 'none'
                    this.$refs.microStation.style.display = 'block'
                    this.$refs.microStationChart.createChart()
                    this.$refs.microStationChart.chartResize()
                    this.fixForm.lidarID = this.fixForm.savePath
                    this.fixForm.startTime = this.carForm.startTime2
                    this.fixForm.endTime = this.carForm.endTime2
                    this.getMicroAirs(this.fixForm)
                } else if (dev.name == this.devOptionList.liJingPu) {
                    this.curveView()
                    this.$refs.microStation.style.display = 'none'
                    this.$refs.particle.style.display = 'block'
                    // if(this.microStationOption.xAxis.data.length >0) {
                    //     this.$refs.microStationChart.clearChart()
                    // }
                    this.$refs.particleChart.createChart()
                    this.$refs.particleChart.chartResize()
                    this.fixForm.lidarID = this.fixForm.savePath
                    this.fixForm.startTime = this.carForm.startTime2
                    this.fixForm.endTime = this.carForm.endTime2
                    this.getDOPs(this.fixForm)
                } else if (dev.name == this.devOptionList.qiXiang) {
                    this.curveView()
                    this.$refs.microStation.style.display = 'none'
                    this.$refs.particle.style.display = 'block'
                }
            }
        },
        // 粒径普
        getDOPs(params) {
            if (this.particleOption.xAxis.data.length > 0) {
                this.$refs.particleChart.clearChart()
            }
            getDOP(params).then((res) => {
                console.log('res', res)
                if (res.code == 200) {
                    let resData = res.obj.allData
                    resData.forEach((item, index) => {
                        this.particleOption.xAxis.data[index] = item.collectTime

                        this.particleOption.series[0].data[index] = item.pm1
                        this.particleOption.series[1].data[index] = item.pm10
                        this.particleOption.series[2].data[index] = item.pm25
                        this.particleOption.series[3].data[index] = item.pt0_5
                        this.particleOption.series[4].data[index] = item.pt0_75
                        this.particleOption.series[5].data[index] = item.pt1
                        this.particleOption.series[6].data[index] = item.pt1_3
                        this.particleOption.series[7].data[index] = item.pt1_5
                        this.particleOption.series[8].data[index] = item.pt2

                        this.particleOption.series[9].data[index] = item.pt2_5
                        this.particleOption.series[10].data[index] = item.pt3
                        this.particleOption.series[11].data[index] = item.pt4
                        this.particleOption.series[12].data[index] = item.pt5
                        this.particleOption.series[13].data[index] = item.pt6_5
                        this.particleOption.series[14].data[index] = item.pt8
                        this.particleOption.series[15].data[index] = item.pt10
                        this.particleOption.series[16].data[index] = item.pt12
                        this.particleOption.series[17].data[index] = item.pt14

                        this.particleOption.series[18].data[index] = item.pt16
                        this.particleOption.series[19].data[index] = item.pt18
                        this.particleOption.series[20].data[index] = item.pt20
                        this.particleOption.series[21].data[index] = item.pt22
                        this.particleOption.series[22].data[index] = item.pt25
                        this.particleOption.series[23].data[index] = item.pt30
                    })
                    this.picTime.start = this.particleOption.xAxis.data[0]
                    this.picTime.end = this.particleOption.xAxis.data[this.particleOption.xAxis.data.length - 1]

                    this.$refs.particleChart.init(res.code, resData.length)
                    this.$refs.particleChart.chartResize()
                }
            })
        },
        // 空气微站
        getMicroAirs(params) {
            if (this.microStationOption.xAxis.data.length > 0) {
                this.$refs.microStationChart.clearChart()
            }
            getMicroAir(params).then((res) => {
                if (res.code == 200) {
                    let resData = res.obj.allData
                    resData.forEach((item, index) => {
                        this.microStationOption.xAxis.data[index] = item.collectTime

                        this.microStationOption.series[0].data[index] = item.co
                        this.microStationOption.series[1].data[index] = item.no2
                        this.microStationOption.series[2].data[index] = item.o3
                        this.microStationOption.series[3].data[index] = item.pm10
                        this.microStationOption.series[4].data[index] = item.pm25
                        this.microStationOption.series[5].data[index] = item.so2
                        this.microStationOption.series[6].data[index] = item.humidity
                        this.microStationOption.series[7].data[index] = item.temper
                        this.microStationOption.series[8].data[index] = item.pressure
                    })
                    this.picTime.start = this.microStationOption.xAxis.data[0]
                    this.picTime.end = this.microStationOption.xAxis.data[this.microStationOption.xAxis.data.length - 1]

                    this.$refs.microStationChart.init(res.code, resData.length)
                    this.$refs.microStationChart.chartResize()
                }
            })
        },
        //雷达垂直数据
        lidarPcolorpic(params, canvas) {

            if (this.pcolorOption.xAxis.data.length > 0) {
                this.$refs.pcolorChart.clearChart()
                this.pcolorOption.xAxis.data = []
                this.pcolorOption.yAxis.min = 0
                this.pcolorOption.yAxis.max = 0
                canvas.style.backgroundImage = 'none';
            }
            getStaticSky(params).then(res => {
                if (res.code == 200) {
                    let planDrawer = document.querySelector('.planDrawer');
                    // this.loadingFun(planDrawer)
                    planDrawer.style.bottom = '0.5%';
                    let bgUrl = 'data:image/png;base64,' + res.obj.strBase64[0].base64;
                    canvas.style.backgroundImage = 'url(' + bgUrl + ')';
                    this.ColorCard = 'data:image/png;base64,' + res.obj.barBase64;
                    this.picTime = {
                        start: res.obj.allDatetime[0],
                        end: res.obj.allDatetime[res.obj.allDatetime.length - 1]
                    }
                    this.pcolorOption.xAxis.data = res.obj.allDatetime;

                    // 默认第一次展示垂直扩线图
                    let x = this.pcolorOption.xAxis.data[0]
                    let y = 0
                    this.fixForm.currentFileTime = x
                    this.fixForm.currentHigh = y
                    this.fixForm.startTime = x
                    this.fixForm.endTime = this.pcolorOption.xAxis.data[this.pcolorOption.xAxis.data.length - 1]
                    this.getHorizontalVertical(this.fixForm)

                    this.pcolorOption.yAxis.min = (res.obj.highRes[0] / 1000).toFixed(1)
                    this.pcolorOption.yAxis.max = (res.obj.highRes[res.obj.highRes.length - 1] / 1000).toFixed(1)

                }
                this.$refs.pcolorChart.init(res.code, res.obj.allDatetime.length)
                that.$refs.pcolorChart.chartResize()
            })
            // this.loading.close()
            let that = this;
            window.onresize = function () {
                that.$refs.pcolorChart.chartResize()
            };
            // var config = this.$echarts.config;
            this.$refs.pcolorChart.chartGroup().getZr().on('click', 'series', this.chartClick)
        },
        //无人机确定按钮
        airborneConfirm() {},

        // 点击二维伪彩图显示的值
        getMouseDates(params) {
            getMouseDate(params).then(res => {
                if (res.code == 200) {
                    console.log('mouseDates', res)
                    this.mouseClickDates = res.obj.moveData[0].value
                }
            })
        }
    },
    mounted() {
        this.threedMap();
        let planContainer = document.querySelector('.planContainer');
        this.verticalWidth = planContainer.offsetWidth * 0.2 - this.$refs.imgs.offsetWidth + 'px'

        let planContainerChart = document.querySelector('.planContainerChart');
        this.pcolorWidth = planContainerChart.offsetWidth - 80 + 'px';
        this.pcolorHeight = planContainerChart.offsetHeight - 15 + 'px';
        this.tableMaxH = document.body.offsetHeight * 0.38

        this.$refs.pcolorChart.createChart();
        this.$refs.verticalChart.createChart();

    },
    beforeDestroy() {
        this.map && this.map.destroy();
    }
};
</script>

<style lang="scss">
.threeView {
    position: relative;

    #container {
        height: calc(100vh - 50px)
    }

    .BMap_cpyCtrl.BMap_noprint.anchorBL,
    .BMap_cpyCtrl.anchorBL {
        display: none;
    }

    .carDrawer {
        width: 384px;
        position: absolute;
        left: -384px;
        top: 5px;
        background: rgba(44, 44, 44, 0.9);
        // opacity: 0.8;
        max-height: 60%;
        color: white;
        padding: 0 10px 10px 10px;
        transition-duration: .5s;
        -webkit-transition-duration: .5s;
        border-radius: 5px;

        .carinfo {
            .el-form-item.el-form-item--mini {
                margin-bottom: 0 !important;
            }
        }
    }

    .amap-logo,
    .amap-copyright {
        display: none !important;
    }

    .monitorList {
        position: fixed;
        right: 5px;
        top: 100px;
        z-index: 9;

        .euip {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;

            .el-button {
                // width: 100%;
                margin-left: 0;
                background-color: rgba(44, 44, 44, 0.9);
                border: 0px;
                margin: 1px 0;
                color: white;
            }

            .el-button:hover {
                color: rgb(4, 252, 148);
            }
        }

        .dev {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;

            .el-button {
                // width: 100%;
                margin-left: 0;
                background-color: rgba(44, 44, 44, 0.9);
                border: 0px;
                margin: 1px 0;
                color: white;
            }

            .el-button.activeDev {
                background-color: #18A0FB;
            }

            .el-button:hover {
                color: rgb(4, 252, 148);
            }
        }

    }

    .scanDrawer {
        width: 18%;
        position: absolute;
        left: -19%;
        top: 64.5%;
        background-color: rgba(44, 44, 44, 0.9);
        max-height: 38%;
        color: white;
        padding: 0 10px 10px 10px;
        transition-duration: .5s;
        -webkit-transition-duration: .5s;
        border-radius: 5px;

    }

    .planDrawer,
    .microStation {
        width: 80%;
        height: 35%;
        // overflow: hidden;
        position: absolute;
        padding: 10px;
        background: rgba(44, 44, 44, 0.9);
        // opacity: 0.9;
        bottom: -35%;
        right: 5px;
        color: white;
        transition-duration: .5s;
        -webkit-transition-duration: .5s;
        border-radius: 5px;

        .planTop {
            position: relative;
            overflow: hidden;

            .topLeft {
                float: left;
            }

            .plantopRight {
                float: right;
                margin-right: 40px;

                .el-button {
                    background: #5B5A59;
                    color: white;
                    border: 0px solid #DCDFE6
                }
            }

            .closeTabs {
                position: absolute;
                right: 0px;
                top: 3px;

                .el-button--mini {
                    padding: 0 !important;

                    .el-icon-close {
                        font-size: 20px;
                        color: white;
                    }
                }
            }
        }

        .planContainer {
            height: calc(100% - 43px);
            margin-top: 5px;
            // overflow: hidden;
            opacity: 1;
            display: flex;
            // width: 80%;
            width: 100%;

            .planContainerChart {
                width: 80%;
                padding: 10px;
                background: #000;

                canvas {
                    background-size: 94.05% 82%;
                    background-position: 50% 15.5%;
                    background-repeat: no-repeat;
                }
            }
        }
    }

    .el-table--enable-row-hover .el-table__body tr:hover>td {
        background: none;
    }

    .el-table th.is-leaf,
    .el-table td {
        border: 0px solid;
    }

    .drawerBox {
        position: relative;

        .el-tabs__header.is-left {
            padding-top: 10px;
        }

        .el-tabs__item.is-top,
        .el-tabs__item.is-left {
            color: white;
            background: none;
        }

        .el-tabs__item.is-left {
            height: auto;
            // width: 16px;
            padding: 0;
            white-space: normal;
            text-align: center;
            padding-right: 10px;
        }

        .el-tabs__item.is-top.is-active,
        .el-tabs__item.is-left.is-active {
            color: #1890ff;
        }

        .el-form-item__label {
            color: white;
        }

        /* Safari */
        .flexright {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 10px;
        }

        .closeTabs {
            position: absolute;
            right: 0px;
            top: 7px;

            .el-button--mini {
                padding: 0 !important;

                .el-icon-close {
                    font-size: 20px;
                    color: white;
                }
            }
        }

        .el-form-item__content .el-input__inner {
            background: none;
            color: white !important;
        }

        .el-table,
        .el-table tr,
        .el-table tr th,
        .el-table .el-table__header-wrapper th,
        .el-table .el-table__fixed-header-wrapper th {
            background: none;
            // opacity: 0.7;
            color: white !important;
        }

        .el-table .el-table__header-wrapper th,
        .el-table .el-table__fixed-header-wrapper th {
            height: 28px;
        }

        .el-table::before {
            width: 0;
        }

        .el-table .cell {
            background: rgba(255, 255, 255, 0.1);
        }

        .el-table th.is-leaf {
            border: none;
            padding: 0;
            // background: rgba(0, 0, 0, 0.5);
        }

        .el-table th.is-leaf:nth-child(1) .cell {
            // border: none;
            border-radius: 4px 0 0 4px;
        }

        .el-table th.is-leaf:nth-child(2) .cell {
            // border: none;
            border-radius: 0px 4px 4px 0px;
        }

        .el-table .activeRow td .cell {
            background: #18A0FB;
        }

        .el-table .el-table__row td:nth-child(1) .cell {
            // border: none;
            border-radius: 4px 0 0 4px;
            height: 100%;
        }

        .el-table .el-table__row td:nth-child(2) .cell {
            // border: none;
            border-radius: 0px 4px 4px 0px;
            height: 100%;
        }

        .el-table tr.el-table__row {
            cursor: pointer;
            border-radius: 4px;
            height: 28px !important;
        }

        .el-table tr.el-table__row td {
            padding: 0;
        }

        .el-table tr.el-table__row th {
            background: rgba(44, 44, 44, 0.1);
            // background:none
        }

        /* 设置滚动条的样式 */
        .el-table__body-wrapper.is-scrolling-none::-webkit-scrollbar {
            width: 14px;
        }

        /* 滚动槽 */
        .el-table__body-wrapper.is-scrolling-none::-webkit-scrollbar-track {
            -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
            border-radius: 8px;
        }

        /* 滚动条滑块 */
        .el-table__body-wrapper.is-scrolling-none::-webkit-scrollbar-thumb {
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.3);
            -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
        }

        .el-table__body-wrapper.is-scrolling-none::-webkit-scrollbar-thumb:window-inactive {
            background: rgba(255, 255, 255, 0.4);
        }

        .el-select-dropdown,
        .el-input__inner,
        .el-scrollbar__view.el-select-dropdown__list {
            border: 1px solid white;
        }

        .el-select-dropdown__item {
            color: white;
        }

        .el-select-dropdown__item.hover,
        .el-select-dropdown__item:hover {
            background-color: #1890ff;
            color: white;
        }
    }
}
</style>
