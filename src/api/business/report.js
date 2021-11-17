/*
 * @Author: your name
 * @Date: 2021-06-25 14:06:18
 * @LastEditTime: 2021-07-01 16:55:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MoveDapWebUi\src\api\business\report.js
 */
import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";
//新增报告
export function addReport(data) {
    return request({
        url: '/move/report',
        method: 'post',
        data: data
    })
}
//获取正在执行的任务
export function getTask() {
    return request({
        url: '/move/task/list_process',
        method: 'get',
    })
}
//获取报告列表
export function listReport(data) {
    return request({
        url: '/move/report/list',
        method: 'get',
        params: data
    })
}
//获取事件详细
export function reportInfo(id) {
    return request({
        url: '/move/report/' + praseStrEmpty(id),
        method: 'get',
    })
}
//修改
export function reportUpdate(data) {
    return request({
        url: '/move/report',
        method: 'put',
        data: data
    })
}

//删除
export function delReport(id) {
    return request({
        url: '/move/report/' + id,
        method: 'delete'
    })
}
//预览
export function previewReport(id) {
    return request({
        url: '/move/report/preview/' + praseStrEmpty(id),
        method: 'get'
    })
}
//pdf下载
export function downloadReport(data) {
    return request({
        url: '/move/report/download/resource',
        method: 'get',
        responseType: "blob",
        params: data
    })
}
//下载明细

export function downloadInfo(id) {
    return request({
        url: '/move/report/export/' + praseStrEmpty(id),
        method: 'get',
    })
}