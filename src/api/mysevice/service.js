/*
 * @Author: your name
 * @Date: 2021-06-29 14:25:59
 * @LastEditTime: 2021-10-11 10:39:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MoveDapWebUi\src\api\mysevice\service.js
 */
import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";
//获取客户可见服务
export function listService(data) {
    return request({
        url: '/move/service/list',
        method: 'get',
        params: data
    })
}

//获取单个服务目标统计数据
export function serviceInfo(data) {
    return request({
        url: '/move/customer-service/server-census',
        method: 'get',
        params: data
    })
}

//获取全部客户事件
export function eventCustomer(data) {
    return request({
        url: '/move/customer-service/events',
        method: 'get',
        params: data
    })
}

//获取所有服务计划
export function planCustomer(data) {
    return request({
        url: '/move/customer-service/tasks',
        method: 'get',
        params: data
    })
}


//获取所有走航记录
export function recordsCustomer(data) {
    return request({
        url: '/move/customer-service/records',
        method: 'get',
        params: data
    })
}
//查询报告列表
export function reportsCustomer(data) {
    return request({
        url: '/move/report/list-service',
        method: 'get',
        params: data
    })
}

//服务评价
export function submiteEvaluate(data) {
    return request({
        url: '/move/evaluation',
        method: 'post',
        data: data
    })
}

//服务评价
export function listDeptService(deptId) {
    return request({
        url: '/move/service/services-deptId/' + deptId,
        method: 'get',
    })
}

//走航轨迹
export function getPath(moveRecordId) {
    return request({
        url: '/move/travel/' + moveRecordId,
        method: 'get',
    })
}
//飞行记录
export function listAirborne(data) {
    return request({
        url: '/move/customer-service/fly/records',
        method: 'get',
        params: data
    })
}