<template>
  <v-app>
    <v-app-bar app color="primary" dark height="50" hide-on-scroll>
      <div class="d-flex align-center">
        <h2>Auth1</h2>
      </div>

      <v-spacer></v-spacer>

      <div v-if="loggedIn">
        <span class="mr-4 text-h6">{{ username }}</span>
        <v-menu rounded="lg" offset-y>
          <template v-slot:activator="{ attrs, on }">
            <v-btn fab small v-bind="attrs" v-on="on">
              <v-icon>account_circle</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item @click="logOutUser">
              <v-list-item-title>Log Out</v-list-item-title>
              <v-list-item-icon><v-icon>logout</v-icon></v-list-item-icon>
            </v-list-item>
            <v-divider />
            <v-list-item @click="dialog = true">
              <v-list-item-title>Reset all Accounts</v-list-item-title>
              <v-list-item-icon>
                <v-icon color="red">delete_forever</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div v-else>
        <v-btn text v-if="mySky" @click="logInUser">
          <span class="mr-2">Login with MySky</span>
          <v-icon>login</v-icon>
        </v-btn>
        <v-btn text v-else disabled>
          <span class="mr-2">Loading MySky...</span>
        </v-btn>
      </div>
    </v-app-bar>

    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="text-h5">Reset Everything?</v-card-title>
        <v-card-text>
          Reset app data and remove all accounts? This
          <span class="font-weight-bold">cannot</span> be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="red darken-1" @click="resetAll">Reset</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-main>
      <v-progress-linear
        absolute
        color="blue"
        :active="appLoading"
        :indeterminate="appLoading"
      ></v-progress-linear>
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
html {
  overflow: auto !important;
}
</style>

<script>
export default {
  name: "App",

  data: () => ({
    dialog: false,
  }),

  computed: {
    mySky() {
      return this.$store.state.mySky;
    },

    loggedIn() {
      return this.$store.state.loggedIn;
    },

    mySkyProfile() {
      return this.$store.state.profile;
    },

    username() {
      if (!this.loggedIn || !this.$store.state.userID) return null;
      return this.mySkyProfile?.username ?? "Anonymous";
    },

    avatar() {
      if (!this.loggedIn || !this.$store.state.userID) return null;
      return this.mySkyProfile?.avatar?.[0]?.url ?? null;
    },

    client() {
      return this.$store.state.skynetClient;
    },

    appLoading() {
      return this.$store.state.appLoading;
    },
  },

  methods: {
    logInUser() {
      this.$store.dispatch("logInUser");
    },

    logOutUser() {
      this.$store.dispatch("logOutUser");
    },

    resetAll() {
      this.$store.commit("setUserSettings", { accounts: [] });
      this.dialog = false;
    },
  },
};
</script>
