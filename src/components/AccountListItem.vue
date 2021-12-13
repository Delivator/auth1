<template>
  <div>
    <v-hover v-slot="{ hover }">
      <v-list-item @click="copyCode()">
        <v-list-item-icon class="text-center">
          <v-avatar v-if="item.logo" size="24" tile class="mt-4">
            <img :src="portalSrc(item.logo)" alt="Account Logo" />
          </v-avatar>
          <v-icon v-else class="mt-3">person</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="item.name" class="text-h5">
          </v-list-item-title>
          <v-list-item-subtitle class="text-h6 font-weight-light">
            <span class="mr-2">{{ code.substr(0, 3) }}</span>
            <span class="mr-1">{{ code.substr(3) }}</span>
            <v-icon
              small
              color="grey"
              class="copy-icon"
              :class="{ 'on-hover': hover }"
            >
              content_copy
            </v-icon>
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-icon>
          <v-progress-circular
            class="mt-2"
            :color="timeColor(countdown)"
            :value="countdown * (100 / 30)"
          ></v-progress-circular>
        </v-list-item-icon>
      </v-list-item>
    </v-hover>
    <v-divider v-if="index !== length - 1" inset></v-divider>
  </div>
</template>

<style scoped>
.copy-icon {
  transition: opacity 0.2s ease-in-out;
  opacity: 0;
}

.copy-icon.on-hover {
  opacity: 1;
}
</style>

<script>
import twoFA from "2fa-utils";

export default {
  props: ["item", "index", "length"],

  data() {
    return {
      countdown: (new Date().getSeconds() % 30) + 1,
      code: this.generateCode(),
    };
  },

  mounted() {
    setInterval(() => {
      this.countdown = (new Date().getSeconds() % 30) + 1;
      this.code = this.generateCode();
    }, 100);
  },

  methods: {
    timeColor(time) {
      if (time < 15) return "green";
      if (15 <= time && time <= 20) return "lime";
      if (20 <= time && time <= 25) return "orange";
      if (25 < time) return "red lighten-2";
    },

    generateCode() {
      return twoFA.generateTOTP(this.item.secret).toString();
    },

    copyCode() {
      navigator.clipboard.writeText(this.code);
    },

    portalSrc(skylink) {
      return window.PORTAL + skylink.substr(6);
    },
  },
};
</script>
