<!--
 * @Author: your name
 * @Date: 2021-04-27 09:13:00
 * @LastEditTime: 2021-10-09 14:34:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MoveDapWebUi\src\views\index.vue
-->
<template>
<div style="position:relative">
    <div id="container" @click.stop />
    <div class="monitorList">
        <el-row :gutter="10" v-if="markerOpen">
            <el-radio-group v-model="factorValue" size="mini">
                <el-radio-button type="primary" v-for="(item,index) in factorList" :key="index" :label="item.value">{{item.name}}</el-radio-button>
            </el-radio-group>
        </el-row>
        <div :gutter="10" style="margin-top:20px;" class="el-factor">
            <el-checkbox-button type="primary" size="mini" v-for="(item,index) in siteList" :key="index" :label="item.value" v-model="item.checked" @change="factorCheck(item)">{{item.name}}</el-checkbox-button>
        </div>
    </div>

    <div class="stationInfo" v-show="stationOpen">
        <div style="color:white">{{title}}</div>
        <div style="color:white;padding:5px 0;font-size:12px"><span>{{stationUpdatetime}}更新</span></div>
        <!-- <div class="closeTabs">
            <el-button type="text" icon="el-icon-close" size="mini" style="float:right;" @click="stationOpen = false"></el-button>
        </div> -->
        <div class="dialogContainer">
            <el-radio-group style="display: flex;flex-direction: row;justify-content: space-around;border-top:#aaa 1px solid" v-model="stationFactor" size="mini">
                <div v-for="item in factorList" :key="item.value" style="margin:5px 1px 0px 1px;">
                    <div :style="'background:'+getColor(item.dictValue,factorMapping[item.value])" style="height:30px;text-align:center;font-size:16px;font-weight:700;color:#333;line-height:30px;border-radius:3px 3px 0 0;border:none">{{item.dictValue || '-'}}</div>
                    <el-radio-button :label="item.value" style="width:100%;overflow:hidden;text-align:center">{{item.name}}</el-radio-button>
                </div>
            </el-radio-group>
            <el-row :gutter="10" style="color:white;font-size:14px;margin:3px 0">
                <el-col :span="8">
                    <div>温度:{{meteData.temperature||'-'}}℃</div>
                    <div>湿度:{{meteData.humidity||'-'}}%</div>
                </el-col>
                <el-col :span="8">
                    <div>天气:{{meteData.weather||'-'}}</div>
                    <div>风向:{{meteData.winddirection||'-'}}</div>
                </el-col>
                <el-col :span="8">
                    <div>风级:{{meteData.windpower||'-'}}</div>
                </el-col>
            </el-row>
            <chart chartId="stationChart" ref="stationChart" :chartOptions="stationOption" width="100%" height="170px" />
        </div>
    </div>
    <div style="position:fixed;bottom:1%;left:5%; width:90%" class="timeFooter">
        <el-row :gutter="10">
            <el-col :span="2">
                <el-select v-model="selectDay" placeholder="请选择" size="mini">
                    <el-option v-for="item in dayData" :key="item.getTime()" :label="getTimeString(item).slice(0,10)" :value="Math.floor(item.getTime()/1000000)">
                        {{getTimeString(item).slice(0,10)}}
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="markerOpen?18:21">
                <el-row>
                    <el-row>
                        <el-col :span="24" style="position:relative">
                            <el-row style="width:100%;position:absolute;top:0;z-index:99">
                                <el-col :span="1" v-for="(item,index) in hourList" :key="index" style="height:10px;cursor: pointer;">
                                    <el-tooltip class="item" effect="dark" :content="item+':00'" placement="top-start">
                                        <div style="height:100%;width:100%" @click="handelProgress(item)"></div>
                                    </el-tooltip>
                                </el-col>
                            </el-row>
                            <div style="width:100%;background:#bbb;height:10px;opacity:0.7;">
                                <div style="height:10px;background:#111;transition: all 1s" :style="'width:'+ new Date().getHours() * (100/24)+'%'" ref="progress"></div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-col :span="1" v-for="item in hourList" :key="item">
                        <div style="height:10px;border-left:1px solid #eee;"></div>
                        <div style="text-align:center;font-size:14px">{{item}}</div>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="1">
                <el-button type="text" size="mini" @click="refresh"><i class="el-icon-refresh"></i><br>刷新</el-button>
            </el-col>
            <el-col :span="3" style="height:100%" v-if="markerOpen">
                <div style="height:100%;overflow:hidden;padding:5px;background:rgba(0,0,0,.7)">
                    <div v-for="(item,index) in colorCodes" :key="index" style="float:left;width:16.66%">
                        <div :style="'background:'+ item.color" style="width:100%;height:10px"></div>
                        <div style="color:white;font-size:12px">{{item.grade}}</div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</div>
</template>

<script>
import Chart from '@/components/chart/index'
import {
    getLastOption
} from '@/api/index'
import axios from 'axios';
import GPS from '@/utils/gpstoGD';
export default {
    name: "index",
    components: {
        Chart
    },
    data() {
        return {
            //国控点数据
            controlpoint: [],
            //地图
            map: null,
            //卫星图层
            satellite: null,
            //路网图层
            roadNet: null,
            //标注
            markers: [],
            dayData: [new Date(Date.now()), new Date(Date.now() - 3600 * 1000 * 24), new Date(Date.now() - 3600 * 1000 * 48)],
            selectDay: Math.floor(new Date(Date.now()).getTime() / 1000000),
            hourList: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
            //站点弹出框
            stationOpen: false,
            //因子
            stationFactor: 'aqi',
            drawer: false,
            title: '',
            //环境因子列表
            factorList: [{
                name: 'AQI',
                value: 'aqi'
            }, {
                name: 'CO',
                value: 'co'
            }, {
                name: 'SO2',
                value: 'so2'
            }, {
                name: 'NO2',
                value: 'no2'
            }, {
                name: 'O3',
                value: 'o3'
            }, {
                name: 'PM2.5',
                value: 'pm2_5'
            }, {
                name: 'PM10',
                value: 'pm10'
            }],
            //气象因子列表
            siteList: [{
                name: '风场',
                value: 'windfarm',
                checked: false
            }, {
                name: '气温',
                value: 'temp',
                checked: false
            }, {
                name: '湿度',
                value: 'humidity',
                checked: false
            }, {
                name: '气压',
                value: 'pressure',
                checked: false
            }, {
                name: '降水',
                value: 'precipitation',
                checked: false
            }, {
                name: '能见度',
                value: 'visibility',
                checked: false
            }, {
                name: '总云量',
                value: 'cloudiness',
                checked: false
            }],
            //气象数据
            meteData: {},
            //默认因子值
            factorValue: 'aqi',
            factorMapping: {
                co: [{
                    min: 0,
                    max: 2,
                    label: '0-2',
                    color: '#00FF00'
                }, {
                    min: 2,
                    max: 4,
                    label: '2-4',
                    color: '#FFFF00'
                }, {
                    min: 4,
                    max: 14,
                    label: '4-14',
                    color: '#FFA500'
                }, {
                    min: 14,
                    max: 24,
                    label: '14-24',
                    color: '#FF0000'
                }, {
                    min: 24,
                    max: 36,
                    label: '24-36',
                    color: '#A020F0'
                }, {
                    min: 36,
                    label: '>36',
                    color: '#B03060'
                }],
                so2: [{
                    min: 0,
                    max: 50,
                    label: '0-50',
                    color: '#00FF00'
                }, {
                    min: 50,
                    max: 150,
                    label: '50-150',
                    color: '#FFFF00'
                }, {
                    min: 150,
                    max: 475,
                    label: '150-475',
                    color: '#FFA500'
                }, {
                    min: 475,
                    max: 800,
                    label: '475-800',
                    color: '#FF0000'
                }, {
                    min: 800,
                    max: 1600,
                    label: '800-1600',
                    color: '#A020F0'
                }, {
                    min: 1600,
                    label: '>1600',
                    color: '#B03060'
                }],
                no2: [{
                    min: 0,
                    max: 40,
                    label: '0-40',
                    color: '#00FF00'
                }, {
                    min: 40,
                    max: 80,
                    label: '40-80',
                    color: '#FFFF00'
                }, {
                    min: 80,
                    max: 180,
                    label: '80-180',
                    color: '#FFA500'
                }, {
                    min: 180,
                    max: 280,
                    label: '180-280',
                    color: '#FF0000'
                }, {
                    min: 280,
                    max: 565,
                    label: '280-565',
                    color: '#A020F0'
                }, {
                    min: 565,
                    label: '>565',
                    color: '#B03060'
                }],
                o3: [{
                    min: 0,
                    max: 160,
                    label: '0-160',
                    color: '#00FF00'
                }, {
                    min: 160,
                    max: 200,
                    label: '160-200',
                    color: '#FFFF00'
                }, {
                    min: 200,
                    max: 300,
                    label: '200-300',
                    color: '#FFA500'
                }, {
                    min: 300,
                    max: 400,
                    label: '300-400',
                    color: '#FF0000'
                }, {
                    min: 400,
                    max: 800,
                    label: '400-800',
                    color: '#A020F0'
                }, {
                    min: 800,
                    label: '>800',
                    color: '#B03060'
                }],
                pm2_5: [{
                    min: 0,
                    max: 35,
                    label: '0-35',
                    color: '#00FF00'
                }, {
                    min: 35,
                    max: 75,
                    label: '35-75',
                    color: '#FFFF00'
                }, {
                    min: 75,
                    max: 115,
                    label: '75-115',
                    color: '#FFA500'
                }, {
                    min: 115,
                    max: 150,
                    label: '115-150',
                    color: '#FF0000'
                }, {
                    min: 150,
                    max: 250,
                    label: '150-250',
                    color: '#A020F0'
                }, {
                    min: 250,
                    label: '>250',
                    color: '#B03060'
                }],
                pm10: [{
                    min: 0,
                    max: 50,
                    label: '0-50',
                    color: '#00FF00'
                }, {
                    min: 50,
                    max: 150,
                    label: '50-150',
                    color: '#FFFF00'
                }, {
                    min: 150,
                    max: 250,
                    label: '150-250',
                    color: '#FFA500'
                }, {
                    min: 250,
                    max: 350,
                    label: '250-350',
                    color: '#FF0000'
                }, {
                    min: 350,
                    max: 420,
                    label: '350-420',
                    color: '#A020F0'
                }, {
                    min: 420,
                    label: '>420',
                    color: '#B03060'
                }],
                aqi: [{
                    min: 0,
                    max: 50,
                    label: '0-50',
                    color: '#00FF00'
                }, {
                    min: 50,
                    max: 100,
                    label: '50-150',
                    color: '#FFFF00'
                }, {
                    min: 100,
                    max: 150,
                    label: '150-250',
                    color: '#FFA500'
                }, {
                    min: 150,
                    max: 200,
                    label: '250-350',
                    color: '#FF0000'
                }, {
                    min: 200,
                    max: 300,
                    label: '350-420',
                    color: '#A020F0'
                }, {
                    min: 300,
                    label: '>420',
                    color: '#B03060'
                }]
            },
            //国控点图表
            stationOption: {
                title: {
                    text: '',
                    top: 10,
                    left: 'center',
                    textStyle: {
                        fontWeight: 100,
                        color: '#fff'
                    }
                },
                backgroundColor: '#333',
                color: ['#3398DB'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '2%',
                    right: '2%',
                    bottom: '2%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    axisTick: {
                        alignWithLabel: true,
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    axisLabel: {
                        color: '#fff'
                    }
                },
                yAxis: {
                    type: 'value',
                    axisTick: {
                        // alignWithLabel: true,
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    axisLabel: {
                        color: '#fff'
                    }
                },
                series: {
                    name: '',
                    type: 'bar',
                    barWidth: '60%',
                    data: []
                }
            },
            //颜色映射
            colorCodes: [{
                    color: '#00FF00',
                    grade: '优'
                },
                {
                    color: '#FFFF00',
                    grade: '良'
                },
                {
                    color: '#FFA500',
                    grade: '轻度'
                },
                {
                    color: '#FF0000',
                    grade: '中度'
                },
                {
                    color: '#A020F0',
                    grade: '重度'
                },
                {
                    color: '#B03060',
                    grade: '严重'
                },
            ],
            loading: null,
            stationCode: null,
            stationUpdatetime: '',
            windLayer: null, //风场图层
            tempLayer: null, //气温图层
            humLayer: null, //湿度图层,
            markerOpen: true,
            geocoder: null, //逆地理编码
        };
    },
    watch: {
        factorValue: {
            deep: true, //深度监听
            immediate: true, //立即执行
            handler: function (newValue, oldValue) {
                if (oldValue != null) {
                    if (this.hour) {
                        this.getPoints(this.getTimeString(new Date(this.selectDay)).slice(0, 10) + ' ' + this.hour + ':00:00')
                    } else {
                        this.getPoints(this.getTimeString(new Date(this.selectDay)))
                    }
                }
            }
        },
        stationFactor: {
            deep: true, //深度监听
            immediate: true, //立即执行
            handler: function (newValue, oldValue) {
                if (oldValue != null) {
                    this.handelQuery(this.stationCode, this.lnglat)
                }
            }
        },
        selectDay: {
            deep: true, //深度监听
            immediate: true, //立即执行
            handler: function (newValue, oldValue) {
                if (oldValue != null) {
                    if (this.hour) {
                        this.getPoints(this.getTimeString(new Date(this.selectDay * 1000000)).slice(0, 10) + ' ' + this.hour + ':00:00')
                    } else {
                        this.getPoints(this.getTimeString(new Date(this.selectDay * 1000000)))
                    }
                }
            }
        }
    },
    created() {
        this.loadingFun()
    },
    methods: {
        planeMap() {
            let that = this
            //图片加载完毕的回调函数
            //所有关于地图的逻辑全部都在这个回调里面，
            // 保证高德地图加载完毕
            that.map = new AMap.Map("container", {
                zoom: 11, //级别
                viewMode: "2D", //使用2D视图
                resizeEnable: true
            });
            that.satellite = new AMap.TileLayer.Satellite({
                map: that.map,
            });
            that.roadNet = new AMap.TileLayer.RoadNet({
                map: that.map
            })
            AMap.plugin('AMap.Geocoder', function () {
                that.geocoder = new AMap.Geocoder();
            })
            // that.mapLoad()
        },
        //地图加载成功时
        mapLoad(openTip) {
            let that = this;
            that.map.on("complete", function () {
                that.loading.close();
                log.success("地图加载完成！");
                if (openTip) {
                    that.$message({
                        message: '已切换至实时模式',
                        type: 'success'
                    });
                }
                that.getPoints(that.getTimeString(new Date()))
                that.getCarOption();
            });
        },
        //获取国控点数据
        getPoints(date) {
            this.controlpoint = []
            axios.get('/point/stdControls/std_data/' + date).then(response => {
                this.controlpoint = response.data.result;
                this.handelAddmarker();
            })
        },
        //获取走航车数据并添加到地图上
        getCarOption() {
            getLastOption().then(res => {
                let carinfo = res.rows[0];
                var gps = GPS.gcj_encrypt(carinfo.latestLatitude, carinfo.latestLongitude)
                var marker = new AMap.Marker({
                    position: [117.1959, 31.7848],
                    title: carinfo.code,
                    // offset: new AMap.Pixel(0, 0),
                    anchor: 'bottom-center',
                    content: '<div><img style="width:32px;height:32px;" src="/car.png"/></div>',
                    extData: {
                        code: carinfo.code,
                        lnglat: [gps.lon, gps.lat],
                        time: carinfo.latestTime
                    }
                });
                let that = this
                this.geocoder.getAddress([carinfo.latestLongitude, carinfo.latestLatitude], function (status, result) {
                    if (status === 'complete' && result.regeocode) {
                        carinfo.address = result.regeocode.formattedAddress;
                        let carView = '<div class="carView"><div><span class="carviewItem">车牌号</span><span>' + carinfo.code + '</span></div><div><span class="carviewItem">最新走航时间</span><span>' + carinfo.latestTime + '</span></div><div><span class="carviewItem">最新走航位置</span><span>' + carinfo.address + '</span></div></div>';
                        var infoWindow = new AMap.InfoWindow({
                            position: [117.1959, 31.7848],
                            offset: new AMap.Pixel(-10, -65),
                            content: carView
                        });
                        marker.on('mouseover', function (e) {
                            infoWindow.open(that.map);
                        })
                        marker.on('mouseout', function () {
                            infoWindow.close();
                        })
                        that.map.add(marker)
                    }
                });
            })
        },
        //更改地图类型
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
        //气象因子选择事件
        factorCheck(item) {
            switch (item.value) {
                case this.siteList[0].value:
                    if (item.checked) {
                        this.getWinds()
                    } else {
                        this.windLayer.removeLayer()
                    }
                    break;
                case this.siteList[1].value:
                    if (item.checked) {
                        // this.getWinds()
                    } else {
                        // this.layer.removeLayer()
                    }
                    break;
                case this.siteList[2].value:
                    if (item.checked) {
                        // this.getWinds()
                    } else {
                        // this.layer.removeLayer()
                    }
                    break;
                case this.siteList[3].value:
                    if (item.checked) {
                        // this.getWinds()
                    } else {
                        // this.layer.removeLayer()
                    }
                    break;
                case this.siteList[4].value:
                    if (item.checked) {
                        // this.getWinds()
                    } else {
                        // this.layer.removeLayer()
                    }
                    break;
                case this.siteList[5].value:
                    if (item.checked) {
                        // this.getWinds()
                    } else {
                        // this.layer.removeLayer()
                    }
                    break;
                case this.siteList[6].value:
                    if (item.checked) {
                        // this.getWinds()
                    } else {
                        // this.layer.removeLayer()
                    }
                    break;

            }
        },
        //查询点击的国控点数据
        handelQuery(code, lnglat) {

            if (this.stationOption.series.data.length > 0) {
                this.$refs.stationChart.clearChart()
            }
            let that = this;
            this.meteData = {};

            var lnglatXY = lnglat; //地图上所标点的坐标
            this.geocoder.getAddress(lnglatXY, function (status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    //获得了有效的地址信息:
                    //即，result.regeocode.formattedAddress
                    var adcode = result.regeocode.addressComponent.adcode;
                    // console.log(new Date(), adcode)
                    axios.get('/point/metecontroller/mete_data?cityCode=' + adcode).then(res => {
                        that.meteData = res.data.result
                        // console.log(new Date(), res.data.result)
                    })
                }
            });

            axios.get('/point/stdControls/std_data/nata24', {
                params: {
                    currentDate: this.getTimeString(new Date()),
                    station_code: code
                }
            }).then(response => {
                var data = response.data.result;
                this.title = data[0].station;
                this.stationUpdatetime = data[0].pubtime
                this.factorList.forEach(item => {
                    item['dictValue'] = data[data.length - 1][item.value]
                })
                data.forEach((item, index) => {
                    this.stationOption.series.data[index] = item[this.stationFactor]
                    this.stationOption.xAxis.data[index] = item.pubtime.split(' ')[1]
                    this.stationOption.series.name = this.stationFactor.toUpperCase()
                    this.stationOption.title.text = '近24小时' + this.stationFactor.toUpperCase() + '变化趋势'
                })
                this.$nextTick(() => {
                    this.$refs.stationChart.init(200, 1)
                })
            })
        },
        //下方时间点击事件
        handelProgress(hour) {
            this.hour = hour
            this.$refs.progress.style.width = 100 / 24 * (parseInt(hour) + 1) + '%';
            this.getPoints(this.getTimeString(new Date(this.selectDay * 1000000)).slice(0, 10) + ' ' + hour + ':00:00')
            this.handelAddmarker()
        },
        //将国控点添加到地图上
        handelAddmarker() {
            if (this.markers.length > 0) {
                this.map.remove(this.markers)
                this.markers = []
            }
            var that = this

            this.controlpoint.forEach(item => {
                var marker = new AMap.Marker({
                    position: [item.longitude, item.latitude],
                    title: item.station,
                    // offset: new AMap.Pixel(0, 0),
                    anchor: 'bottom-center',
                    content: '<div style="background:' + this.getColor(item[this.factorValue], this.factorMapping[this.factorValue]) + ';padding:5px;border-radius: 3px;opacity:0.8">' + item[this.factorValue] + '</div>',
                    extData: {
                        code: item.station_code,
                        lnglat: [item.longitude, item.latitude],
                        factor: item[this.factorValue]
                    }
                });
                //标注点击事件

                marker.on('click', function (e) {
                    that.stationOpen = true;
                    that.$nextTick(() => {
                        let stationInfo = document.querySelector('.stationInfo')

                        var infoWindow = new AMap.InfoWindow({
                            position: [item.longitude, item.latitude],
                            offset: new AMap.Pixel(0, -35),
                            content: stationInfo
                        });

                        infoWindow.open(that.map);
                        that.$refs.stationChart.createChart()
                        that.$refs.stationChart.chartResize()
                        var btninner = document.querySelectorAll('.dialogContainer .el-radio-button__inner')
                        btninner.forEach(item => {
                            item.style.border = 'none';
                            item.style.borderRadius = '0 0 3px 3px'
                        })
                        that.stationCode = e.target._opts.extData.code
                        that.lnglat = e.target._opts.extData.lnglat
                        that.handelQuery(that.stationCode, that.lnglat)
                    })
                })
                this.markers.push(marker)
                this.map.add(marker)
            })
        },
        //国控点的显示
        markerShow() {
            this.markerOpen = true;
            this.map.add(this.markers)
        },
        //国控点的隐藏
        markerHide() {
            this.markerOpen = false;
            this.map.remove(this.markers)
        },
        //根据因子值返回国控点的颜色
        getColor(val, map) {
            if (val) {
                var color = null;
                map.filter((item) => {
                    if (item.min <= val && item.max > val) {
                        color = item.color
                    }
                })
                return color
            } else {
                return '#ccc'
            }
        },
        //时间字符串格式化
        getTimeString(nowTime) {
            var month = nowTime.getMonth() + 1 >= 10 ? nowTime.getMonth() + 1 : '0' + (nowTime.getMonth() + 1)
            var date = nowTime.getDate() >= 10 ? nowTime.getDate() : '0' + nowTime.getDate()
            var hours = nowTime.getHours() >= 10 ? nowTime.getHours() : '0' + nowTime.getHours()
            var time = nowTime.getFullYear() + '-' + month + '-' + date + ' ' + hours + ':00:00'
            return time
        },
        //刷新按钮
        refresh() {
            this.dayData = [new Date(Date.now()), new Date(Date.now() - 3600 * 1000 * 24), new Date(Date.now() - 3600 * 1000 * 48)];
            this.selectDay = Math.floor(new Date(Date.now()).getTime() / 1000000)
            this.handelProgress(new Date().getHours())
        },
        //风场
        getWinds() {
            const that = this;
            fetch('/wind/gfs.t18z.pgrb2.1p00.f000.json')
                .then(res => res.json())
                .then(res => {
                    //

                    const config = {
                        minVelocity: 0, // 粒子强度最小的速度 (m/s)
                        maxVelocity: 10, // 粒子强度最大的速度 (m/s)
                        velocityScale: 0.001, // 风速的比例
                        particleAge: 90, // 重绘之前生成的离子数量的最大帧数
                        lineWidth: 2, // 绘制粒子的线宽
                        paths: 1000
                    }

                    const map = that.map;
                    // const bounds = map.getBounds();
                    // console.log('bounds', bounds);

                    const AmapWind = require("amap-wind");
                    that.windLayer = new AmapWind.WindLayer(res, {
                        // projection: 'EPSG:4326',
                        zIndex: 20,
                        colorScale: 'rgba(0, 0, 255,.8)',
                        velocityScale: 1 / 30,
                        paths: 1000,
                        //bounds: bounds,
                    })
                    that.windLayer.updateParams(config);
                    that.windLayer.appendTo(map);
                });
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
            // setTimeout(() => {
            //     if (document.querySelector('div.el-loading-mask')) {
            //         this.loading.close();
            //         this.$message({
            //             type: 'waring',
            //             message: '请求失败，请重试'
            //         })
            //     }
            // }, 5000)
        },
    },
    mounted() {
        this.planeMap()
    },
    beforeDestroy() {
        this.map && this.map.destroy();
    }
};
</script>

<style lang="scss">
#container {
    height: calc(100vh - 50px);
}

.amap-logo,
.amap-copyright {
    display: none !important;
}

.monitorList {
    position: fixed;
    right: 10px;
    top: 100px;

    // overflow: hidden;
    .el-radio-group {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        width: 100%;

        .el-radio-button {
            width: 100%;

            .el-radio-button__inner {
                width: 100%;
                border: none;
                margin: 1px 0;
                border-radius: 4px;
                background-color: #000;
                opacity: 0.7;
                color: white;
            }

            .el-radio-button__inner:hover {
                color: rgb(4, 252, 148);
            }

            .el-radio-button__orig-radio:checked+.el-radio-button__inner {
                background-color: #1890ff;
                opacity: 1;
            }

            .el-radio-button:last-child .el-radio-button__inner,
            .el-radio-button:first-child .el-radio-button__inner {
                border-radius: 4px;
                background-color: #000;
            }
        }
    }

    .el-factor {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        width: 100%;

        .el-checkbox-button {
            width: 100%;

            .el-checkbox-button__inner {
                width: 100%;
                border: none;
                margin: 1px 0;
                border-radius: 4px;
                background-color: #000;
                opacity: 0.7;
                color: white;
                box-shadow: none;
                -webkit-box-shadow: none;
            }

            .el-checkbox-button__inner:hover {
                color: rgb(4, 252, 148);
            }

            .el-checkbox-button__original:checked+.el-checkbox-button__inner {
                background-color: #1890ff;
                opacity: 1;
            }

            .el-checkbox-button.is-checked .el-checkbox-button__inner {
                box-shadow: none;
                -webkit-box-shadow: none;
            }
        }
    }
}

.amap-info-content.amap-info-outer {
    background: #000;
    opacity: 0.8;
    padding-right: 10px;
}

.carView {
    color: white;

    .carviewItem {
        display: inline-block;
        width: 80px;
        color: #ccc;
    }
}

.amap-info-close:hover {
    color: white;
}

.stationInfo {
    // position: absolute;
    // z-index: 9999;
    width: 430px;
    height: 323px;

    .el-radio-button__inner {
        width: 100%;
        text-align: center;
    }
}

.timeFooter {
    .el-button {
        padding: 0;
        color: #000;

        .el-icon-refresh {
            font-size: 20px;
        }
    }

    .el-button:hover {
        color: #1890ff;
    }

    .el-select-dropdown__wrap.el-scrollbar__wrap {
        margin-bottom: -16px !important;
        margin-right: -16px !important;
    }

    .el-popper[x-placement^=top] .popper__arrow::after {
        border-top-color: #000;
        opacity: 0.7;
    }

    .el-select-dropdown,
    .el-select.el-select--mini .el-input__inner {
        border: 0px;
        background-color: #000;
        opacity: 0.7;
        color: white;
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
</style>
