/*
 * @Author: your name
 * @Date: 2021-10-14 10:00:10
 * @LastEditTime: 2021-10-14 10:39:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MoveDapWebUi\src\api\business\airborne.js
 */
import request from '@/utils/request'
//列表
export function listRecord(data) {
    return request({
        url: '/fly/record/list',
        method: 'get',
        params: data
    })
}

//删除
export function deleteRecord(id) {
    return request({
        url: '/move/travel/' + id,
        method: 'delete',
    })
}
export function listPath(data) {
    return request({
        url: '/move/data_path',
        method: 'post',
        data: data
    })
}
//新增
export function addRecord(data) {
    return request({
        url: '/move/record',
        method: 'post',
        data: data
    })
}
//导出
export function exportRecord() {
    return request({
        url: '/move/record/export',
        method: 'get',
    })
}