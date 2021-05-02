import Vue from 'vue';
import Vuex from 'vuex';
import router from '../router';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    editable: true,
    fireUser: null
  },
  mutations: {
    setEdit: (state, edit) => {
      state.editable = edit;
    },
    setFireUser: (state, fu) => {
      state.fireUser = fu;
    }
  },
  actions: {
    signOut: () => {
      router.push('/');
    }

  },
  modules: {
  }
});
