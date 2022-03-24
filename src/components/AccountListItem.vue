<template>
  <div>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="text-h5 grey darken-2">
          Remove this account?
        </v-card-title>
        <v-card-text class="mt-4 body-1">
          Are you sure you want to remove the account
          <span v-text="item.name" class="font-weight-bold"></span>? This
          <span class="font-weight-bold">cannot</span> be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" outlined @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="red darken-1" @click="removeAccount(index)">
            Remove
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-hover v-slot="{ hover }">
      <v-list-item @click="copyCode()" @mouseleave="copied = false">
        <v-list-item-icon class="text-center">
          <v-avatar v-if="item.logo" size="24" tile class="mt-3">
            <img :src="portalSrc(item.logo)" alt="Account Logo" />
          </v-avatar>
          <v-icon v-else class="mt-3">person</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="item.name" class="text-h5">
          </v-list-item-title>
          <v-list-item-subtitle class="text-h5 font-weight-light">
            <span class="mr-2">{{ code.substr(0, 3) }}</span>
            <span class="mr-1">{{ code.substr(3) }}</span>
            <v-tooltip bottom :value="copied">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  small
                  v-on="on"
                  color="grey"
                  v-bind="attrs"
                  class="copy-icon"
                  :class="{ 'on-hover': hover }"
                >
                  content_copy
                </v-icon>
              </template>
              <span>{{ copied ? "Copied" : "Click to copy" }}</span>
            </v-tooltip>
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-icon>
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                fab
                text
                small
                v-on="on"
                color="error"
                v-bind="attrs"
                class="remove-btn mt-1 mr-2"
                @click="dialog = true"
                :class="{ 'on-hover': hover }"
              >
                <v-icon>delete</v-icon>
              </v-btn>
            </template>
            <span>Remove Account</span>
          </v-tooltip>
          <v-progress-circular
            class="mt-2"
            :color="timeColor(countdown)"
            :value="100 - countdown * (100 / 30)"
          >
          </v-progress-circular>
        </v-list-item-icon>
      </v-list-item>
    </v-hover>
    <v-divider v-if="index != length - 1" inset />
    <v-list-item v-if="index === length - 1"></v-list-item>
  </div>
</template>

<style scoped>
.copy-icon,
.remove-btn {
  transition: opacity 0.2s ease-in-out;
  opacity: 0;
}

.on-hover {
  opacity: 1;
}
</style>

<script>
import twoFA from "2fa-utils";

export default {
  props: ["item", "index", "length", "countdown"],

  data() {
    return {
      code: this.generateCode(),
      showContext: true,
      interval: null,
      copied: false,
      dialog: false,
    };
  },

  mounted() {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.code = this.generateCode();
    }, 1000);
  },

  methods: {
    timeColor(time) {
      if (time < 15) return "green";
      if (15 <= time && time <= 20) return "lime";
      if (20 <= time && time <= 25) return "orange";
      if (25 < time) return "red lighten-2";
    },

    generateCode() {
      try {
        const code = twoFA.generateTOTP(this.item.secret).toString();
        return code;
      } catch (error) {
        console.error(error);
        return "000000";
      }
    },

    copyCode() {
      navigator.clipboard.writeText(this.code);
      this.copied = true;
    },

    portalSrc(skylink) {
      return window.PORTAL + skylink.substr(6);
    },

    removeAccount(index) {
      let accounts = this.$store.state.userSettings.accounts;
      accounts.splice(index, 1);
      this.$store.commit("setUserSettings", { accounts });
      this.dialog = false;
    },
  },
};
</script>
