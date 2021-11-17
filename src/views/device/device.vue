<template>
<div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="设备编号" prop="code">
            <el-input v-model="queryParams.code" placeholder="请输入设备编号" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="设备名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入设备名称" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="设备型号" prop="deivceModelId">
            <el-input v-model="queryParams.deivceModelId" placeholder="请输入设备型号" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>

        <el-form-item label="启用时间" prop="useTime">
            <el-date-picker clearable size="small" v-model="queryParams.useTime" type="date" value-format="yyyy-MM-dd" placeholder="选择启用时间">
            </el-date-picker>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['move:device:add']">新增</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
            <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['move:device:edit']">修改</el-button>
        </el-col>
        <el-col :span="1.5">
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['move:device:remove']">删除</el-button>
        </el-col> -->
        <el-col :span="1.5">
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['move:device:export']">导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="deviceList" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <!-- <el-table-column label="设备id" align="center" prop="id" /> -->
        <el-table-column label="设备编码" align="center" prop="code" />
        <el-table-column label="设备名称" align="center" prop="name" />
        <el-table-column label="设备型号" align="center" prop="deivceModelId" />
        <el-table-column label="设备描述" align="center" prop="description" />
        <el-table-column label="启用时间" align="center" prop="useTime" width="180">
            <template slot-scope="scope">
                <span>{{ parseTime(scope.row.useTime, '{y}-{m}-{d}') }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['move:device:edit']">修改</el-button>
                <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['move:device:remove']">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改设备管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">

            <el-form-item label="设备码" prop="code">
                <el-input v-model="form.code" placeholder="请输入设备编号" />
            </el-form-item>
            <el-form-item label="设备名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入设备名称" />
            </el-form-item>
            <!-- <el-form-item label="设备型号" prop="deivceModelId">
          <el-input v-model="form.deivceModelId" placeholder="请输入设备型号id" />
        </el-form-item> -->
            <el-form-item label="设备型号" prop="factory">
                <el-select v-model="form.deivceModelId" placeholder="请选择">
                    <el-option v-for="(item,index) in devModelList" :key="index" :label="item.chName" :value="item.id" :disabled="item.status == 1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="设备描述" prop="description">
                <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item label="启用时间" prop="useTime">
                <el-date-picker clearable size="small" v-model="form.useTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择启用时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="采集模式">
                <el-radio-group v-model="form.deviceMode">
                    <el-radio label="0">走航</el-radio>
                    <el-radio label="1">固定</el-radio>
                    <el-radio label="2">飞行模式</el-radio>
                    <el-radio label="3">走航及固定</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import {
    listDevice,
    getDevice,
    delDevice,
    addDevice,
    updateDevice,
    exportDevice
} from "@/api/move/device";
import {
    listDevModel
} from "@/api/move/devModel";
export default {
    name: "Device",
    components: {},
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 设备管理表格数据
            deviceList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                deivceModelId: null,
                code: null,
                name: null,
                description: null,
                useTime: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                deivceModelId: [{
                    required: true,
                    message: "设备型号id不能为空",
                    trigger: "blur"
                }],
                code: [{
                    required: true,
                    message: "设备编号不能为空",
                    trigger: "blur"
                }],
            },
            devModelList: []
        }
    },
    created() {
        this.getList();
        this.getDevModelList()
    },
    methods: {
        /** 查询设备管理列表 */
        getList() {
            this.loading = true;
            listDevice(this.queryParams).then(response => {
                this.deviceList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        /** 查询设备型号管理列表 */
        getDevModelList() {
            this.loading = true;
            listDevModel(this.queryParams).then(response => {
                this.devModelList = response.rows;
                // console.log('this.devModelList', this.devModelList)
                this.total = response.total;
                this.loading = false;
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                id: null,
                deivceModelId: null,
                code: null,
                name: null,
                description: null,
                useTime: null
            };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加设备管理";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            // console.log('row', row)
            this.reset();
            const id = row.id || this.ids
            getDevice(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改设备管理";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateDevice(this.form).then(response => {
                            this.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addDevice(this.form).then(response => {
                            this.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids;
            this.$confirm('是否确认删除设备管理编号为"' + ids + '"的数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return delDevice(ids);
            }).then(() => {
                this.getList();
                this.msgSuccess("删除成功");
            })
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;
            this.$confirm('是否确认导出所有设备管理数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return exportDevice(queryParams);
            }).then(response => {
                this.download(response.msg);
            })
        }
    }
};
</script>
