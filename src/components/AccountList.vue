<template>
  <v-list height="800" class="overflow-auto account-list">
    <AccountListItem
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
.account-list {
  max-height: calc(100vh - 160px);
}
</style>

<script>
import AccountListItem from "../components/AccountListItem.vue";

export default {
  props: ["items"],

  components: {
    AccountListItem,
  },

  data: () => ({}),
};
</script>
