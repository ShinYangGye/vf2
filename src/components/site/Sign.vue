<template>
    <div>
        <v-progress-circular indeterminate v-if="loading"></v-progress-circular>
        <v-menu offset-y v-else-if="!$store.state.fireUser">
            <template v-slot:activator="{ on, attrs }">
                <v-btn icon
                v-bind="attrs"
                v-on="on">
                <v-icon>mdi-account</v-icon></v-btn>
            </template>
            <v-card>
                <v-card-title>로그인</v-card-title>
                <v-card-text>aaaaa</v-card-text>
                <v-card-actions>
                    <v-btn color="red" block dark @click="signInWithGoogle"><v-icon>mdi-google</v-icon> 구글 로그인</v-btn>
                </v-card-actions>

            </v-card>
        </v-menu>

        <v-menu offset-y v-else>
            <template v-slot:activator="{ on, attrs }">
                <v-btn icon
                v-bind="attrs"
                v-on="on">
                    <v-avatar size="32"><v-img :src="$store.state.fireUser.photoURL"></v-img></v-avatar>
                </v-btn>
            </template>
            <v-card>
                <v-card-title>정보</v-card-title>
                <v-card-text>aaaaa</v-card-text>

                <v-card-actions>
                    <v-btn color="primary" block dark @click="signOut"><v-icon>mdi-google</v-icon> 로그아웃</v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>

    </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      email: null
    };
  },
  methods: {
    async signInWithGoogle () {
      const provider = new this.$firebase.auth.GoogleAuthProvider();
      this.$firebase.auth().languageCode = 'ko';
      this.loading = true;
      try {
        const sn = await this.$firebase.auth().signInWithPopup(provider);
        this.$store.commit('setFireUser', sn.user);
        console.log('SignIn', sn.user.email);
      } finally {
        this.loading = false;
      }
    },
    signOut () {
      this.$firebase.auth().signOut();
    }
  }
};

</script>
