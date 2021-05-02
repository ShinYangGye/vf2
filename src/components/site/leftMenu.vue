<template>
<div>
    <template>
      <v-list-item two-line :to="{name: 'Home'}">
        <v-list-item-avatar>
          <img src="https://randomuser.me/api/portraits/women/81.jpg">
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>Jane Smith</v-list-item-title>
          <v-list-item-subtitle>Logged In</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
            <v-btn icon @click="setEditMode" v-show="!editMode">
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="setEditMode"  v-show="editMode">
              <v-icon small>mdi-eye</v-icon>
            </v-btn>
          </v-list-item-action>
      </v-list-item>

    </template>

    <v-divider></v-divider>

    <v-list class="grey lighten-2 pa-0">
      <v-list-group
        v-for="(item, i) in leftMenu.items"
        :key="i"
        v-model="item.active"
        :prepend-icon="item.action"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>

          <v-list-item-action v-show="editMode" v-if="i>0">
            <v-btn icon small @click.stop="moveLeftMenu (leftMenu.items, i, -1)"><v-icon small>mdi-arrow-up-bold-circle-outline</v-icon></v-btn>
          </v-list-item-action>

          <v-list-item-action v-show="editMode" v-if="i<leftMenu.items.length-1">
            <v-btn icon small><v-icon small @click.stop="moveLeftMenu (leftMenu.items, i, 1)">mdi-arrow-down-bold-circle-outline</v-icon></v-btn>
          </v-list-item-action>
          <v-list-item-action v-show="editMode" v-else class="pr-7"></v-list-item-action>

          <v-list-item-action v-show="editMode">
            <v-btn icon small><v-icon small @click.stop="removeLeftMenu (leftMenu.items, i)">mdi-delete</v-icon></v-btn>
          </v-list-item-action>
          <v-list-item-action v-show="editMode">
            <v-btn icon small @click.stop="openDialog(i, 'main')"><v-icon small>mdi-pencil</v-icon></v-btn>
          </v-list-item-action>
        </template>

        <v-list-item
          v-for="(child, j) in leftMenu.items[i].subItems"
          :key="j"
           class="grey lighten-3"
           :to="{name: child.to}"
           exact
        >
          <v-list-item-content>
            <v-list-item-title v-text="child.title"></v-list-item-title>

          </v-list-item-content>

          <v-list-item-action v-show="editMode" v-if="j>0">
            <v-btn icon small><v-icon small  @click.prevent="moveLeftMenu (leftMenu.items[i].subItems, j, -1)">mdi-arrow-up-bold-circle-outline</v-icon></v-btn>
          </v-list-item-action>
          <v-list-item-action v-show="editMode" v-if="j<leftMenu.items[i].subItems.length-1">
            <v-btn icon small @click.prevent="moveLeftMenu (leftMenu.items[i].subItems, j, -1)"><v-icon small>mdi-arrow-down-bold-circle-outline</v-icon></v-btn>
          </v-list-item-action>
          <v-list-item-action v-show="editMode" v-else class="pr-7"></v-list-item-action>

          <v-list-item-action v-show="editMode" v-if="leftMenu.items[i].subItems.length > 1">
            <v-btn icon small><v-icon small @click.prevent="removeLeftMenu (leftMenu.items[i].subItems, j)">mdi-delete</v-icon></v-btn>
          </v-list-item-action>
          <v-list-item-action v-show="editMode">
            <v-btn icon small @click.prevent="openDialog(i, j)"><v-icon small>mdi-pencil</v-icon></v-btn>
          </v-list-item-action>
        </v-list-item>

        <v-list-item @click="openDialog(i, -1)" class="blue lighten-3" v-show="editMode">
        <v-list-item-action><v-icon>mdi-plus</v-icon></v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>서브 추가하기</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      </v-list-group>

      <v-list-item @click="openDialog(-1, 'main')" class="blue" v-show="editMode">
        <v-list-item-action><v-icon>mdi-plus</v-icon></v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>추가하기</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

<v-dialog
      v-model="dialog"
      width="500"
    >
  <v-card>
    <v-card-title v-text="dialogTitle">
      <v-spacer></v-spacer>
      <v-btn icon><v-icon>mdi-content-save</v-icon></v-btn>
      <v-btn icon><v-icon>mdi-close</v-icon></v-btn>
    </v-card-title>
    <v-card-text>
      <v-text-field outlined label="제목" hide-details="" v-model="menuTitle"></v-text-field>
    </v-card-text>
    <v-card-text v-if="menuTo != null">
      <v-text-field outlined label="경로명" placeholder="Home" hide-details="" v-model="menuTo"></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="setLeftMenu">저장</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

</div>
</template>

<script>
export default {
  props: ['leftMenu'],
  data () {
    return {
      editMode: false,
      menuTitle: null,
      menuTo: null,
      dialog: false,
      dialogTitle: '',
      indexI: -1,
      indexJ: -1,
      items: {
        action: 'mdi-ticket',
        subItems: {
          title: null,
          to: null
        },
        title: null
      }
    };
  },
  methods: {
    setEditMode () {
      this.editMode = !this.editMode;
      this.$emit('setEditMode');
    },
    openDialog (i, j) {
      this.menuTitle = null;
      this.dialog = true;

      // this.indexI = Number(i);
      // this.indexJ = Number(j);

      this.indexI = i;
      this.indexJ = j;

      if (j === 'main') {
        this.menuTo = null;
      } else {
        if (j === -1) {
          this.menuTo = '경로명 ex)Home';
        } else {
          this.menuTo = this.leftMenu.items[this.indexI].subItems[this.indexJ].to;
        }
      }

      if (this.indexI < 0 || this.indexJ < 0) {
        this.dialogTitle = '메뉴추가';
      } else {
        this.dialogTitle = '메뉴수정';

        if (this.indexJ > -1) {
          this.menuTitle = this.leftMenu.items[this.indexI].subItems[this.indexJ].title;
        } else {
          if (this.indexI > -1) {
            this.menuTitle = this.leftMenu.items[this.indexI].title;
          }
        }
      }
    },
    setLeftMenu () {
      if (this.indexI === -1 && this.indexJ === 'main') {
        this.leftMenu.items.push({ action: 'mdi-ticket', title: this.menuTitle, active: false, subItems: [{ title: 'Sub Menu', to: 'Tmp' }] }); // 대메뉴 추가
      } else if (this.indexI > -1 && this.indexJ === 'main') {
        this.leftMenu.items[this.indexI].title = this.menuTitle; // 대메뉴 수정
      } else if (this.indexI > -1 && this.indexJ === -1) {
        this.leftMenu.items[this.indexI].subItems.push({ title: this.menuTitle, to: 'Tmp' }); // 소메뉴 추가
      } else if (this.indexI > -1 && this.indexJ > -1) { // 소메뉴 수정
        this.leftMenu.items[this.indexI].subItems[this.indexJ].title = this.menuTitle;
        this.leftMenu.items[this.indexI].subItems[this.indexJ].to = this.menuTo;
      }

      this.saveLeftMenu();
    },
    async saveLeftMenu () {
      try {
        this.$firebase.database().ref().child('site').update({ leftMenu: this.leftMenu });
      } finally {
        this.dialog = false;
      }
    },
    moveLeftMenu (items, i, arrow) {
      const item = items.splice(i, 1)[0];
      items.splice(i + arrow, 0, item);
    },
    removeLeftMenu (items, i) {
      items.splice(i, 1);
      this.saveLeftMenu();
    }
  }
};
</script>
