<template>
<div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
        <!-- <el-form-item label="载体编号(走航车车牌号)" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入载体编号(走航车车牌号)"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
        <el-form-item label="载体名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入载体名称" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <!-- <el-form-item label="载体类型(0: 走航车;1: 无人机;)" prop="category">
        <el-select v-model="queryParams.category" placeholder="请选择载体类型(0: 走航车;1: 无人机;)" clearable size="small">
          <el-option
            v-for="dict in categoryOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item> -->
        <el-form-item label="载体型号" prop="model">
            <el-input v-model="queryParams.model" placeholder="请输入载体型号" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="载体厂家" prop="factory">
            <el-input v-model="queryParams.factory" placeholder="请输入载体厂家" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <!-- <el-form-item label="载体状态(0: 未用;1： 可用; 2: 异常)" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择载体状态(0: 未用;1： 可用; 2: 异常)" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item> -->
        <!-- <el-form-item label="是否在线" prop="online">
        <el-input
          v-model="queryParams.online"
          placeholder="请输入是否在线"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
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
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['move:move:add']">新增</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
            <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['move:move:edit']">修改</el-button>
        </el-col>
        <el-col :span="1.5">
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['move:move:remove']">删除</el-button>
        </el-col> -->
        <el-col :span="1.5">
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['move:move:export']">导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="moveList" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <!-- <el-table-column label="自动编号id" align="center" prop="id" /> -->
        <el-table-column label="载体编号" align="center" prop="code" />
        <el-table-column label="载体名称" align="center" prop="name" />
        <el-table-column label="载体描述" align="center" prop="decription" />
        <el-table-column label="载体类型" align="center" prop="category" :formatter="categoryFormat" />
        <el-table-column label="载体型号" align="center" prop="model" />
        <el-table-column label="载体厂家" align="center" prop="factory" />
        <el-table-column label="载体状态" align="center" prop="status" :formatter="statusFormat" />
        <el-table-column label="搭载设备" prop="name" :formatter="fList"></el-table-column>
        <el-table-column label="是否在线" align="center" prop="online" />
        <el-table-column label="启用时间" align="center" prop="useTime" width="180">
            <template slot-scope="scope">
                <span>{{ parseTime(scope.row.useTime, '{y}-{m}-{d}') }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['move:move:edit']">修改</el-button>
                <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['move:move:remove']">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改载体管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="载体编号" prop="code">
                <el-input v-model="form.code" placeholder="请输入载体编号(走航车车牌号)" />
            </el-form-item>
            <el-form-item label="载体名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入载体名称" />
            </el-form-item>
            <el-form-item label="载体描述" prop="decription">
                <el-input v-model="form.decription" type="textarea" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item label="载体类型" prop="category">
                <el-radio-group v-model="form.category">
                    <el-radio v-for="dict in categoryOptions" :key="dict.dictValue" :label="parseInt(dict.dictValue)">{{dict.dictLabel}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="载体型号" prop="model">
                <el-input v-model="form.model" placeholder="请输入载体型号" />
            </el-form-item>
            <el-form-item label="载体厂家" prop="factory">
                <el-input v-model="form.factory" placeholder="请输入载体厂家" />
            </el-form-item>
            <el-form-item label="载体状态">
                <el-radio-group v-model="form.status">
                    <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="parseInt(dict.dictValue)">{{dict.dictLabel}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="搭载设备" prop="factory">
                <el-select v-model="form.devList" multiple placeholder="请选择" value-key="id">
                    <el-option v-for="item in deviceList" :key="item.name" :label="item.name" :value="item" :disabled="item.status == 1"></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="是否在线" prop="online">
          <el-input v-model="form.online" placeholder="请输入是否在线" />
        </el-form-item> -->
            <el-form-item label="是否在线">
                <el-radio-group v-model="form.online">
                    <el-radio v-for="dict in onlineOptions" :key="dict.dictValue" :label="parseInt(dict.dictValue)">{{dict.dictLabel}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="启用时间" prop="useTime">
                <el-date-picker clearable size="small" v-model="form.useTime" type="date" value-format="yyyy-MM-dd" placeholder="选择启用时间">
                </el-date-picker>
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
    listMove,
    getMove,
    delMove,
    addMove,
    updateMove,
    exportMove
} from "@/api/move/move";
import {
    listDevice
} from "@/api/move/device";

export default {
    name: "Move",
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
            // 载体管理表格数据
            moveList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 载体类型(0: 走航车;1: 无人机;)字典
            categoryOptions: [],
            // 载体状态(0: 未用;1： 可用; 2: 异常)字典
            statusOptions: [],
            // 是否在线字典
            onlineOptions: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                code: null,
                name: null,
                decription: null,
                category: null,
                model: null,
                factory: null,
                status: null,
                online: null,
                useTime: null,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                code: [{
                    required: true,
                    message: "载体编号(走航车车牌号)不能为空",
                    trigger: "blur"
                }],
                name: [{
                    required: true,
                    message: "载体名称不能为空",
                    trigger: "blur"
                }],
                category: [{
                    required: true,
                    message: "载体类型(0: 走航车;1: 无人机;)不能为空",
                    trigger: "blur"
                }],
                model: [{
                    required: true,
                    message: "载体型号不能为空",
                    trigger: "blur"
                }],
                factory: [{
                    required: true,
                    message: "载体厂家不能为空",
                    trigger: "blur"
                }],
                status: [{
                    required: true,
                    message: "载体状态(0: 未用;1： 可用; 2: 异常)不能为空",
                    trigger: "blur"
                }],
                online: [{
                    required: true,
                    message: "是否在线不能为空",
                    trigger: "blur"
                }],
                useTime: [{
                    required: true,
                    message: "启用时间不能为空",
                    trigger: "blur"
                }],
            },
            deviceList: ''
        }
    },
    created() {
        this.getList();
        this.getDeviceList()
        this.getDicts("move_move_type").then(response => {
            this.categoryOptions = response.data;
        });
        this.getDicts("move_move_status").then(response => {
            this.statusOptions = response.data;
        });
        this.getDicts("move_move_online").then(response => {
            this.onlineOptions = response.data;
        });
    },
    methods: {
        /*格式化数据*/
        fList(row, column) {
            console.log('row', row)
            if (row.devList != null) {
                var chNamelist = []
                for (var i = 0; i < row.devList.length; i++) {
                    chNamelist.push(row.devList[i].name)
                }
                return chNamelist.join()
            }
        },
        /** 查询载体管理列表 */
        getList() {
            this.loading = true;
            listMove(this.queryParams).then(response => {
                this.moveList = response.rows;
                console.log('this.moveList', this.moveList)
                this.total = response.total;
                this.loading = false;
            });
        },
        /** 查询设备管理列表 */
        getDeviceList() {
            this.loading = true;
            listDevice(this.queryParams).then(response => {
                this.deviceList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        // 载体类型(0: 走航车;1: 无人机;)字典翻译
        categoryFormat(row, column) {
            return this.selectDictLabel(this.categoryOptions, row.category);
        },
        // 载体状态(0: 未用;1： 可用; 2: 异常)字典翻译
        statusFormat(row, column) {
            return this.selectDictLabel(this.statusOptions, row.status);
        },
        // 是否在线字典翻译
        onlineFormat(row, column) {
            return this.selectDictLabel(this.onlineOptions, row.online);
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
                code: null,
                name: null,
                decription: null,
                category: 0,
                model: null,
                factory: null,
                status: 0,
                online: null,
                useTime: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                remark: null,
                devList: []
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
            this.title = "添加载体管理";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids
            getMove(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改载体管理";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateMove(this.form).then(response => {
                            this.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addMove(this.form).then(response => {
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
            this.$confirm('是否确认删除载体管理编号为"' + ids + '"的数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return delMove(ids);
            }).then(() => {
                this.getList();
                this.msgSuccess("删除成功");
            })
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;
            this.$confirm('是否确认导出所有载体管理数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return exportMove(queryParams);
            }).then(response => {
                this.download(response.msg);
            })
        }
    }
};
</script>
