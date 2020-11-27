export default {
  namespaced: true,
  state: {
    isNarrow: false,
  },
  mutations: {
    changeNav(state) {
      state.isNarrow = !state.isNarrow;
    }
  },
  actions: {}
};
