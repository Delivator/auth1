<template>
  <v-container>
    <v-row justify="center" class="mt-md-12">
      <v-col sm="8" md="6" lg="4" xl="3">
        <v-card>
          <v-toolbar>
            <v-text-field
              v-model="search"
              label="Search"
              class="mt-6"
              clearable
              dense
              solo
            >
              <template v-slot:append>
                <v-icon v-if="!search">search</v-icon>
              </template>
            </v-text-field>
          </v-toolbar>
          <AccountList :items="filteredAccounts" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AccountList from "../components/AccountList";

export default {
  name: "Home",

  components: {
    AccountList,
  },

  data: () => ({
    search: "",
  }),

  computed: {
    accounts() {
      return this.$store.state.userSettings.accounts ?? [];
    },

    filteredAccounts() {
      if (!this.search) return this.accounts;
      return this.accounts.filter((account) =>
        account.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
};
</script>
