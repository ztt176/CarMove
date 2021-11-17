/*
 * @Author: your name
 * @Date: 2021-06-22 14:55:33
 * @LastEditTime: 2021-09-03 15:10:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MoveDapWebUi\src\api\business\event.js
 */
import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";
//事件上传
export function eventReport(data) {
    return request({
        url: '/move/event',
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
//获取任务列表
export function getTaskList(data) {
    return request({
        url: '/move/event/list',
        method: 'get',
        params: data
    })
}
//获取事件列表
export function getEvents(data) {
    return request({
        url: '/move/event/list',
        method: 'get',
        params: data
    })
}
//获取事件详细
export function eventInfo(id) {
    return request({
        url: '/move/event/' + praseStrEmpty(id),
        method: 'get',
    })
}
//修改
export function eventUpdate(data) {
    return request({
        url: '/move/event',
        method: 'put',
        data: data
    })
}


//事件确认
export function eventConfirm(data) {
    return request({
        url: '/move/event/confirm',
        method: 'post',
        data: data
    })
}