<!--
 * @Author: your name
 * @Date: 2021-06-25 10:55:10
 * @LastEditTime: 2021-09-13 10:54:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MoveDapWebUi\src\views\myService\myReport.vue
-->
<template>
<div>
    <el-row :gutter="20" style="padding:0 5px">
        <el-col :span="12" v-for="(item,index) in reportList" :key="index" style="margin-bottom:10px;">
            <el-row :gutter="10" style="padding:10px;background:rgba(255, 255, 255, 0.1);color:white;border-radius:5px;">
                <el-col :span="18">
                    <div style="font-weight: 600;text-align:left">{{item.reportName}}</div>
                    <div style="font-size:12px;text-align:left;padding:5px 0;"><i class="el-icon-alarm-clock"></i>{{' '+item.uploadTime}}</div>
                    <div style="font-size:14px;text-align:left"><i class="el-icon-monitor"></i>{{' '+typeFormat(item)}}</div>
                </el-col>
                <el-col :span="6" style="height:100%">
                    <div style="margin-bottom:10px">
                        <el-button type="primary" @click="handleLook(item)">查看</el-button>
                    </div>
                    <div>
                        <el-button @click="handleDownload(item)" style="background:rgba(255, 255, 255, 0.2);color:white;border:0px solid">下载</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
    <el-dialog title="预览" :visible.sync="pdfVisible" width="60%" append-to-body>
        <div>
            <pdf ref="pdf" v-for="i in pdfPages" :key="i" :src="pdfUrl" :page="i"></pdf>
        </div>
        <div slot="footer">
            <el-button @click="pdfVisible = false">关 闭</el-button>
        </div>
    </el-dialog>
    <pagination v-show="total>12" :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="getList" />
</div>
</template>

<script>
import {
    reportsCustomer
} from '@/api/mysevice/service'
import pdf from 'vue-pdf'
import {
    previewReport,
    downloadReport,
} from "@/api/business/report";
export default {
    components: {
        pdf
    },
    data() {
        return {
            reportList: [],
            reportTypes: [],
            form: {},
            total: 0,
            pdfVisible: false,
            pdfPages: null,
            pdfUrl: '',
        }
    },
    created() {
        this.getList();
        //查询事件类型状态字典
        this.getDicts("move_report_type").then(response => {
            this.reportTypes = response.data;
        });
    },
    methods: {
        getList(id) {
            this.form.serviceId = id == 'all' ? undefined : id
            reportsCustomer(this.form).then(res => {
                this.reportList = res.rows;
            })
        },
        // 字典状态字典翻译
        typeFormat(item) {
            return this.selectDictLabel(this.reportTypes, item.reportType);
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
    }
}
</script>

<style>
.progress {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
