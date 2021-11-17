<template>
<div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="英文代号" prop="enName">
            <el-input v-model="queryParams.enName" placeholder="请输入英文代号" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="中文代号" prop="chName">
            <el-input v-model="queryParams.chName" placeholder="请输入中文代号" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['move:factor:add']">新增</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
            <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['move:factor:edit']">修改</el-button>
        </el-col>
        <el-col :span="1.5">
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['move:factor:remove']">删除</el-button>
        </el-col> -->
        <el-col :span="1.5">
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['move:factor:export']">导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="factorList" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <!-- <el-table-column label="自动编号id" align="center" prop="id" /> -->
        <el-table-column label="英文代号" align="center" prop="enName" />
        <el-table-column label="中文代号" align="center" prop="chName" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['move:factor:edit']">修改</el-button>
                <el-button size="mini" type="text" icon="el-icon-edit" @click="changeParams(scope.row)">参数设置</el-button>
                <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['move:factor:remove']">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改监测因子管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="英文代号" prop="enName">
                <el-input v-model="form.enName" placeholder="请输入英文代号" />
            </el-form-item>
            <el-form-item label="中文代号" prop="chName">
                <el-input v-model="form.chName" placeholder="请输入中文代号" />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
        </div>
    </el-dialog>
    <el-dialog title="因子参数设置" :visible.sync="paramsVisible" width="30%" append-to-body>
        <el-form :model="form">
            <el-form-item label="最小值" prop="colorCodeMin">
                <el-input-number v-model="paramsform.colorCodeMin" placeholder="请输入因子最小值" />
            </el-form-item>
            <el-form-item label="最大值" prop="colorCodeMax">
                <el-input-number v-model="paramsform.colorCodeMax" placeholder="请输入因子最大值" />
            </el-form-item>
            <el-form-item label="因子默认范围" prop="defultVal">
                <vue-slider v-model="paramsform.defultVal" :min="paramsform.colorCodeMin" :max="paramsform.colorCodeMax" :interval="0.1"></vue-slider>
            </el-form-item>
            <el-form-item label="最小高度/半径" prop="heightRadiusMin">
                <el-input-number v-model="paramsform.heightRadiusMin" placeholder="请输入因子最小高度/半径" />
            </el-form-item>
            <el-form-item label="最大高度/半径" prop="heightRadiusMax">
                <el-input-number v-model="paramsform.heightRadiusMax" placeholder="请输入因子最大高度/半径" />
            </el-form-item>
            <el-form-item label="默认高度/半径" prop="defultHigh">
                <vue-slider v-model="paramsform.defultHigh" :min="paramsform.heightRadiusMin" :max="paramsform.heightRadiusMax" :interval="100"></vue-slider>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="paramsVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitParams">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import {
    listFactor,
    getFactor,
    delFactor,
    addFactor,
    updateFactor,
    exportFactor,
    updateOption
} from "@/api/move/factor";
import vueSlider from '@/components/vueslider/index';
export default {
    name: "Factor",
    components: {
        vueSlider
    },
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
            // 监测因子管理表格数据
            factorList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                enName: null,
                chName: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {},
            //参数设置弹窗
            paramsVisible: false,
            paramsform: {
                colorCodeMin: 0,
                colorCodeMax: 1,
                defultVal: [0, 0.5],
                heightRadiusMin: 0,
                heightRadiusMax: 10000,
                defultHigh: [0, 5000]
            }
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询监测因子管理列表 */
        getList() {
            this.loading = true;
            listFactor(this.queryParams).then(response => {
                this.factorList = response.rows;
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
                enName: null,
                chName: null
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
            this.title = "添加监测因子管理";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids
            getFactor(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改监测因子管理";
            });
        },
        //参数设置按钮
        changeParams(row) {
            getFactor(row.id).then(response => {
                this.paramsform.factorId = row.id;
                Object.keys(response.data).forEach(key => {
                    this.paramsform[key] = response.data[key]
                })
                this.paramsVisible = true;
            });
        },
        submitParams() {
            this.paramsform.colorCodeDefaultMin = this.paramsform.defultVal[0]
            this.paramsform.colorCodeDefaultMax = this.paramsform.defultVal[1];
            this.paramsform.heightRadiusDefaultMin = this.paramsform.defultHigh[0];
            this.paramsform.heightRadiusDefaultMax = this.paramsform.defultHigh[1];
            updateOption(this.paramsform).then(response => {
                this.msgSuccess("修改成功");
                this.paramsVisible = false;
                this.getList();
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateFactor(this.form).then(response => {
                            this.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addFactor(this.form).then(response => {
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
            this.$confirm('是否确认删除监测因子管理编号为"' + ids + '"的数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return delFactor(ids);
            }).then(() => {
                this.getList();
                this.msgSuccess("删除成功");
            })
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;
            this.$confirm('是否确认导出所有监测因子管理数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return exportFactor(queryParams);
            }).then(response => {
                this.download(response.msg);
            })
        }
    }
};
</script>
