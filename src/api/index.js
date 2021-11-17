/*
 * @Author: your name
 * @Date: 2021-04-28 09:13:50
 * @LastEditTime: 2021-10-13 11:14:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MoveDapWebUi\src\api\index.js
 */
import request from '@/utils/request';
//显示用户可见的最新走航车位置信息
export function getLastOption() {
    return request({
        url: '/index/move/device_latest',
        method: 'get',
    })
}

//走航模式-走航伪彩图
export function getSailingpics(data) {
    return request({
        url: '/index/move/move-car-pics',
        method: 'post',
        data: data
    })
}
//走航模式-查询二维伪彩图
export function getPcolorpic(data) {
    return request({
        url: '/index/move/two-dimensional-pics',
        method: 'post',
        data: data
    })
}
//查询扫描记录
export function getMoveScans(data) {
    return request({
        url: '/index/move/scans',
        method: 'post',
        data: data
    })
}
//查询锥体
export function getConePics(data) {
    return request({
        url: '/index/move/cone-pics',
        method: 'post',
        data: data
    })
}

//查询剖面
export function getSectorPics(data) {
    return request({
        url: '/index/move/sector-pics',
        method: 'post',
        data: data
    })
}
//查询扇形
export function getPlanPics(data) {
    return request({
        url: '/index/move/plane-scan',
        method: 'post',
        data: data
    })
}

//查询固定位置
export function getPosition(id) {
    return request({
        url: '/index/static/static-position?moveId=' + id,
        method: 'get',
    })
}

//查询固定位置
export function getMoveDevice(data) {
    return request({
        url: '/move/device/list/relevance',
        method: 'get',
        params: data
    })
}

// 修改监测因子参数
export function getFactorInfo(id) {
    return request({
        url: '/move/option/' + id,
        method: 'get',
    })
}
//固定模式 雷达垂直数据
export function getStaticSky(data) {
    return request({
        url: '/index/static/static-sky',
        method: 'post',
        data: data
    })
}

//固定模式 雷达扫描记录
export function getStaticScan(data) {
    return request({
        url: '/index/static/static-scan-records',
        method: 'post',
        data: data
    })
}


// 获得水平和垂直廓线数据
export function getlidarHorizontalVertical(data) {
    return request({
        url: '/index/move/lidar-horizontal-vertical',
        method: 'post',
        data: data
    })
}

//获得鼠标移动显示值
export function getMouseDate(data) {
    return request({
        url: '/index/move/move-vertical-data',
        method: 'post',
        data: data
    })
}


//粒径谱 - - 适配走航、固定模式
export function getDOP(data) {
    return request({
        url: '/index/move/DOP',
        method: 'post',
        data: data
    })
}

//微站 - 适配走航、固定模式
export function getMicroAir(data) {
    return request({
        url: '/index/move/micro-air',
        method: 'post',
        data: data
    })
}
