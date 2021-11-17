<!--
 * @Author: your name
 * @Date: 2021-06-22 09:23:40
 * @LastEditTime: 2021-09-26 14:11:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MoveDapWebUi\src\views\business\event\index.vue
-->
<template>
<div class="app-container">
    <el-row :gutter="20">
        <el-col :span="24" :xs="24">
            <el-form ref="form" :model="form" :inline="true" label-width="80px">
                <el-form-item label="所属客户">
                    <el-select v-model="form.deptId" placeholder="请选择" size="mini" clearable>
                        <el-option v-for="(item,index) in deptOptions" :value="item.deptId" :key="index" :label="item.deptName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addSailing" size="mini">新增记录</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
    <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:dept:add']">导出</el-button>
        </el-col>
    </el-row>
    <el-table :data="recordList" v-loading="loading" style="width: 100%">
        <el-table-column prop="deptName" label="所属客户" align="center">
        </el-table-column>
        <el-table-column prop="bizServiceName" label="服务目标" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="bizTaskName" label="计划任务" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="mode" label="监测模式" align="center">
            <template slot-scope="scope">
                <div>
                    <span>{{scope.row.mode==0?'走航':'固定'}}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="bizMoveCode" label="车辆/设备编号" align="center">
        </el-table-column>
        <el-table-column prop="name" label="走航名称" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="savePath" label="数据记录" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="beginTime" label="开始时间" align="center">
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" align="center">
        </el-table-column>
        <el-table-column prop="distance" label="总里程" align="center">
        </el-table-column>
        <el-table-column prop="uploadTime" label="最新位置" align="center">
            <template slot-scope="scope">
                <div>
                    <span>{{scope.row.endLongitude+'E '+scope.row.endLatitude+'N'}}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <div>
                    <el-button type="text" icon="el-icon-document-delete" @click="deletRecord(scope.row)">删除</el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="getList" />
    <el-dialog title="新增走航记录" :visible.sync="sailingOpen" width="600px" append-to-body>
        <el-form :model="sailingForm" ref="sailingform" :rules="rules" label-width="80px">
            <el-form-item label="所属客户" label-width="80px">
                <el-select v-model="dept" placeholder="请选择" size="mini" value-key="deptId" @change="deptIdChange">
                    <el-option v-for="(item,index) in deptOptions" :value="item" :key="index" :label="item.deptName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务目标" label-width="80px" prop="serviceId">
                <el-select v-model="sailingForm.serviceId" placeholder="请先选择所属客户" size="mini">
                    <el-option v-for="(item,index) in serviceList" :value="item.id" :key="index" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="计划任务" label-width="80px" prop="taskId">
                <el-select v-model="sailingForm.taskId" placeholder="请先选择服务目标" size="mini">
                    <el-option v-for="(item,index) in taskOptions" :value="item.id" :key="index" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="载体选择" label-width="80px" prop="moveId">
                <el-select v-model="move" placeholder="请选择" size="mini" value-key="id" @change="sailingForm.moveId = move.id">
                    <el-option v-for="dict in carrierList" :key="dict.id" :label="dict.decription" :value="dict"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="走航模式" label-width="80px" prop="mode">
                <el-select v-model="sailingForm.mode" placeholder="请选择" size="mini">
                    <el-option value="0" label="走航"></el-option>
                    <el-option value="1" label="固定"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="记录名称" label-width="80px" prop="name">
                <el-input v-model="sailingForm.name"></el-input>
            </el-form-item>
            <el-form-item label="关联数据" label-width="80px" v-if="sailingForm.deptId&&sailingForm.moveId&&sailingForm.mode" prop="savePath">
                <el-input v-model="sailingForm.savePath" disabled></el-input>
                <el-radio-group v-model="sailingForm.savePath">
                    <el-radio v-for="(item,index) in rootPath" :label="item.path" :key="index">
                        <el-tooltip class="item" effect="dark" :content="item.path" placement="top">
                            <span>{{item.label}}</span>
                        </el-tooltip>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="sailingOpen = false;sailingForm = {};dept={}">取 消</el-button>
            <el-button type="primary" @click="submitSailing">确 定</el-button>
        </div>
    </el-dialog>

</div>
</template>

<script>
import {
    listDept,
} from "@/api/business/service";
import {
    listMove
} from '@/api/move/move';

import {
    listDeptService,
    planCustomer
} from '@/api/mysevice/service'
import {
    listRecord,
    listPath,
    addRecord,
    exportRecord,
    deleteRecord
} from "@/api/business/sailing";
export default {
    name: "Sailing",
    components: {},
    data() {
        return {
            loading: true,
            //新增走航记录弹窗
            sailingOpen: false,
            //走航记录数据
            recordList: [],
            form: {
                pageNum:1,
                pageSize:10,
            },
            total:0,
            //所选客户
            dept: {},
            //所选载体
            move: {},
            //新增走航记录表单
            sailingForm: {
                serviceId: ''
            },
            //客户列表
            deptOptions: [],
            //任务列表
            taskOptions: [],
            //载体列表
            carrierList: [],
            //服务列表
            serviceList: [],
            //根路径
            rootPath: [],
            lenPaths: [],
            treePaths: [],
            //所选路径
            checkPath: '',
            rules: {
                deptId: [{
                    // required: true,
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
                    message: '请选择计划任务',
                    trigger: 'change'
                }],
                moveId: [{
                    required: true,
                    message: '请选择载体',
                    trigger: 'change'
                }],
                mode: [{
                    required: true,
                    message: '请选择模式',
                    trigger: 'change'
                }],
                name: [{
                    required: true,
                    message: '请填写记录名称',
                    trigger: 'blur'
                }],
                savePath:[{
                    required: true,
                    message: '请选择路径',
                    trigger: 'change'
                }]
            }
        };
    },
    computed: {
        serviceid() {
            return this.sailingForm.serviceId
        }
    },
    watch: {
        sailingForm: { //监听表单属性
            immediate: true,
            deep: true,
            handler: function (newVal, oldVal) {
                if (newVal.deptId && newVal.moveId && newVal.mode) {
                    let param = {
                        deptName: this.dept.deptName,
                        bizMoveCode: this.move.code,
                        mode: this.sailingForm.mode == 0 ? '走航' : '固定'
                    }
                    listPath(param).then(res => {
                        this.rootPath = [];
                        this.treeMap(res.rows)
                    })
                }
            }
        },
        serviceid(newVal, oldVal) {
            planCustomer({
                serviceId: newVal
            }).then(res => {
                this.taskOptions = res.rows;
            })
        },
    },
    created() {
        this.getList()
        listDept().then(response => {
            this.deptOptions = response.rows
        });
    },
    methods: {
        //获取走航记录数据
        getList(param) {
            this.loading = true
            listRecord(param).then(res => {
                this.recordList = res.rows;
                this.total = res.total
                this.loading = false;
            })
        },
        handleQuery() {
            this.getList(this.form)
        },
        resetQuery() {

        },
        //新增走航记录按钮
        addSailing() {
            listMove().then(res => {
                this.carrierList = res.rows;
            });
            this.sailingOpen = true;
        },
        deptIdChange(val){
            this.sailingForm.deptId = val.deptId;
            listDeptService(val.deptId).then((res)=>{
                this.serviceList = res.rows;
            })
        },
        //删除走航记录
        deletRecord(row) {
            this.$confirm('是否确认删除名称为"' + row.name + '"的记录?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return deleteRecord(row.id);
            }).then(() => {
                this.getList();
                this.msgSuccess("删除成功");
            })
        },
        treeMap(pathArr) {
            let arr = [];
            pathArr.forEach((item, index) => {
                let lenpath = item.split('\\').pop();
                let obj = {
                    label: lenpath,
                    path: item
                }
                arr.push(obj)
                if (index == pathArr.length - 1) {
                    this.rootPath = arr;
                }
            })
        },
        //提交新增的走航记录
        submitSailing() {
            this.$refs['sailingform'].validate((valid) => {
                if (valid) {
                    addRecord(this.sailingForm).then(res => {
                        this.sailingOpen = false;
                        this.getList()
                        this.$message({
                            type: 'sucess',
                            message: '新增成功'
                        });
                        this.sailingForm = {};
                        this.dept = {};
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: '内容未填写完整'
                    });
                    return false;
                }
            });
        },
        handleExport(){
            this.$confirm('是否确认导出所有走航数据?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return exportRecord();
            }).then(response => {
                this.download(response.msg);
            })
        }
    }
};
</script>

<style>
.map {
    width: 100%;
    height: 400px;
}
</style>
