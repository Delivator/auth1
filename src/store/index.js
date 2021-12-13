import Vue from "vue";
import Vuex from "vuex";
import { SkynetClient } from "skynet-js";

Vue.use(Vuex);

const client = new SkynetClient(window.PORTAL.origin);

const dataDomain =
  window.location.hostname === "localhost" ? "localhost" : "auth1.hns";

// define async setup function
async function initMySky() {
  try {
    // load invisible iframe and define app's data domain
    // needed for permissions write
    const mySky = await client.loadMySky(dataDomain);

    // load necessary DACs and permissions
    // await mySky.loadDacs(contentRecord);

    // check if user is already logged in with permissions
    const loggedIn = await mySky.checkLogin();

    // set react state for login status and
    // to access mySky in rest of app
    store.commit("setMySky", mySky);
    store.commit("setLoggedIn", loggedIn);
    if (loggedIn) {
      store.commit("setUserID", await mySky.userID());
      store.dispatch("getProfile");
    }
  } catch (e) {
    console.error(e);
  }
}

// call async setup function
initMySky();

const defaultUserSettings = {
  accounts: [],
};

let localUserSettings = JSON.parse(localStorage.getItem("userSettings"));

const store = new Vuex.Store({
  state: {
    mySky: null,
    userID: null,
    profile: null,
    loggedIn: false,
    appLoading: false,
    skynetClient: client,
    userSettings: {
      ...defaultUserSettings,
      ...(localUserSettings ?? defaultUserSettings),
    },
  },

  mutations: {
    setMySky: (state, payload) => {
      state.mySky = payload;
    },

    setUserID: (state, payload) => {
      state.userID = payload;
    },

    setProfile: (state, payload) => {
      state.profile = payload;
    },

    setLoggedIn: (state, payload) => {
      state.loggedIn = payload;
    },

    async setUserSettings(state, payload = {}) {
      const skipSync = payload.skipSync;
      delete payload.skipSync;
      const newUserSettings = {
        ...defaultUserSettings,
        ...state.userSettings,
        ...payload,
      };

      state.appLoading = true;
      state.userSettings = newUserSettings;
      localStorage.userSettings = JSON.stringify(newUserSettings);
      if (!skipSync && !!state.loggedIn)
        await state.mySky.setJSONEncrypted(
          `${dataDomain}/auth1UserSettings.json`,
          newUserSettings
        );
      state.appLoading = false;
    },
  },

  actions: {
    async logInUser() {
      // Try login again, opening pop-up. Returns true if successful
      const status = await store.state.mySky.requestLoginAccess();

      store.commit("setLoggedIn", status);

      if (status) {
        store.commit("setUserID", await store.state.mySky.userID());
        store.dispatch("getUserSettings");
        store.dispatch("getProfile");
      }
    },

    async logOutUser() {
      // call logout to globally logout of mysky
      await store.state.mySky.logout();

      //set store state
      store.commit("setLoggedIn", false);
      store.commit("setProfile", null);
      store.commit("setUserID", null);
    },

    async getProfile({ commit, state }) {
      if (!state.loggedIn) return;

      try {
        const userProfile = await state.mySky.getJSON(
          "profile-dac.hns/profileIndex.json"
        );
        const userPreferences = await state.mySky.getJSON(
          "profile-dac.hns/preferencesIndex.json"
        );

        commit("setProfile", {
          ...userProfile.data.profile,
          ...userPreferences?.data?.preferences,
        });
      } catch (error) {
        console.error("error getting profile");
        console.error(error);
      }
    },

    async getUserSettings({ commit, state }) {
      if (!state.loggedIn) return;

      state.appLoading = true;
      try {
        let { data } = await state.mySky.getJSONEncrypted(
          `${dataDomain}/userSettings.json`
        );
        if (data) commit("setUserSettings", { ...data, skipSync: true });
      } catch (error) {
        console.error("error getting user settings");
        console.error(error);
      }
      state.appLoading = false;
    },
  },

  modules: {},
});

export default store;
