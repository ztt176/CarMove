/*
 * @Author: your name
 * @Date: 2021-05-31 17:18:12
 * @LastEditTime: 2021-06-21 17:53:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MoveDapWebUi\src\api\business\service.js
 */
import request from '@/utils/request'
export function listDept() {
    return request({
        url: '/system/dept/depts',
        method: 'get',
    })
}
export function listService() {
    return request({
        url: '/move/service/list',
        method: 'get',
    })
}

export function listDevice() {
    return request({
        url: '/move/move/list',
        method: 'get',
    })
}

export function putDevice(data) {
    return request({
        url: '/move/service',
        method: 'post',
        data: data
    })
}
export function putTask(data) {
    return request({
        url: '/move/task',
        method: 'post',
        data: data
    })
}
export function updateTask(data) {
    return request({
        url: '/move/task',
        method: 'put',
        data: data
    })
}
//服务计划
export function listTask(data) {
    return request({
        url: '/move/task/list',
        method: 'get',
        params: data
    })
}

//删除服务计划
export function deleteTask(id) {
    return request({
        url: '/move/task/' + id,
        method: 'delete'
    })
}
export function updateService(data) {
    return request({
        url: '/move/service',
        method: 'put',
        data: data
    })
}
export function exportService(query) {
    return request({
        url: '/move/service/export',
        method: 'get',
        params: query
    })
}