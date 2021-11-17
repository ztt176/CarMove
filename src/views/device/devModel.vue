<template>
<div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="型号名称" prop="enName">
            <el-input v-model="queryParams.enName" placeholder="请输入型号名称" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="型号名称" prop="chName">
            <el-input v-model="queryParams.chName" placeholder="请输入型号名称" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="厂家" prop="factory">
            <el-input v-model="queryParams.factory" placeholder="请输入厂家" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['move:devModel:add']">新增</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
            <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['move:devModel:edit']">修改</el-button>
        </el-col>
        <el-col :span="1.5">
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['move:devModel:remove']">删除</el-button>
        </el-col> -->
        <el-col :span="1.5">
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['move:devModel:export']">导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="devModelList" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <!-- <el-table-column label="编码" align="center" prop="id" /> -->
        <el-table-column label="型号名称（中文）" align="center" prop="chName" />
        <el-table-column label="型号名称（英文）" align="center" prop="enName" />
        <el-table-column label="厂家" align="center" prop="factory" />
        <el-table-column prop="chName" label="因子" :formatter="fList"></el-table-column>

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['move:devModel:edit']">修改</el-button>
                <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['move:devModel:remove']">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改设备型号管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="型号名称（中文）" prop="chName">
                <el-input v-model="form.chName" placeholder="请输入型号名称" />
            </el-form-item>
            <el-form-item label="型号名称（英文）" prop="enName">
                <el-input v-model="form.enName" placeholder="请输入型号名称" />
            </el-form-item>
            <el-form-item label="厂家" prop="factory">
                <el-input v-model="form.factory" placeholder="请输入厂家" />
            </el-form-item>
            <el-form-item label="监测因子" prop="factory">
                <el-select v-model="form.factorList" multiple placeholder="请选择" value-key="id">
                    <el-option v-for="item in factorList" :key="item.chName" :label="item.chName" :value="item" :disabled="item.status == 1"></el-option>
                </el-select>
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
    listFactor
} from "@/api/move/factor";
import {
    listDevModel,
    getDevModel,
    delDevModel,
    addDevModel,
    updateDevModel,
    exportDevModel
} from "@/api/move/devModel";

export default {
    name: "DevModel",
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
            // 设备型号管理表格数据
            devModelList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                enName: null,
                chName: null,
                factory: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {},
            factorList: ''
        };
    },
    created() {
        this.getList();
        this.getFactorList()
    },
    methods: {
        /*格式化数据*/
        fList(row, column) {
            var chNamelist = []
            for (var i = 0; i < row.factorList.length; i++) {
                chNamelist.push(row.factorList[i].chName)
            }
            return chNamelist.join()
        },

        /** 查询设备型号管理列表 */
        getList() {
            this.loading = true;

            listDevModel(this.queryParams).then(response => {
                this.devModelList = response.rows;
                // console.log('this.devModelList',this.devModelList)
                this.total = response.total;
                this.loading = false;
            });
        },
        /** 查询监测因子管理列表 */
        getFactorList() {

            this.loading = true;
            listFactor().then(response => {
                this.factorList = response.rows;
                // console.log('this.factorList',this.factorList)
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
                enName: null,
                chName: null,
                factory: null,
                factorList: []
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
            this.title = "添加设备型号管理";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids
            getDevModel(id).then(response => {
                // console.log('response',response)
                this.form = response.data;
                this.open = true;
                this.title = "修改设备型号管理";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        // console.log('this.form',this.form)
                        updateDevModel(this.form).then(response => {
                            this.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        // console.log('this.form.factorlist',this.form.factorlist)
                        addDevModel(this.form).then(response => {
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
            this.$confirm('是否确认删除设备型号管理编号为"' + ids + '"的数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return delDevModel(ids);
            }).then(() => {
                this.getList();
                this.msgSuccess("删除成功");
            })
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;
            this.$confirm('是否确认导出所有设备型号管理数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return exportDevModel(queryParams);
            }).then(response => {
                this.download(response.msg);
            })
        }
    }
};
</script>
