import request from '@/utils/request';
export async function fakeAccountLogin(params) {
  return request('/api/amt-news/oauth/token', {
    method: 'POST',
    data: 'grant_type=password&username=' + params.username + '&password=' + params.password,
    login: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function loginOut() {
  return request(`/api/logout`, {
    method: 'DELETE',
  });
}
