<template>
  <div>
    <v-btn fab fixed top right color="red" class="close-btn" @click="close">
      <v-icon>close</v-icon>
    </v-btn>
    <video id="scanner-video"></video>
  </div>
</template>

<style scoped>
video {
  background-color: black;
  transform: scaleX(-1);
  position: fixed;
  z-index: 1000;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
}

.close-btn {
  z-index: 1001;
}
</style>

<script>
import QrScanner from "qr-scanner";

QrScanner.WORKER_PATH = "/qr-scanner-worker.min.js";
let qrScanner;

export default {
  methods: {
    startScanner() {
      const video = document.getElementById("scanner-video");
      qrScanner = new QrScanner(video, (result) => {
        this.$emit("onscan", result);
        this.close();
      });

      qrScanner.start();
    },

    stopScanner() {
      if (qrScanner) qrScanner.stop();
    },

    close() {
      this.stopScanner();
      this.$emit("update:showScanner", false);
    },
  },
};
</script>
