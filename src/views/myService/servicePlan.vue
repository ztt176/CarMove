<!--
 * @Author: your name
 * @Date: 2021-06-25 10:54:30
 * @LastEditTime: 2021-09-09 14:31:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MoveDapWebUi\src\views\myService\servicePlan.vue
-->
<template>
<div>
    <el-row :gutter="20" style="padding:0 5px">
        <el-col :span="12" v-for="(item,index) in planList" :key="index" style="margin-bottom:10px">
            <el-row :gutter="10" style="padding:10px;background:rgba(255, 255, 255, 0.1);color:white;border-radius:5px;">
                <el-col :span="item.canEvaluate?18:16">
                    <div style="font-weight: 600;text-align:left">{{item.name}}</div>
                    <div style="font-size:14px;padding:5px 0;text-align:left">{{item.description}}</div>
                    <div style="font-size:12px;text-align:left"><i class="el-icon-alarm-clock"></i>{{' '+item.startTime}} ~ {{item.endTime}}</div>
                </el-col>
                <el-col :span="6" style="height:100%" v-if="item.canEvaluate" >
                    <el-button type="primary" @click="handleEvaluate(item)" v-if="user[0]!='admin'">服务评价</el-button>
                </el-col>
                <el-col :span="8" style="height:100%" v-else>
                    <el-rate v-model="item.bizTaskEvaluationDto.evaluateScore" disabled text-color="#ff9900">
                    </el-rate>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
    <pagination v-show="total>12" :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="getList" />
    <el-dialog title="感谢您对我们的服务予以评价" :visible.sync="evaluateOpen" width="30%" append-to-body>
        <div>
            <el-form ref="rateform" :model="rateForm" label-width="80px">
                <el-form-item label="服务评价">
                    <el-rate v-model="rateForm.evaluateScore" text-color="#ff9900">
                    </el-rate>
                </el-form-item>
                <el-form-item label="更多建议">
                    <el-input type="textarea" v-model="rateForm.evaluateAdvise"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer">
            <el-button @click="evaluateOpen = false">取 消</el-button>
            <el-button type="primary" @click="submiteRate">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import {
    planCustomer,
    submiteEvaluate
} from '@/api/mysevice/service'
import {
    mapState
} from 'vuex'
export default {

    data() {
        return {
            planList: [],
            form: {
                pageNum: 1,
                pageSize: 6
            },
            rateForm: {
                evaluateScore: 0,
                evaluateAdvise: null
            },
            total: 0,
            evaluateOpen: false
        }
    },
    computed:{
        ...mapState({
            user: state => state.user.roles
        })
    },
    created() {},
    methods: {
        getList(id) {
            this.form.serviceId = id == 'all' ? undefined : (id||this.form.serviceId)
            planCustomer(this.form).then(res => {
                this.planList = res.rows
                this.total = res.total
            })

        },
        handleEvaluate(item) {
            this.evaluateOpen = true;
            this.rateForm.taskId = item.id
        },
        submiteRate(){
            submiteEvaluate(this.rateForm).then(()=>{
                this.$message({
                    type:'success',
                    message:'提交成功'
                })
                this.evaluateOpen = false;
                this.getList()
            })
        }
    }
}
</script>
