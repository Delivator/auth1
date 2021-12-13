<template>
  <div>
    <v-list-item>
      <v-list-item-icon>
        <v-icon class="mt-2">apps</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title v-text="item.title" class="text-h5">
        </v-list-item-title>
        <v-list-item-subtitle class="text-h6 font-weight-light">
          <span class="mr-2">{{ code.substr(0, 3) }}</span>
          <span>{{ code.substr(3) }}</span>
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
    <v-divider v-if="!index % 2" inset></v-divider>
  </div>
</template>

<script>
import twoFA from "2fa-utils";

export default {
  props: ["item", "index"],

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
      if (15 <= time && time <= 25) return "lime";
      if (25 < time) return "red";
    },

    generateCode() {
      return twoFA.generateTOTP(this.item.secret).toString();
    },
  },
};
</script>
