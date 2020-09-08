import request from '@/utils/request';

export async function queryCategories(params) {
  return request('/api/news/categories', {
    params,
  });
}
export async function queryRegions(params) {
  return request('/api/regions', {
    params,
  });
}

export async function queryStates(params) {
  return request('/api/states', {
    params,
  });
}
export async function querySources(params) {
  return request('/api/news/sources', {
    params,
  });
}
export async function addNews(params) {
  return request('/api/news', {
    method: 'POST',
    data: params,
  });
}
export async function getInfo(params) {
  return request('/api/news/' + params);
}
export async function updateNew(params) {
  return request('/api/news/' + params.id, {
    method: 'PUT',
    data: params.values,
  });
}
