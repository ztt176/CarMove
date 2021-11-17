<!--
 * @Author: your name
 * @Date: 2021-05-28 09:41:02
 * @LastEditTime: 2021-09-08 12:09:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MoveDapWebUi\src\views\business\service\index.vue
-->
<template>
<div class="app-container">

    <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:dept:add']">新增</el-button>
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:dept:add']">导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" border :data="deptList" style="width: 100%" @expand-change="taskQuery" :expand-row-keys="expands" :row-key="getRowKeys">
        <el-table-column type="expand">
            <template slot-scope="scope">
                <el-table :data="taskData" style="width: 100%" ref="childTable">
                    <el-table-column prop="name" align="center" label="任务名称">

                    </el-table-column>
                    <el-table-column prop="startTime" align="center" label="预计开始时间">

                    </el-table-column>
                    <el-table-column prop="endTime" align="center" label="预计结束时间">

                    </el-table-column>
                    <el-table-column prop="description" align="center" label="描述">

                    </el-table-column>
                    <el-table-column prop="userName" label="运维人员" align="center">
                        <template slot-scope="scope">
                            <span v-for="item in scope.row.bizUsers" :key="item.id">{{item.userName+' '}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="userName" label="关联设备" align="center">
                        <template slot-scope="scope">
                            <span v-for="item in scope.row.bizMoves" :key="item.id">{{item.decription+' '}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleTaskUpdate(scope.row)" v-hasPermi="['system:dept:edit']">修改</el-button>
                            <el-button v-if="scope.row.parentId != 0" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:dept:remove']">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination class="childPagena" style="margin-bottom:30px" v-show="childTotal>0" :total="childTotal" :page.sync="childParams.pageNum" :limit.sync="childParams.pageSize" @pagination="taskQuery(scope.row)" />
            </template>
        </el-table-column>
        <el-table-column prop="deptName" label="客户名称" align="center"></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime">
            <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="服务名称" align="center"></el-table-column>
        <el-table-column prop="description" label="详情" align="center"></el-table-column>
        <el-table-column prop="orderNum" label="服务时间" align="center">
            <template slot-scope="scope">
                <span>{{scope.row.startTime + '~' + scope.row.endTime}}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:dept:edit']">修改</el-button>
                <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAddTask(scope.row)" v-hasPermi="['system:dept:add']">新增任务</el-button>
            </template>
        </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    <!-- 添加或修改服务目标对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="客户名称" prop="deptId">
                <el-select placeholder="" v-model="form.deptId">
                    <el-option v-for="(item,index) in deptOptions" :value="item.deptId" :key="index" :label="item.deptName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入服务名称" />
            </el-form-item>
            <el-form-item label="目标详情" prop="description">
                <el-input textarea v-model="form.description" />
            </el-form-item>
            <el-form-item label="服务时间" required>
                <el-col :span="11">
                    <el-form-item prop="startTime">
                        <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择开始时间" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="1">至</el-col>
                <el-col :span="11">
                    <el-form-item prop="endTime">
                        <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择结束时间" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
        </div>
    </el-dialog>
    <!-- 添加或修改任务对话框 -->
    <el-dialog :title="taskTitle" :visible.sync="taskOpen" width="600px" append-to-body>
        <el-form ref="taskForm" :model="taskForm" :rules="taskRules" label-width="80px">
            <el-form-item label="任务名称" prop="name">
                <el-input v-model="taskForm.name" placeholder=""></el-input>
            </el-form-item>

            <el-form-item label="开始时间" prop="startTime">
                <el-date-picker v-model="taskForm.startTime" type="datetime" placeholder="选择开始时间" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
                <el-date-picker v-model="taskForm.endTime" type="datetime" placeholder="选择结束时间" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="详情" prop="description">
                <el-input textarea v-model="taskForm.description" />
            </el-form-item>
            <el-form-item label="运维人员" prop="bizUsers">
                <el-select v-model="taskForm.bizUsers" multiple collapse-tags placeholder="请选择" value-key="userId">
                    <el-option v-for="item in userOptions" :key="item.userId" :label="item.userName" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="设备选择" prop="bizMoves">
                <el-select v-model="taskForm.bizMoves" multiple collapse-tags placeholder="请选择" value-key="id">
                    <el-option v-for="item in deviceOptions" :key="item.id" :label="item.name" :value="item"></el-option>

                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitTask">确 定</el-button>
            <el-button @click="taskOpen = false">取 消</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import {
    listDept,
    listService,
    listDevice,
    putDevice,
    putTask,
    updateService,
    updateTask,
    exportService,
    listTask,
    deleteTask
} from "@/api/business/service";
import {
    listUserops
} from '@/api/system/user'
export default {
    name: "ServiceManage",
    components: {
        // Treeselect
    },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 显示搜索条件
            showSearch: true,
            // 表格树数据
            deptList: [],
            // 客户选项
            deptOptions: [],
            //设备选项
            deviceOptions: [],
            //人员选项
            userOptions: [],
            // 弹出层标题
            title: "",
            taskTitle: '',
            // 是否显示弹出层
            open: false,
            taskOpen: false,
            taskData: [],
            // 查询参数
            queryParams: {

            },
            total: 0,
            childTotal: 0,
            childParams: {

            },
            // 表单参数
            form: {},
            taskForm: {
                bizUsers: [],
                bizMoves: []
            },
            // 表单校验
            rules: {
                description: [{
                    required: true,
                    message: '请填写目标详情',
                    trigger: 'blur'
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
                deptId: [{
                    required: true,
                    message: '请选择客户',
                    trigger: 'change'
                }],
                name: [{
                    required: true,
                    message: '请填写服务名称',
                    trigger: 'blur'
                }]
            },
            taskRules: {
                description: [{
                    required: true,
                    message: '请填写详情',
                    trigger: 'blur'
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
                bizUsers: [{
                    required: true,
                    message: '请选择运维人员',
                    trigger: 'change'
                }],
                bizMoves: [{
                    required: true,
                    message: '请选择设备',
                    trigger: 'change'
                }],
                name: [{
                    required: true,
                    message: '请填写任务名称',
                    trigger: 'blur'
                }]
            },
            //展开行
            expands: [],
            getRowKeys(row) {
                return row.id
            },
        };
    },
    created() {
        this.getList();
        this.getDicts("sys_normal_disable").then(response => {
            this.statusOptions = response.data;
        });
    },
    methods: {
        /** 查询部门列表 */
        getList() {
            this.loading = true;
            listService().then(response => {
                this.deptList = response.rows;
                this.total = response.total
                this.loading = false;
            })

        },
        // 字典状态字典翻译
        statusFormat(row, column) {
            return this.selectDictLabel(this.statusOptions, row.status);
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {

            };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        /** 新增按钮操作 */
        handleAdd(row) {
            this.reset();
            listDept().then(response => {
                this.deptOptions = response.rows
            });

            this.open = true;
            this.title = "新增服务目标";

        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            listDept().then(response => {
                this.deptOptions = response.rows
            });
            this.form = row
            this.open = true;
            this.title = "修改服务目标";
        },
        handleTaskUpdate(row) {
            listDevice().then(response => {
                this.deviceOptions = response.rows
            });
            listUserops().then(response => {
                this.userOptions = response.rows
            });
            this.reset();
            this.taskForm = row
            this.taskOpen = true;
            this.taskTitle = "修改任务";
        },
        /** 提交按钮 */
        submitForm: function () {
            // console.log(this.form)
            // debugger
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != undefined) {
                        updateService(this.form).then(response => {
                            this.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        putDevice(this.form).then(response => {
                            this.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        /** 新增任务按钮操作 */
        handleAddTask(row) {
            this.reset();
            listDevice().then(response => {
                this.deviceOptions = response.rows
            });
            listUserops().then(response => {
                this.userOptions = response.rows
            });
            this.taskOpen = true;
            this.taskForm.serviceId = row.id
            this.taskTitle = "新增任务";
        },
        submitTask() {
            // console.log(this.form)
            // debugger
            this.$refs["taskForm"].validate(valid => {
                if (valid) {
                    if (this.taskForm.id != undefined) {
                        updateTask(this.taskForm).then(response => {
                            this.msgSuccess("修改成功");
                            this.taskOpen = false;
                            this.getList();
                        });
                    } else {
                        putTask(this.taskForm).then(response => {
                            this.msgSuccess("新增成功");
                            this.taskOpen = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        taskQuery(row, expandedRows) {
            if (expandedRows.length) {
                this.expands = [];
                if (row) {
                    this.taskData = [];
                    this.childParams.serviceId = row.id;
                    this.expands.push(row.id)
                    listTask(this.childParams).then(res => {
                        this.taskData = res.rows;
                        this.childTotal = res.total;
                    })
                } else {
                    this.expands = []
                }

            }

        },
        /** 删除按钮操作 */
        handleDelete(row) {
            this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return deleteTask(row.id);
            }).then(() => {
                this.taskQuery({
                    id: this.childParams.serviceId
                }, [1, 2]);
                this.msgSuccess("删除成功");
            })
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = {
                startTime: '',
                endTime: '',
                name: ''
            };
            this.$confirm('是否确认导出所有服务数据?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return exportService(queryParams);
            }).then(response => {
                this.download(response.msg);
            })
        },
    }
};
</script>

<style>
.el-table__expanded-cell {
    padding: 0 !important;
}

.childPagena .el-pagination {
    right: calc(50vw - 210px);
}
</style>
