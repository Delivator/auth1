<template>
  <div class="text-center">
    <QrScanner
      :showScanner.sync="showScanner"
      v-show="showScanner"
      ref="scanner"
      @onscan="onScan"
    />
    <v-dialog :value="show" width="500" @click:outside="close">
      <v-form @submit="addAccount" ref="form" v-model="valid">
        <v-card>
          <v-card-title class="text-h5 primary">Add New Account</v-card-title>

          <div class="ma-4">
            <v-tooltip v-if="logo" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  fab
                  text
                  x-small
                  absolute
                  v-on="on"
                  color="red"
                  v-bind="attrs"
                  class="remove-logo-btn"
                  @click="logo = ''"
                >
                  <v-icon>delete</v-icon>
                </v-btn>
              </template>
              <span>Remove Logo</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-avatar
                  class="float-right ml-4"
                  @click="$refs.file.click()"
                  v-bind="attrs"
                  v-on="on"
                  tile
                >
                  <v-progress-circular
                    v-if="imgLoading"
                    indeterminate
                  ></v-progress-circular>
                  <img
                    v-if="logo"
                    v-show="!imgLoading"
                    :src="portalSrc(logo)"
                    @load="imgLoading = !imgLoading"
                  />
                  <v-icon v-if="!logo && !imgLoading">person</v-icon>
                </v-avatar>
              </template>
              <span>Upload Logo</span>
            </v-tooltip>
            <v-text-field
              clearable
              v-model="name"
              label="Account Name"
              :rules="nameRules"
            ></v-text-field>
            <v-text-field
              clearable
              label="Secret"
              v-model="secret"
              :rules="secretRules"
            ></v-text-field>

            <input
              class="file-input"
              ref="file"
              type="file"
              accept="image/*"
              @change="uploadLogo"
            />
          </div>

          <v-divider></v-divider>

          <v-card-actions class="grey darken-4">
            <v-btn outlined color="green" @click="openScanner">
              QR-Scanner
              <v-icon right>qr_code_scanner</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click="close">Cancel</v-btn>
            <v-btn
              text
              type="submit"
              color="primary"
              @click="addAccount"
              :disabled="!valid"
            >
              Add
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<style scoped>
.file-input {
  display: none;
}

.remove-logo-btn {
  right: 5px;
  top: 63px;
}
</style>

<script>
import QrScanner from "./QrScanner.vue";

export default {
  props: ["show"],

  components: {
    QrScanner,
  },

  data: () => ({
    name: "",
    logo: "",
    secret: "",
    valid: true,
    nameRules: [(v) => !!v || "Name is required"],
    secretRules: [
      (v) => !!v || "Secret is required",
      (v) => /^[A-Z2-7=]+$/.test(v) || "Invalid Secret",
    ],
    imgLoading: false,
    showScanner: false,
  }),

  computed: {
    client() {
      return this.$store.state.skynetClient;
    },
  },

  methods: {
    close() {
      this.$emit("update:show", false);
      this.$refs.form.resetValidation();
    },

    validate() {
      this.$refs.form.validate();
    },

    async uploadLogo(event) {
      if (event.target.files?.length !== 1) return;
      const file = event.target.files[0];
      try {
        this.imgLoading = true;
        const { skylink } = await this.client.uploadFile(file);
        this.logo = skylink;
      } catch (error) {
        console.error(error);
      }
    },

    addAccount(event) {
      event.preventDefault();
      let accounts = this.$store.state.userSettings.accounts;
      accounts.push({
        name: this.name,
        logo: this.logo,
        secret: this.secret,
      });
      this.$store.commit("setUserSettings", { accounts });
      this.name = "";
      this.secret = "";
      this.close();
    },

    portalSrc(skylink) {
      return window.PORTAL + skylink.substr(6);
    },

    openScanner() {
      this.showScanner = true;
      this.$refs.scanner.startScanner();
    },

    closeScanner() {
      this.$refs.scanner.stopScanner();
      this.showScanner = false;
    },

    parseQr(string) {
      const keyUri = new URL(string);
      if (!keyUri || !keyUri?.pathname.startsWith("//totp/")) return;
      const label = decodeURIComponent(keyUri.pathname.substr(7)).split(":");
      const issuer = keyUri.searchParams.get("issuer");
      const secret = keyUri.searchParams.get("secret");
      if (!secret) return alert("Invalid QR Code");
      const name = issuer
        ? `${issuer} (${label[1]})`
        : `${label[0]} (${label[1]})`;
      this.name = name;
      this.secret = secret;
    },

    onScan(string) {
      this.parseQr(string);
    },
  },

  mounted() {
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "Escape":
          if (this.showScanner) this.closeScanner();
          break;
        default:
          break;
      }
    });
  },
};
</script>
