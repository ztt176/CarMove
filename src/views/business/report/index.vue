<!--
 * @Author: your name
 * @Date: 2021-06-22 09:23:40
 * @LastEditTime: 2021-09-08 15:35:56
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
                <el-form-item label="报告类型">
                    <el-select v-model="form.reportType" placeholder="请选择" size="mini" clearable>
                        <el-option v-for="dict in reportTypes" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="用户单位">
                    <el-select v-model="form.deptId" placeholder="请选择" size="mini" clearable>
                        <el-option v-for="(item,index) in deptOptions" :value="item.deptId" :key="index" :label="item.deptName"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="reportOpen = true" size="mini">上传报告</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
    <el-table :data="data" v-loading="loading" style="width: 100%">
        <el-table-column prop="deptName" label="用户单位" align="center">
        </el-table-column>
        <el-table-column prop="deptName" label="服务目标" align="center">
        </el-table-column>
        <el-table-column prop="taskName" label="关联任务" align="center">
        </el-table-column>
        <el-table-column prop="reportType" label="报告类型" align="center" :formatter="typeFormat">
        </el-table-column>
        <el-table-column prop="reportName" label="报告名称" align="center">
        </el-table-column>

        <el-table-column prop="uploadBy" label="上传人" align="center">
        </el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" align="center">
        </el-table-column>
        <el-table-column prop="visible" label="客户可见" align="center" :formatter="visiableFormat">
        </el-table-column>
        <el-table-column label="操作" align="center" width="350px">
            <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['system:dept:edit']" @click="handleUpdate(scope.row)">修改</el-button>
                <el-button size="mini" type="text" icon="el-icon-view" v-hasPermi="['system:dept:remove']" @click="handleLook(scope.row)">预览报告</el-button>
                <el-button size="mini" type="text" icon="el-icon-download" v-hasPermi="['system:dept:edit']" @click="handleDownload(scope.row)">下载</el-button>
                <el-button size="mini" type="text" icon="el-icon-document-delete" v-hasPermi="['system:dept:remove']" @click="handleDelete(scope.row)">删除</el-button>
                <el-button size="mini" type="text" icon="el-icon-tickets" v-hasPermi="['system:dept:remove']" @click="handleInfo(scope.row)">下载明细</el-button>
            </template>
        </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="getList" />
    <el-dialog title="上传报告" :visible.sync="reportOpen" width="600px" append-to-body>
        <el-form :model="reportForm" ref="reportForm" :rules="rules" label-width="80px">
            <el-form-item label="报告名称" prop="reportName" label-width="80px">
                <el-input v-model="reportForm.reportName"></el-input>
            </el-form-item>
            <el-form-item label="用户单位" prop="deptId" label-width="80px">
                <el-select v-model="reportForm.deptId" placeholder="请选择" size="mini">
                    <el-option v-for="(item,index) in deptOptions" :value="item.deptId" :key="index" :label="item.deptName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务目标" label-width="80px" prop="serviceId">
                <el-select v-model="reportForm.serviceId" placeholder="请选择" size="mini">
                    <el-option v-for="(item,index) in serviceList" :value="item.id" :key="index" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属任务" prop="taskId" label-width="80px">
                <el-select v-model="reportForm.taskId" placeholder="请选择" size="mini">
                    <el-option v-for="(item,index) in taskOptions" :value="item.id" :key="index" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="报告类型" prop="reportType">
                <el-select v-model="reportForm.reportType" placeholder="请选择" size="mini">
                    <el-option v-for="dict in reportTypes" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="fileList" label="上传文件">
                <el-upload drag :action="fieldAction" :headers="requestHeader" accept=".pdf" :on-success="reportSucess" :on-remove="handleRemove">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="reportOpen = false">取 消</el-button>
            <el-button type="primary" @click="handleReport">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog title="编辑报告" :visible.sync="updateOpen" width="600px" append-to-body>
        <el-form :model="updateForm" label-width="80px">
            <el-form-item label="报告名称" label-width="80px">
                <el-input v-model="updateForm.reportName"></el-input>
            </el-form-item>
            <el-form-item label="用户单位" label-width="80px">
                <el-select v-model="updateForm.deptId" placeholder="请选择" size="mini">
                    <el-option v-for="(item,index) in deptOptions" :value="item.deptId" :key="index" :label="item.deptName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务目标" label-width="80px" prop="serviceId">
                <el-select v-model="updateForm.serviceId" placeholder="请选择" size="mini">
                    <el-option v-for="(item,index) in serviceList" :value="item.id" :key="index" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属任务" label-width="80px">
                <el-select v-model="updateForm.taskId" placeholder="请选择" size="mini">
                    <el-option v-for="(item,index) in taskOptions" :value="item.id" :key="index" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="报告类型">
                <el-select v-model="updateForm.reportType" placeholder="请选择" size="mini">
                    <el-option v-for="dict in reportTypes" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="客户可见">
                <el-radio-group v-model="updateForm.visible">
                    <el-radio v-for="dict in visibleOption" :key="dict.dictValue" :label="parseInt(dict.dictValue)">{{dict.dictLabel}}</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="updateOpen = false;updateForm = {}">取 消</el-button>
            <el-button type="primary" @click="subUpdate">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog title="预览" :visible.sync="pdfVisible" width="60%" append-to-body>
        <div>
            <pdf ref="pdf" v-for="i in pdfPages" :key="i" :src="pdfUrl" :page="i"></pdf>
        </div>
        <div slot="footer">
            <el-button @click="pdfVisible = false">关 闭</el-button>
        </div>
    </el-dialog>
    <el-dialog title="下载明细" :visible.sync="infoVisible" width="40%" append-to-body>
        <div>
            <el-table :data="dataInfo" style="width: 100%">
                <el-table-column prop="downloadBy" label="下载人" align="center">
                </el-table-column>
                <el-table-column prop="downloadDeptId" label="用户单位" align="center">
                </el-table-column>
                <el-table-column prop="downloadTime" label="下载时间" align="center">
                </el-table-column>
            </el-table>
        </div>
        <div slot="footer">
            <el-button @click="infoVisible = false">关 闭</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import pdf from 'vue-pdf'
import {
    listDept,
} from "@/api/business/service";
import {
    addReport,
    listReport,
    reportUpdate,
    reportInfo,
    delReport,
    previewReport,
    downloadReport,
    downloadInfo
} from "@/api/business/report";
import {
    listDeptService,
    planCustomer
} from '@/api/mysevice/service'
// let fileDownload = require('js-file-download');
const baseUrl = process.env.VUE_APP_BASE_API;
export default {
    name: "Report",
    components: {
        pdf
    },
    data() {
        return {
            //表格正在加载
            loading: true,
            //上传请求头
            requestHeader: {},
            //上传地址
            fieldAction: baseUrl + '/move/report/reportupload',
            reportOpen: false,
            timeUnit: null,
            //日期
            daterange: [],
            //下载明细数据
            dataInfo: [],
            infoVisible: false,
            //表格数据
            data: [],
            //查询条件
            form: {},
            reportForm: {
                bizReportDocument: {}
            },
            //报告列表
            fileList: [],
            total: 0,
            reportTypes: [],
            deptOptions: [],
            //服务列表
            serviceList: [],
            taskOptions: [],
            updateOpen: false,
            updateForm: {},
            pdfVisible: false,
            visibleOption: [],
            pdfUrl: '',
            pdfPages: null,
            rules: {

                taskId: [{
                    required: true,
                    message: '请选择所属任务',
                    trigger: 'change'
                }],
                reportType: [{
                    required: true,
                    message: '请选择报告类型',
                    trigger: 'change'
                }],
                serviceId: [{
                    required: true,
                    message: '请选择服务目标',
                    trigger: 'change'
                }],
                // fileList: [{
                //     required: true,
                //     message: '请上传报告',
                //     trigger: 'change'
                // }],
                deptId: [{
                    required: true,
                    message: '请选择客户',
                    trigger: 'change'
                }],
                reportName: [{
                    required: true,
                    message: '请填写报告名称',
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
        this.getDicts("move_report_type").then(response => {
            this.reportTypes = response.data;
        });
        this.getDicts("move_visible_type").then(response => {
            this.visibleOption = response.data;
        });
        listDept().then(response => {
            this.deptOptions = response.rows
        });
        this.requestHeader['Authorization'] = 'Bearer ' + this.$cookies.get('Admin-Token');
    },
    methods: {
        getList() {
            listReport(this.form).then(res => {
                this.data = res.rows
                this.total = res.total
                this.loading = false;
            })
        },
        // 字典状态字典翻译
        typeFormat(row, column) {
            return this.selectDictLabel(this.reportTypes, row.reportType);
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
            this.reportForm.bizReportDocument = {}
        },

        reportSucess(response, file, fileList) {
            this.fileList = fileList
            this.reportForm.bizReportDocument = {
                documentUrl: response.url,
                documentName: response.fileName,
                documentPath: response.filePath
            }
        },

        handleReport() {
            if(Object.keys(this.reportForm.bizReportDocument).length != 0){
                this.$refs['reportForm'].validate(valid => {
                    if (valid) {
                        addReport(this.reportForm).then(res => {
                            this.reportOpen = false
                            this.getList()
                        })
                    }
                })
            }else{
                this.$message({
                    message:'请上传报告文件',
                    type:'warning'
                })
            }
        },
        handleUpdate(row) {
            reportInfo(row.id).then(res => {
                this.updateForm = res.data
                this.updateOpen = true
            })
        },
        handleLook(row) {
            this.pdfUrl = null
            previewReport(row.id).then(res => {
                this.pdfVisible = true
                let loadingTask = pdf.createLoadingTask(res.data.documentUrl)
                let that = this
                loadingTask.promise.then(pdf => {
                    that.pdfUrl = loadingTask
                    that.pdfPages = pdf.numPages
                }).catch(err => {
                    console.error('pdf 加载失败', err);
                })
            })
        },
        handleDownload(row) {
            this.$confirm('是否确认下载报告名称为"' + row.reportName + '"的文档?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return downloadReport({
                    fileName: row.bizReportDocument.documentPath,
                    repordownId: row.bizReportDocument.id
                });
            }).then(response => {

                this.downloadPdf(response, row.bizReportDocument.documentName)
            })
        },
        handleInfo(row) {
            downloadInfo(row.bizReportDocument.id).then(res => {
                this.dataInfo = res;
                this.infoVisible = true
            })
        },
        handleDelete(row) {
            this.$confirm('是否确认删除报告名称为"' + row.reportName + '"的数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return delReport(row.id);
            }).then(() => {
                this.getList();
                this.msgSuccess("删除成功");
            })
        },
        subUpdate() {
            reportUpdate(this.updateForm).then(res => {
                this.$message({
                    message: "修改成功",
                    type: 'success'
                });
                this.updateOpen = false
                this.getList()
            })
        },
        downloadPdf(data, fileName) {
            let blob = new Blob([data], {
                type: "application/pdf"
            });
            let filename = fileName;
            if (typeof window.navigator.msSaveBlob !== "undefined") {
                window.navigator.msSaveBlob(blob, filename);
            } else {
                var blobURL = window.URL.createObjectURL(blob);
                // 创建隐藏<a>标签进行下载
                var tempLink = document.createElement("a");
                tempLink.style.display = "none";
                tempLink.href = blobURL;
                tempLink.setAttribute("download", filename);
                if (typeof tempLink.download === "undefined") {
                    tempLink.setAttribute("target", "_blank");
                }
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
                window.URL.revokeObjectURL(blobURL);
            }
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

.progress {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
