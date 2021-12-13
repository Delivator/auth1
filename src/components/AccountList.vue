<template>
  <v-list height="800" class="overflow-auto account-list">
    <AccountListItem
      v-for="(item, i) in items"
      :length="items.length"
      :item="item"
      :index="i"
      :key="i"
    />
    <v-container v-if="!loggedIn && items.length < 1">
      <v-row class="text-center mt-4">
        <v-col cols="12">
          <h1>Not logged in</h1>
        </v-col>
        <v-col cols="12">
          <v-btn text v-if="mySky" @click="logInUser">
            <span class="mr-2">Login with MySky</span>
            <v-icon>login</v-icon>
          </v-btn>
          <v-btn text v-else disabled>
            <span>Loading MySky...</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-if="loggedIn && items.length < 1">
      <v-row class="text-center mt-4">
        <v-col>
          <h1>No Accounts found</h1>
          <h3>Add one using the + button</h3>
        </v-col>
      </v-row>
    </v-container>
    <v-btn
      fab
      large
      absolute
      color="blue"
      class="add-btn"
      @click="showDialog = true"
    >
      <v-icon>add</v-icon>
    </v-btn>
    <AddAccountDialog :show.sync="showDialog" />
  </v-list>
</template>

<style scoped>
.account-list {
  max-height: calc(100vh - 86px);
}

.add-btn {
  bottom: 16px;
  right: 16px;
}
</style>

<script>
import AddAccountDialog from "../components/AddAccountDialog";
import AccountListItem from "../components/AccountListItem";

export default {
  props: ["items"],

  components: {
    AddAccountDialog,
    AccountListItem,
  },

  data: () => ({
    showDialog: false,
  }),

  computed: {
    mySky() {
      return this.$store.state.mySky;
    },

    loggedIn() {
      return this.$store.state.loggedIn;
    },
  },

  methods: {
    logInUser() {
      this.$store.dispatch("logInUser");
    },
  },
};
</script>
