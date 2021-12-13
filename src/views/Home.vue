<template>
  <v-container>
    <v-row v-if="loggedIn" justify="center" class="mt-12">
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
          <AppList :items="filteredApps" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppList from "../components/AppList";

export default {
  name: "Home",

  data: () => ({
    search: "",
  }),

  components: {
    AppList,
  },

  computed: {
    loggedIn() {
      return this.$store.state.loggedIn;
    },

    apps() {
      return this.$store.state.userSettings.apps ?? [];
    },

    filteredApps() {
      if (!this.search) return this.apps;
      return this.apps.filter((app) =>
        app.title.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
};
</script>
