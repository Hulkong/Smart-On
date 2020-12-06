<template>
  <div id="generalElection">
    <v-container fluid class="third _parent_layout" style="height:100vh;">
      <v-layout row fill-height>
        <v-flex>
          <router-view></router-view>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import SggSelect from "@/components/sgg-select";
import SggLayer from "@/components/sgg-layer";
export default {
  name: "generalElection",

  data() {
    return {};
  },

  components: {
    "sgg-select": SggSelect,
    "sgg-layer": SggLayer
  },

  computed: {},

  methods: {},

  created() {},

  mounted() {}
};
</script>

<style scoped></style>
