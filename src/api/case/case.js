/*
 * @Author: your name
 * @Date: 2021-09-02 11:39:57
 * @LastEditTime: 2021-09-03 11:09:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MoveDapWebUi\src\api\case\case.js
 */
import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询栏目列表
export function listColumn() {
    return request({
        url: '/move/subject/list',
        method: 'get',
    })
}
// 新增栏目
export function addColumn(data) {
    return request({
        url: '/move/subject',
        method: 'post',
        data: data
    })
}
// 修改栏目
export function updateSubject(data) {
    return request({
        url: '/move/subject',
        method: 'put',
        data: data
    })
}
// 删除栏目
export function deleteSubject(id) {
    return request({
        url: '/move/subject/' + id,
        method: 'delete',
    })
}

// 查询案例统计数据
export function caseCount(data) {
    return request({
        url: '/move/case/list/count',
        method: 'get',
        params: data
    })
}
// 查询案例列表
export function listCase(data) {
    return request({
        url: '/move/case/list',
        method: 'get',
        params: data
    })
}

// 发布案例
export function publishCase(data) {
    return request({
        url: '/move/case/publish',
        method: 'post',
        data: data
    })
}

// 保存案例
export function saveCase(data) {
    return request({
        url: '/move/case/save',
        method: 'post',
        data: data
    })
}

// 发布并保存案例
export function savePubCase(data) {
    return request({
        url: '/move/case/publish',
        method: 'put',
        data: data
    })
}

// 查询案例详情
export function caseInfo(id) {
    return request({
        url: '/move/case/' + id,
        method: 'get',
    })
}

// 发布并保存案例
export function updateCase(data) {
    return request({
        url: '/move/case',
        method: 'put',
        data: data
    })
}

// 删除案例
export function deleteCase(id) {
    return request({
        url: '/move/case/' + id,
        method: 'delete',
    })
}