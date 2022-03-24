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
          <AccountList :items="filteredAccounts" :countdown="countdown" />
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
    countdown: (new Date().getSeconds() % 30) + 1,
    interval: null,
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

  methods: {
    timeColor(time) {
      if (time < 15) return "green";
      if (15 <= time && time <= 20) return "lime";
      if (20 <= time && time <= 25) return "orange";
      if (25 < time) return "red lighten-2";
    },
  },

  mounted() {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.countdown = (new Date().getSeconds() % 30) + 1;
    }, 1000);
  },
};
</script>
