import { queryRule, removeNews } from './service';

const Model = {
  namespace: 'ListTableList',
  state: {
    list: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
    *deleteNews({ payload, callback }, { call }) {
      const response = yield call(removeNews, payload);
      callback(response);
    },
  },
  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
export default Model;
