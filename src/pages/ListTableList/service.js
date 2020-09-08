import request from '@/utils/request';

export async function queryRule(params) {
  return request('/api/news', {
    params,
  });
}
export async function removeNews(id) {
  return request('/api/news/' + id, {
    method: 'DELETE',
  });
}
export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}
export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
