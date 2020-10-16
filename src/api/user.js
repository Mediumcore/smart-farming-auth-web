import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/api/v1/security/login',
    method: 'post',
    params: {
      username, password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/api/v1/token/user',
    method: 'get',
    params: {token}
  })
}

export function removeUser(uid) {
  return request({
    url: '/api/v1/security/users/' + uid,
    method: 'delete',
  })
}

export function saveUser(data) {
  return request({
    url: '/api/v1/security/registry',
    method: 'post',
    data
  })
}

export function getUsers(pageNum, pageSize) {
  return request({
    url: '/api/v1/security/users',
    method: 'get',
    params: {
      pageNum: pageNum,
      pageSize: pageSize,
    }
  })
}

export function logout() {
  return request({
    url: '/mock/vue-admin-template/user/logout',
    method: 'post'
  })
}
