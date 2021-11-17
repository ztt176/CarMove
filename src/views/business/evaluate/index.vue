<!--
 * @Author: your name
 * @Date: 2021-06-22 09:23:40
 * @LastEditTime: 2021-09-10 17:12:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MoveDapWebUi\src\views\business\event\index.vue
-->
<template>
<div class="app-container">
    <el-form inline>
        <el-form-item label="所属客户">
            <el-select v-model="form.deptId" placeholder="请选择" size="mini" clearable>
                <el-option v-for="(item,index) in deptOptions" :value="item.deptId" :key="index" :label="item.deptName"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        </el-form-item>
    </el-form>
    <el-table :data="data" v-loading="loading" style="width: 100%">
        <el-table-column prop="serviceName" label="服务名称" align="center">
        </el-table-column>
        <el-table-column prop="taskName" label="任务名称" align="center">
        </el-table-column>
        <el-table-column prop="deptName" label="所属客户" align="center">
        </el-table-column>
        <el-table-column prop="evaluateScore" label="评价" align="center">
            <template slot-scope="scope">
                <div>
                    <el-rate v-model="scope.row.evaluateScore" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" disabled></el-rate>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="evaluateAdvise" label="建议意见" align="center">
        </el-table-column>
        <el-table-column prop="evaluateTime" label="评价时间" align="center">
        </el-table-column>
        <el-table-column prop="evaluateUserName" label="评价人" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-document-delete" v-hasPermi="['system:dept:edit']" @click="handelDelete(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="getList" />
</div>
</template>

<script>
import {
    listEvaluation,
    deleteEvaluate
} from '@/api/business/evaluate'
import {
    listDept,
} from "@/api/business/service";
export default {
    name: "Evaluate",
    components: {},
    data() {
        return {
            loading: true,
            total: 0,
            data: [],
            form: {
                pageNum: 1,
                pageSize: 10
            },
            deptOptions: [],
        };
    },
    created() {
        this.getList();
        listDept().then(response => {
            this.deptOptions = response.rows
        });
    },
    methods: {
        getList() {
            this.loading = true;
            listEvaluation(this.form).then(res => {
                this.data = res.rows;
                this.total = res.total;
                this.loading = false;
            })
        },
        handleQuery() {

            this.getList()
        },
        handelDelete(row) {
            this.$confirm('是否确认删除服务名称为"' + row.serviceName + '"的数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return deleteEvaluate(row.id);
            }).then(() => {
                this.getList();
                this.msgSuccess("删除成功");
            })
        }
    }
};
</script>

<style>

</style>
