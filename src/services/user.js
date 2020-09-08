import request from '@/utils/request';
import { getAuthority } from '@/utils/authority';

export async function query() {
  return request('/api/amt-news/oauth/token');
}
export async function queryCurrent() {
  return getAuthority();
}
export async function queryNotices() {
  return request('/api/notices');
}
