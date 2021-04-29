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
      </v-list-item>
    </template>

    <v-divider></v-divider>

    <v-list class="grey lighten-2 pa-0">
      <v-list-group
        v-for="(item, index) in leftMenu.items"
        :key="index"
        v-model="item.active"
        :prepend-icon="item.action"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="(child, index) in leftMenu.items[index].subItems"
          :key="index"
           class="grey lighten-3"
           :to="{name: child.to}"
           exact
        >
          <v-list-item-content>
            <v-list-item-title v-text="child.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
</div>
</template>

<script>
export default {
  props: ['leftMenu'],
  data () {
    return {

    };
  },
  created () {
    console.log(this.left);
  }
};
</script>
