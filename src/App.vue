<template>
<!-- App.vue -->

<v-app>
  <v-navigation-drawer app v-model="drawer" :width=leftWidth>
    <left-menu :leftMenu="site.leftMenu" @setEditMode="setEditMode" />
  </v-navigation-drawer>

  <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click = "drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ site.title }}</v-toolbar-title>
      <v-btn icon @click="openDialogTitle"><v-icon small>mdi-pencil</v-icon></v-btn>
      <v-spacer></v-spacer>
      <sign />
  </v-app-bar>

<v-dialog
      v-model="dialogTitle"
      width="500"
    >
  <v-card>
    <v-card-title>
      제목수정
      <v-spacer></v-spacer>
      <v-btn icon @click="saveTitle"><v-icon>mdi-content-save</v-icon></v-btn>
      <v-btn icon @click="dialogTitle = false"><v-icon>mdi-close</v-icon></v-btn>
    </v-card-title>
    <v-card-text>
      <v-text-field v-model="site.title" outlined label="제목" @keypress.enter="saveTitle" hide-details></v-text-field>
    </v-card-text>
  </v-card>
</v-dialog>

  <v-main>

    <v-container fluid>

      <router-view></router-view>

    </v-container>
  </v-main>

  <v-footer app color="primary" dark>
    {{ site.footer }}
    <v-btn icon @click="dialogFooter = true"><v-icon small>mdi-pencil</v-icon></v-btn>
    <v-spacer></v-spacer>
    <div>Copy Right</div>
  </v-footer>

<v-dialog
      v-model="dialogFooter"
      width="500"
    >
  <v-card>
    <v-card-title>
      Footer수정
      <v-spacer></v-spacer>
      <v-btn icon @click="saveFooter"><v-icon>mdi-content-save</v-icon></v-btn>
      <v-btn icon @click="dialogFooter = false"><v-icon>mdi-close</v-icon></v-btn>
    </v-card-title>
    <v-card-text>
      <v-text-field v-model="site.footer" outlined label="Footer" @keypress.enter="saveFooter" hide-details></v-text-field>
    </v-card-text>
  </v-card>
</v-dialog>

</v-app>
</template>

<script>
import LeftMenu from './components/site/LeftMenu';
import Sign from './components/site/Sign';

export default {
  name: 'App',
  components: {
    LeftMenu, Sign
  },
  data () {
    return {
      editMode: false,
      leftWidth: 256,
      dialogTitle: false,
      dialogFooter: false,
      drawer: true,
      site: {
        title: '',
        footer: '',
        leftMenu: {
          items: []
        }

        // leftMenu: {
        //   items: [
        //     {
        //       action: 'mdi-ticket',
        //       subItems: [{ title: 'List Item' }],
        //       title: 'Attractions'
        //     },
        //     {
        //       action: 'mdi-silverware-fork-knife',
        //       active: true,
        //       subItems: [
        //         { title: 'Breakfast & brunch' },
        //         { title: 'New American' },
        //         { title: 'Sushi' },
        //         { title: 'About', to: 'About' }
        //       ],
        //       title: 'Dining'
        //     },
        //     {
        //       action: 'mdi-school',
        //       subItems: [{ title: 'List Item' }],
        //       title: 'Education'
        //     },
        //     {
        //       action: 'mdi-run',
        //       subItems: [{ title: 'List Item' }],
        //       title: 'Family'
        //     },
        //     {
        //       action: 'mdi-bottle-tonic-plus',
        //       subItems: [{ title: 'List Item' }],
        //       title: 'Health'
        //     },
        //     {
        //       action: 'mdi-content-cut',
        //       subItems: [{ title: 'List Item' }],
        //       title: 'Office'
        //     },
        //     {
        //       action: 'mdi-tag',
        //       subItems: [{ title: 'List Item' }],
        //       title: 'Promotions'
        //     }
        //   ]
        // }

      }
    };
  },
  created () {
    this.subscribe();
  },
  mounted () {
    console.log('App.vue > firebase', this.$firebase);
  },
  methods: {
    setEditMode () {
      this.editMode = !this.editMode;
      if (this.editMode) {
        this.leftWidth = 400;
      } else {
        this.leftWidth = 256;
      }
    },
    openDialogTitle () {
      this.dialogTitle = true;
    },
    openDialogFooter () {
      this.dialogFooter = true;
    },
    async saveTitle () {
      try {
        this.$firebase.database().ref().child('site').update({ title: this.site.title });
      } finally {
        this.dialogTitle = false;
      }
    },
    async saveFooter () {
      try {
        this.$firebase.database().ref().child('site').update({ footer: this.site.footer });
      } finally {
        this.dialogFooter = false;
      }
    },
    subscribe () {
      this.$firebase.database().ref().child('site').on('value', (sn) => {
        const v = sn.val();
        if (!v) {
          this.$firebase.database().ref().child('site').set(this.site);
          return;
        }
        this.site = v;
      }, (e) => {
        console.log(e.message);
      });
    },
    save () {
      console.log('save...');
      this.$firebase.database().ref().child('abcd').set({
        title: '제목', text: '제목 타이틀'
      });
    },
    read () {
      this.$firebase.database().ref().child('abcd').once('value', (sn) => {
        console.log(sn);
        console.log(sn.val());
      });
    }
  }
};
</script>
