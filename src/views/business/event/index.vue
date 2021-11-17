<!--
 * @Author: your name
 * @Date: 2021-06-22 09:23:40
 * @LastEditTime: 2021-09-09 17:49:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MoveDapWebUi\src\views\business\event\index.vue
-->
<template>
<div class="app-container">
    <el-row :gutter="20">
        <el-col :span="24" :xs="24">
            <el-form ref="form" :model="form" :inline="true" label-width="80px">
                <el-form-item label="时间范围">
                    <el-radio-group v-model="timeUnit" size="mini" clearable>
                        <el-radio-button label="1">今天</el-radio-button>
                        <el-radio-button label="7">7天</el-radio-button>
                        <el-radio-button label="30">1个月</el-radio-button>
                        <el-radio-button label="self">自定义</el-radio-button>
                    </el-radio-group>

                    <el-date-picker v-if="timeUnit == 'self'" v-model="daterange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" size="mini">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="污染类型">
                    <el-select v-model="form.pollutionType" placeholder="请选择" size="mini" clearable>
                        <el-option v-for="dict in eventTypes" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="事件状态">
                    <el-select v-model="form.status" placeholder="清选择" size="mini" clearable>
                        <el-option label="未确认" :value="0"></el-option>
                        <el-option label="已确认" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属客户">
                    <el-select v-model="form.deptId" placeholder="请选择" size="mini" clearable>
                        <el-option v-for="(item,index) in deptOptions" :value="item.deptId" :key="index" :label="item.deptName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上报人">
                    <el-select v-model="form.uploadBy" placeholder="请选择" clearable>
                        <el-option v-for="item in userOptions" :key="item.userId" :label="item.userName" :value="item.userName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="reportOpen = true" size="mini" v-hasPermi="['move:event:add']">事件上报</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
    <el-table :data="data" v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="事件名称" align="center">
        </el-table-column>
        <el-table-column prop="deptName" label="所属客户" align="center">
        </el-table-column>
        <el-table-column prop="taskName" label="所属任务" align="center">
        </el-table-column>
        <el-table-column prop="uploadTime" label="上报时间" align="center" width="150px">
        </el-table-column>
        <el-table-column prop="location" label="位置" align="center">
        </el-table-column>
        <el-table-column prop="pollutionType" label="事件类型" align="center" :formatter="typeFormat">
        </el-table-column>
        <el-table-column prop="pollutionDecription" label="事件描述" align="center">
        </el-table-column>
        <el-table-column label="图片" align="center">
            <template slot-scope="scope">
                <div>
                    <el-image style="width: 100px; height: 100px" :src="scope.row.imagePathList[0]" :preview-src-list="scope.row.imagePathList">
                    </el-image>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="uploadBy" label="上报人" align="center">
        </el-table-column>
        <el-table-column prop="status" label="事件状态" align="center">
            <template slot-scope="scope">
                <div>
                    <span v-if="scope.row.status == 0">未确认</span>
                    <span v-else-if="scope.row.status == 1">已确认</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="visible" label="客户可见" align="center" :formatter="visiableFormat" />
        <el-table-column label="操作" align="center" width="250px">
            <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['move:event:edit']" @click="handleUpdate(scope.row)">修改</el-button>
                <el-button size="mini" type="text" icon="el-icon-view" v-hasPermi="['system:dept:remove']">查看记录</el-button>
            </template>
        </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="getList" />
    <el-dialog title="事件上报" :visible.sync="reportOpen" width="600px" append-to-body>
        <el-form :model="reportForm" ref="reportForm" :rules="rules" label-width="80px">
            <el-form-item label="事件名称" label-width="80px" prop="name">
                <el-input v-model="reportForm.name"></el-input>
            </el-form-item>
            <el-form-item label="所属客户" label-width="80px" prop="deptId">
                <el-select v-model="reportForm.deptId" placeholder="请选择" size="mini">
                    <el-option v-for="(item,index) in deptOptions" :value="item.deptId" :key="index" :label="item.deptName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务目标" label-width="80px" prop="serviceId">
                <el-select v-model="reportForm.serviceId" placeholder="请选择" size="mini">
                    <el-option v-for="(item,index) in serviceList" :value="item.id" :key="index" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属任务" label-width="80px" prop="taskId">
                <el-select v-model="reportForm.taskId" placeholder="请选择" size="mini">
                    <el-option v-for="(item,index) in taskOptions" :value="item.id" :key="index" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="位置" label-width="80px" prop="location">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-input v-model="reportForm.location" placeholder=""></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" @click="mapOpen = true">点击获取位置</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item label="经度" label-width="80px">
                        <el-input v-model="reportForm.longitude"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="纬度" label-width="80px">
                        <el-input v-model="reportForm.latitude"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="事件类型" label-width="80px" prop="pollutionType">
                <el-select v-model="reportForm.pollutionType" placeholder="请选择" size="mini">
                    <el-option v-for="dict in eventTypes" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="事件描述" label-width="80px">
                <el-input v-model="reportForm.pollutionDecription"></el-input>
            </el-form-item>
            <el-form-item label="图片" label-width="80px" prop="fileList">
                <el-upload :action="fieldAction" :headers="requestHeader" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-success="reportSucess" :on-remove="handleRemove" @change="upChange">
                    <i class="el-icon-plus"></i>
                </el-upload>

            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="reportOpen = false">取 消</el-button>
            <el-button type="primary" @click="handleReport">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog title="事件记录修改" :visible.sync="updateOpen" width="600px" append-to-body>
        <el-form :model="updateForm" label-width="80px">
            <el-form-item label="事件名称">
                <el-input v-model="updateForm.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="所属客户" label-width="80px">
                <el-select v-model="updateForm.deptId" placeholder="请选择" size="mini">
                    <el-option v-for="(item,index) in deptOptions" :value="item.deptId" :key="index" :label="item.deptName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务目标" label-width="80px">
                <el-select v-model="reportForm.serviceId" placeholder="请选择" size="mini">
                    <el-option v-for="(item,index) in serviceList" :value="item.id" :key="index" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属任务" label-width="80px">
                <el-select v-model="updateForm.taskId" placeholder="请选择" size="mini">
                    <el-option v-for="(item,index) in taskOptions" :value="item.id" :key="index" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="事件状态">
                <el-select v-model="updateForm.status" placeholder="清选择" size="mini">
                    <el-option label="未确认" :value="0"></el-option>
                    <el-option label="已确认" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="客户可见">
                <el-radio-group v-model="updateForm.visible">
                    <el-radio v-for="dict in visibleOption" :key="dict.dictValue" :label="parseInt(dict.dictValue)">{{dict.dictLabel}}</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="updateOpen = false">取 消</el-button>
            <el-button type="primary" @click="subUpdate">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog title="选择地址" :visible.sync="mapOpen" append-to-body>
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
    listDept,
} from "@/api/business/service";
import {
    eventReport,
    getEvents,
    eventInfo,
    eventUpdate,
} from "@/api/business/event";
import {
    listDeptService,
    planCustomer
} from '@/api/mysevice/service'
import {
    listUserops
} from '@/api/system/user'
const baseUrl = process.env.VUE_APP_BASE_API;
export default {
    name: "Event",
    components: {},
    data() {
        return {
            total: 0,
            timeUnit: null,
            daterange: [],
            loading: true,
            requestHeader: {},
            fieldAction: baseUrl + '/common/upload',
            dialogImageUrl: '',
            dialogVisible: false,
            reportOpen: false,
            data: [],
            form: {
                pageNum: 1,
                pageSize: 10
            },
            reportForm: {
                bizEventImageList: []
            },
            eventTypes: [],
            deptOptions: [],
            mapOpen: false,
            map: {
                center: {
                    lng: 117.448459,
                    lat: 31.797296
                },
                zoom: 19,
                show: true,
                dragging: true
            },
            taskOptions: [],
            userOptions: [],
            //服务列表
            serviceList: [],
            fileList: [],
            updateOpen: false,
            updateForm: {
                visible: 0
            },
            visibleOption: [],
            rules: {
                deptId: [{
                    required: true,
                    message: '请选择所属客户',
                    trigger: 'change'
                }],
                serviceId: [{
                    required: true,
                    message: '请选择服务目标',
                    trigger: 'change'
                }],
                taskId: [{
                    required: true,
                    message: '请选择所属任务',
                    trigger: 'change'
                }],
                location: [{
                    required: true,
                    message: '请填写详细位置',
                    trigger: 'blur'
                }],
                pollutionType: [{
                    required: true,
                    message: '请选择事件类型',
                    trigger: 'change'
                }],
                // fileList: [{
                //     required: true,
                //     message: '请上传图片',
                //     trigger: 'change'
                // }],
                name: [{
                    required: true,
                    message: '请填写事件名称',
                    trigger: 'blur'
                }]
            }
        };
    },
    computed: {
        serviceid() {
            return this.reportForm.serviceId
        },
        deptid() {
            return this.reportForm.deptId
        },
        updeptid() {
            return this.updateForm.deptId
        },
        upserviceid() {
            return this.updateForm.serviceId
        },
    },
    watch: {
        serviceid(newVal, oldVal) {
            planCustomer({
                serviceId: newVal
            }).then(res => {
                this.taskOptions = res.rows;
            })
        },
        deptid(newVal) {
            listDeptService(newVal).then((res) => {
                this.serviceList = res.rows;
            })
        },
        updeptid(newVal) {
            listDeptService(newVal).then((res) => {
                this.serviceList = res.rows;
            })
        },
        upserviceid(newVal, oldVal) {
            planCustomer({
                serviceId: newVal
            }).then(res => {
                this.taskOptions = res.rows;
            })
        },
    },
    created() {
        this.getList()
        //查询事件类型状态字典
        this.getDicts("move_pollution_type").then(response => {
            this.eventTypes = response.data;
        });
        this.getDicts("move_visible_type").then(response => {
            this.visibleOption = response.data;
        });
        listDept().then(response => {
            this.deptOptions = response.rows
        });
        listUserops().then(response => {
            this.userOptions = response.rows
        });
        this.requestHeader['Authorization'] = 'Bearer ' + this.$cookies.get('Admin-Token');
    },
    methods: {
        getList() {
            this.loading = true;
            getEvents(this.form).then(res => {
                this.data = res.rows
                this.total = res.total
                this.loading = false;
            })
        },
        // 字典状态字典翻译
        typeFormat(row, column) {
            return this.selectDictLabel(this.eventTypes, row.pollutionType);
        },
        // 字典状态字典翻译
        visiableFormat(row, column) {
            return this.selectDictLabel(this.visibleOption, row.visible);
        },
        handleQuery() {
            if (this.timeUnit) {
                let date = new Date().getTime()
                if (this.timeUnit == '1') {
                    this.form.startTime = new Date(date - 86400000).getFullYear() + '-' + (new Date(date - 86400000).getMonth() + 1) + '-' + (new Date(date - 86400000).getDate()) + ' ' + new Date(date - 86400000).getHours() + ':' + new Date(date - 86400000).getMinutes() + ':' + new Date(date - 86400000).getSeconds()
                    this.form.endTime = new Date(date).getFullYear() + '-' + (new Date(date).getMonth() + 1) + '-' + new Date(date).getDate() + ' ' + new Date(date).getHours() + ':' + new Date(date).getMinutes() + ':' + new Date(date).getSeconds()
                } else if (this.timeUnit == '7') {
                    this.form.startTime = new Date(date - (7 * 86400000)).getFullYear() + '-' + (new Date(date - (7 * 86400000)).getMonth() + 1) + '-' + (new Date(date - (7 * 86400000)).getDate()) + ' ' + new Date(date - (7 * 86400000)).getHours() + ':' + new Date(date - (7 * 86400000)).getMinutes() + ':' + new Date(date - (7 * 86400000)).getSeconds()
                    this.form.endTime = new Date(date).getFullYear() + '-' + (new Date(date).getMonth() + 1) + '-' + new Date(date).getDate() + ' ' + new Date(date).getHours() + ':' + new Date(date).getMinutes() + ':' + new Date(date).getSeconds()
                } else if (this.timeUnit == '30') {
                    this.form.startTime = new Date(date - (30 * 86400000)).getFullYear() + '-' + (new Date(date - (30 * 86400000)).getMonth() + 1) + '-' + (new Date(date - (30 * 86400000)).getDate()) + ' ' + new Date(date - (30 * 86400000)).getHours() + ':' + new Date(date - (30 * 86400000)).getMinutes() + ':' + new Date(date - (30 * 86400000)).getSeconds()
                    this.form.endTime = new Date(date).getFullYear() + '-' + (new Date(date).getMonth() + 1) + '-' + new Date(date).getDate() + ' ' + new Date(date).getHours() + ':' + new Date(date).getMinutes() + ':' + new Date(date).getSeconds()
                } else if (this.timeUnit == 'self') {
                    this.form.startTime = this.daterange[0]
                    this.form.endTime = this.daterange[1]
                }
            }
            this.getList()
        },
        resetQuery() {

        },
        handleRemove(file, fileList) {
            this.reportForm.bizEventImageList = fileList
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        reportSucess(response, file, fileList) {
            this.fileList = fileList
            console.log(this.fileList)
            this.reportForm.bizEventImageList.push({
                imagePath: response.url
            })
        },
        upChange(file) {
            console.log(file)
        },
        handlerMap({
            BMap,
            map
        }) {
            let that = this;

            // 鼠标缩放
            map.enableScrollWheelZoom(true);
            // 点击事件获取经纬度
            map.addEventListener('click', function (e) {
                var markers = map.getOverlays();
                markers.forEach((item) => {
                    map.removeOverlay(item);
                })
                var point = new BMap.Point(e.point.lng, e.point.lat);
                var geoc = new BMap.Geocoder(); //地址解析对象
                var marker = new BMap.Marker(point); // 创建标注    
                map.addOverlay(marker);
                that.reportForm.longitude = e.point.lng;
                that.reportForm.latitude = e.point.lat;
                that.mapOpen = false
                that.$message({
                    message: "经度:" + e.point.lng + "," + "纬度:" + e.point.lat,
                    type: 'success'
                });
            })
        },
        handleReport() {
            if (this.reportForm.bizEventImageList.length > 0) {
                this.$refs['reportForm'].validate(valid => {
                    if (valid) {
                        eventReport(this.reportForm).then(res => {
                            this.reportOpen = false
                            this.$message({
                                message: "上传成功",
                                type: 'success'
                            });
                            this.getList()
                        })
                    }
                })
            } else {
                this.$message({
                    message: '请上传图片',
                    type: 'warning'
                })
            }
        },
        handleUpdate(row) {
            let id = row.id
            eventInfo(id).then(res => {
                this.updateForm = res.data
            })
            this.updateOpen = true
        },
        subUpdate() {
            eventUpdate(this.updateForm).then(res => {
                this.updateOpen = false
                this.$message({
                    message: "修改成功",
                    type: 'success'
                });
                this.getList()
            })
        }
    }
};
</script>

<style>

</style><style>
.map {
    width: 100%;
    height: 400px;
}

.map .anchorBL {
    display: none !important;
}
</style>
