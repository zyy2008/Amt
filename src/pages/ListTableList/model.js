import { queryRule, removeNews } from './service';

const Model = {
  namespace: 'ListTableList',
  state: {
    list: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      let copy;
      console.log(response);
      switch (typeof response) {
        case 'object':
          copy = response;
          break;
        case 'string':
          copy = JSON.parse(response);
          break;
        case 'undefined':
        default:
          copy = {
            list: [],
            totalCount: 0,
          };
          break;
      }
      yield put({
        type: 'queryList',
        payload: copy,
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
