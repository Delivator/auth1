<template>
  <div>
    <v-list-item>
      <v-list-item-icon>
        <v-icon class="mt-2">apps</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title v-text="item.title" class="text-h6">
        </v-list-item-title>
        <v-list-item-subtitle class="text-h6 font-weight-light">
          <span class="mr-2">012</span>
          <span>345</span>
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
export default {
  props: ["item", "index"],

  data: () => ({
    countdown: new Date().getSeconds() % 30,
  }),

  mounted() {
    setInterval(() => {
      this.countdown = new Date().getSeconds() % 30;
    }, 500);
  },

  methods: {
    timeColor(time) {
      if (time < 15) return "green";
      if (15 <= time && time <= 25) return "lime";
      if (25 < time) return "warn";
    },
  },
};
</script>
