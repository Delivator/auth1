<template>
  <v-list height="800" class="overflow-auto app-list">
    <AppListItem
      v-for="(item, i) in items"
      :length="items.length"
      :item="item"
      :index="i"
      :key="i"
    />
    <v-container v-if="items.length < 1">
      <v-row class="text-center mt-4">
        <v-col>
          <h1>No Accounts found</h1>
          <h3>Add one using the + button</h3>
        </v-col>
      </v-row>
    </v-container>
  </v-list>
</template>

<style scoped>
.app-list {
  max-height: calc(100vh - 160px);
}
</style>

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
