<template>
  <v-list>
    <AppListItem v-for="(item, i) in items" :key="i" :index="i" :item="item" />
  </v-list>
</template>

<script>
import AppListItem from "../components/AppListItem.vue";

export default {
  props: ["items"],

  components: {
    AppListItem,
  },

  data: () => ({}),
};
</script>
