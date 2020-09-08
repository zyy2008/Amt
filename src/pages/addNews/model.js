import {
  queryCategories,
  queryRegions,
  queryStates,
  querySources,
  addNews,
  getInfo,
  updateNew
} from './service';

const Model = {
  namespace: 'newsForm',
  state: {
    Categories: [],
    Regions: [],
    States: [],
    Sources: [],
  },
  effects: {
    * getCategories({
      payload
    }, {
      call,
      put
    }) {
      const response = yield call(queryCategories, payload);
      yield put({
        type: 'categoriesList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    * getRegions({
      payload
    }, {
      call,
      put
    }) {
      const response = yield call(queryRegions, payload);
      yield put({
        type: 'regionsList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    * getStates({
      payload
    }, {
      call,
      put
    }) {
      const response = yield call(queryStates, payload);
      yield put({
        type: 'statesList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    * getSources({
      payload
    }, {
      call,
      put
    }) {
      const response = yield call(querySources, payload);
      yield put({
        type: 'sourcesList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    * cerateNews({
      payload,
      callback
    }, {
      call
    }) {
      const response = yield call(addNews, payload);
      callback(response);
    },
    * getNews({
      payload,
      callback
    }, {
      call
    }) {
      const response = yield call(getInfo, payload);
      callback(response);
    },
    * editNews({
      payload,
      callback
    }, {
      call
    }) {
      const response = yield call(updateNew, payload);
      callback(response);
    },
  },
  reducers: {
    categoriesList(state, action) {
      return {
        ...state,
        Categories: action.payload,
      };
    },
    regionsList(state, action) {
      return {
        ...state,
        Regions: action.payload,
      };
    },
    statesList(state, action) {
      return {
        ...state,
        States: action.payload,
      };
    },
    sourcesList(state, action) {
      return {
        ...state,
        Sources: action.payload,
      };
    },
  },
};
export default Model;
