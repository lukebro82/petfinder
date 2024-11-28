const apiBaseUrl = process.env.API_BASE_URL;

const state = {
  data: {
    lat: 0,
    lng: 0,
    userId: "",
    userEmail: "",
    token: "",
    petCerca: [],
    misPets: [],
    miPetEdit: {
      id: "",
      name: "",
      photo: "",
      lat: "",
      lng: "",
      location: "",
    },
  },

  listeners: [],

  getState() {
    return this.data;
  },

  setState(state) {
    this.data = state;
    for (const cb of this.listeners) {
      cb();
    }
  },

  subscribe(cb: (any) => any) {
    this.listeners.push(cb);
  },

  init() {
    const savedToken = localStorage.getItem("token");
    const savedEmail = localStorage.getItem("userEmail");

    if (savedToken && savedEmail) {
      this.data.token = savedToken;
      this.data.userEmail = savedEmail;
    }
  },

  async userSignUp(name, email, password) {
    return fetch(apiBaseUrl + "/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    }).then((res) => {
      return res.json();
    });
  },

  async userLogin(email, password) {
    return fetch(apiBaseUrl + "/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.token) {
          // Actualizamos el estado
          const currentState = this.getState();
          currentState.token = data.token;
          currentState.userEmail = email;
          this.setState(currentState);

          // Guardamos el token y el email en localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("userEmail", email);
        }
        return data;
      });
  },

  async logout() {
    this.data.token = "";
    this.data.userEmail = "";
    this.data.userId = "";
    this.data.misPets = [];
    this.data.petCerca = [];
    this.data.miPetEdit.id = "";
    this.data.miPetEdit.location = "";
    this.data.miPetEdit.name = "";
    this.data.miPetEdit.lat = "";
    this.data.miPetEdit.lng = "";
    this.data.miPetEdit.photo = "";
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
  },

  async petsCerca(last_lat, last_lng) {
    return fetch(
      apiBaseUrl +
        "/pets/cerca?" +
        "last_lat=" +
        last_lat +
        "&" +
        "last_lng=" +
        last_lng,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    ).then((res) => {
      return res.json();
    });
  },

  async petsMios() {
    return fetch(apiBaseUrl + "/pets/mios", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.data.token}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        state.data.misPets = res.message;
      });
  },

  async createReportPet(petData) {
    return fetch(apiBaseUrl + "/pet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.data.token}`,
      },
      body: JSON.stringify({
        name: petData.name,
        photo: petData.photo,
        last_lat: petData.lat,
        last_lng: petData.lng,
        lastLocation: petData.location,
      }),
    }).then((res) => {
      return res.json();
    });
  },

  // async getPet(petid) {
  //   return fetch(apiBaseUrl + "/pet?id=" + petid, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${state.data.token}`,
  //     },
  //   }).then((res) => {
  //     return res.json();
  //   });
  // },

  async deletePet(petid, photoURL) {
    return fetch(apiBaseUrl + "/pet", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.data.token}`,
      },
      body: JSON.stringify({
        id: petid,
        photoURL: photoURL,
      }),
    }).then((res) => {
      return res.json();
    });
  },

  async patchPet(pet) {
    return fetch(apiBaseUrl + "/pet", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.data.token}`,
      },
      body: JSON.stringify({
        id: pet.id,
        name: pet.name,
        photo: pet.photo,
        lat: pet.lat,
        lng: pet.lng,
        location: pet.location,
      }),
    }).then((res) => {
      return res.json();
    });
  },

  async senMail(petid, message, from, tel) {
    return fetch(apiBaseUrl + "/mail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        petid,
        message,
        from,
        tel,
      }),
    }).then((res) => {
      return res.json();
    });
  },

  async patchUser(name, location) {
    return fetch(apiBaseUrl + "/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.data.token}`,
      },
      body: JSON.stringify({
        name: name,
        location: location,
      }),
    }).then((res) => {
      return res.json();
    });
  },
  async newPassword(email, password) {
    return fetch(apiBaseUrl + "/auth", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.data.token}`,
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }).then((res) => {
      return res.json();
    });
  },
};

export { state };
