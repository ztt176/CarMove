import request from '@/utils/request'

// 查询监测因子管理列表
export function listFactor(query) {
    return request({
        url: '/move/factor/list',
        method: 'get',
        params: query
    })
}

// 查询监测因子管理详细
export function getFactor(id) {
    return request({
        url: '/move/factor/' + id,
        method: 'get'
    })
}

// 新增监测因子管理
export function addFactor(data) {
    return request({
        url: '/move/factor',
        method: 'post',
        data: data
    })
}

// 修改监测因子管理
export function updateFactor(data) {
    return request({
        url: '/move/factor',
        method: 'put',
        data: data
    })
}

// 删除监测因子管理
export function delFactor(id) {
    return request({
        url: '/move/factor/' + id,
        method: 'delete'
    })
}

// 导出监测因子管理
export function exportFactor(query) {
    return request({
        url: '/move/factor/export',
        method: 'get',
        params: query
    })
}
// 修改监测因子参数
export function updateOption(data) {
    return request({
        url: '/move/option',
        method: 'put',
        data: data
    })
}