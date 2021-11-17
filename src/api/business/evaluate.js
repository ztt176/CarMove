/*
 * @Author: your name
 * @Date: 2021-08-25 13:53:13
 * @LastEditTime: 2021-08-25 13:54:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MoveDapWebUi\src\api\business\evaluate.js
 */

import request from '@/utils/request'
// import { praseStrEmpty } from "@/utils/ruoyi";
//获取报告列表
export function listEvaluation(data) {
    return request({
        url: '/move/evaluation/list',
        method: 'get',
        params: data
    })
}
//获取报告列表
export function deleteEvaluate(id) {
    return request({
        url: '/move/evaluation/' + id,
        method: 'delete',
    })
}