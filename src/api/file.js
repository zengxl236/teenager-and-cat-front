import request from '@/utils/request';

export function existsApi(params) {
  return request({
    url: '/file/exists',
    method: 'get',
    params
  });
}

export function uploadApi(data, onUploadProgress) {
  return request({
    url: '/file/upload',
    method: 'post',
    onUploadProgress,
    data
  });
}
