import request from '@/utils/request'

// 查询载体管理列表
export function listMove(query) {
  return request({
    url: '/move/move/list',
    method: 'get',
    params: query
  })
}

// 查询载体管理详细
export function getMove(id) {
  return request({
    url: '/move/move/' + id,
    method: 'get'
  })
}

// 新增载体管理
export function addMove(data) {
  return request({
    url: '/move/move',
    method: 'post',
    data: data
  })
}

// 修改载体管理
export function updateMove(data) {
  return request({
    url: '/move/move',
    method: 'put',
    data: data
  })
}

// 删除载体管理
export function delMove(id) {
  return request({
    url: '/move/move/' + id,
    method: 'delete'
  })
}

// 导出载体管理
export function exportMove(query) {
  return request({
    url: '/move/move/export',
    method: 'get',
    params: query
  })
}