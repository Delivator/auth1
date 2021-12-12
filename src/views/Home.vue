<template>
  <v-container>
    <v-row v-if="loggedIn" justify="center" class="mt-12">
      <v-col sm="8" md="6" lg="4" xl="3">
        <v-card>
          <v-toolbar>
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
            <v-toolbar-title>auth1</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-text-field label="Search" dense solo class="mt-5">
              <template v-slot:append>
                <v-icon>search</v-icon>
              </template>
            </v-text-field>
            <!-- <v-btn icon>
              <v-icon>search</v-icon>
            </v-btn> -->
          </v-toolbar>
          <AppList :items="apps" />
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
    apps: [{ title: "Kraken" }, { title: "Namebase" }],
  }),

  components: {
    AppList,
  },

  computed: {
    loggedIn() {
      return this.$store.state.loggedIn;
    },
  },
};
</script>
