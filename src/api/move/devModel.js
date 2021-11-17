import request from '@/utils/request'

// 查询设备型号管理列表
export function listDevModel(query) {
  return request({
    url: '/move/devModel/list',
    method: 'get',
    params: query
  })
}

// 查询设备型号管理详细
export function getDevModel(id) {
  return request({
    url: '/move/devModel/' + id,
    method: 'get'
  })
}

// 新增设备型号管理
export function addDevModel(data) {
  return request({
    url: '/move/devModel',
    method: 'post',
    data: data
  })
}

// 修改设备型号管理
export function updateDevModel(data) {
  return request({
    url: '/move/devModel',
    method: 'put',
    data: data
  })
}

// 删除设备型号管理
export function delDevModel(id) {
  return request({
    url: '/move/devModel/' + id,
    method: 'delete'
  })
}

// 导出设备型号管理
export function exportDevModel(query) {
  return request({
    url: '/move/devModel/export',
    method: 'get',
    params: query
  })
}