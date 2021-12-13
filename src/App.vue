<template>
  <v-app>
    <v-app-bar app color="primary" dark height="50">
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
          </v-list>
        </v-menu>
      </div>
      <div v-else>
        <v-btn text v-if="mySky" @click="logInUser">
          <span class="mr-2">Login with MySky</span>
          <v-icon>login</v-icon>
        </v-btn>
        <v-btn text v-else>
          <span class="mr-2">Loading MySky...</span>
        </v-btn>
      </div>
    </v-app-bar>

    <v-btn fab large bottom right absolute class="ma-6 mb-16">
      <v-icon>add</v-icon>
    </v-btn>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
html {
  overflow: auto;
}
</style>

<script>
export default {
  name: "App",

  data: () => ({
    //
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
  },

  methods: {
    logInUser() {
      this.$store.dispatch("logInUser");
    },

    logOutUser() {
      this.$store.dispatch("logOutUser");
    },
  },
};
</script>
