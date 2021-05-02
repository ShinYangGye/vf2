<template>
    <div>
        <v-card>
        <v-card-title>Board Test</v-card-title>
        <v-card-actions>
            <v-btn color="primary" @click="openDialog(null)">게시판 작성</v-btn>
            <v-btn color="primary" @click="read">게시판 읽기</v-btn>
        </v-card-actions>
        </v-card>

        <v-card>
            <v-data-table
                :headers="headers"
                :items="items"
                :options.sync="options"
                :server-items-length="serverItemsLength"
                :loading="loading"
                :items-per-page="20"
                >
                <template v-slot:item.id="{ item }">
                    <v-btn icon><v-icon @click="openDialog(item)">mdi-pencil</v-icon></v-btn>
                    <v-btn icon><v-icon @click="remove(item)">mdi-delete</v-icon></v-btn>
                </template>

                <template v-slot:item.createdAt="{ item }">
                    {{ item.createdAt.toLocaleString() }}
                </template>

            </v-data-table>
        </v-card>

        <v-dialog max-width="500" v-model="dialog">
            <v-form>
                <v-card>
                    <v-card-title>일반게시판</v-card-title>
                    <v-card-title>
                        <v-text-field label="Title" v-model="form.title"></v-text-field>
                    </v-card-title>
                    <v-card-title>
                        <v-text-field label="Content" v-model="form.content"></v-text-field>
                    </v-card-title>
                    <v-card-actions v-if="!selecttedItem">
                        <v-btn color="primary" @click="add">ADD</v-btn>
                    </v-card-actions>
                    <v-card-actions v-else>
                        <v-btn color="primary" @click="update">UPDATE</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
    </div>
</template>

<script>
import { head, last } from 'lodash';

export default {
  data () {
    return {
      dialog: false,
      selecttedItem: null,
      unsubscribe: null,
      unsubscribeCount: null,
      items: [],
      form: {
        title: '',
        content: ''
      },
      headers: [
        { text: '제목', value: 'title' },
        { text: '내용', value: 'content' },
        { text: '작성일', value: 'createdAt' },
        { text: '수정/삭제', value: 'id' }
      ],
      serverItemsLength: 0,
      options: {},
      loading: false
    };
  },
  created () {
    // this.subscribe();
  },
  destroyed () {
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    if (this.unsubscribeCount) {
      this.unsubscribeCount();
    }
  },
  watch: {
    options: {
      handler (n, o) {
        this.subscribe();
      },
      deep: true
    }
  },
  methods: {
    subscribe () {
      this.unsubscribeCount = this.$firebase.firestore().collection('meta').doc('board').onSnapshot(doc => {
        if (!doc.exists) {
          return;
        }
        this.serverItemsLength = doc.data().count;
      });

      this.unsubscribe = this.$firebase.firestore().collection('board').limit(this.options.itemsPerPage).onSnapshot(sn => {
        if (sn.empty) {
          this.items = [];
          return;
        }
        console.log('head', head(sn.docs).data());
        console.log('last', last(sn.docs).data());
        this.items = sn.docs.map(v => {
          const item = v.data();
          return {
            id: v.id, title: item.title, content: item.content, createdAt: item.createdAt.toDate()
          };
        });
      });
    },
    openDialog (item) {
      this.dialog = true;
      this.form.title = '';
      this.form.content = '';

      if (item) {
        this.form.title = item.title;
        this.form.content = item.content;
        this.selecttedItem = item;
      }
    },
    add () {
      this.form.createdAt = new Date();
      this.$firebase.firestore().collection('board').add(this.form);
      this.dialog = false;
    },
    update () {
      this.$firebase.firestore().collection('board').doc(this.selecttedItem.id).update(this.form);
      this.selecttedItem = null;
    },
    async read () {
      const sn = await this.$firebase.firestore().collection('board').get();
      this.items = sn.docs.map(v => {
        const item = v.data();
        return {
          id: v.id, title: item.title, content: item.content
        };
      });
      console.log(this.items);
    },
    remove (item) {
      this.$firebase.firestore().collection('board').doc(item.id).delete();
    }
  }
};
</script>
