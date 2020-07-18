<template>
  <div class="notes">
    <form @submit.prevent="createNote">
      <textarea v-model="note" placeholder="Note" />
      <input type="submit" class="button-subtle" value="Add note">
    </form>
    <ul>
      <li
        v-for="note in notes"
        :key="note.id"
      >
        <h3 v-if="users.find(x => x.id === note.user_id)">Written by {{ users.find(x => x.id === note.user_id).email_address }}</h3>
        <h4>At {{ new Date(note.createdAt).toLocaleDateString('en-GB') }} {{ new Date(note.createdAt).toLocaleTimeString('en-GB') }}</h4>
        <div v-html="note.note" />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      notes: [],
      users: [],
      note: ''
    }
  },

  mounted () {
    this.axios.get('notes')
      .then(res => {
        this.notes = res.data
      })

    this.axios.get('auth/users')
      .then(res => {
        this.users = res.data
      })
  },

  methods: {
    createNote () {
      this.axios.post('notes', { note: this.note })
        .then(res => {
          this.notes.unshift(res.data)
          this.note = ''
        })
        .catch(() => {
          this.note = ''
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.notes {
  display: grid;
  grid-gap: 30px;

  @media (min-width: 60em) {
    grid-template-columns: 1fr 2fr;
  }

  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  ul {
    overflow: scroll;
    white-space: nowrap;
  }

  li {
    background: #F2F2F2;
    border-radius: 5px;
    padding: 15px;
    display: inline-block;
    margin: 0 30px 0 0;
    max-width: 400px;
    vertical-align: top;

    & > * {
      white-space: pre-wrap;
    }
  }

  h3 {
    margin: 0;
  }

  h4 {
    margin: 0 0 10px;
  }
}
</style>
