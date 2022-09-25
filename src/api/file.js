import request from '@/utils/request';

export function existsApi(params) {
  return request({
    url: '/file/exists',
    method: 'get',
    params
  });
}
