<template>
  <section class='table-form'>
    <div class='bts'>
      <button @click='addTable'> Add Table </button>
    </div>

    <h3> Current Element: </h3>
    <ul class='el-list' v-if='currentElement'>
      <li>
        <label> Table:
          <input v-model='currentTableName'/>
        </label>
      </li>
      <table-form-column
        v-for='id in currentTable.columns()'
        key='id'
        :id='id'
        :isCurrent='currentElement.getId() === id'
        :graph='graph'
        v-on:send-element='sendElement'
        v-on:remove-column='removeColumn'
        v-on:reset-primary-key='resetPrimaryKey'>
      </table-form-column>
      <li>
        <label class='add-col'>
          <input
            v-model='newColName'
            placeholder='Add a column' />
          <button @click='addColumn'> + </button>
        </label>
      </li>
      <li>
        <button @click='removeTable'> Delete Table </button>
      </li>
    </ul>
    <span v-else='currentElement'> Nothing Selected </span>
  </section>
</template>

<script>
import TableFormColumn from './TableFormColumn'
export default {
  name: 'table-form',
  props: ['currentElement', 'graph'],
  components: {
    'table-form-column': TableFormColumn
  },
  data: () => ({
    newColName: ''
  }),
  computed: {
    currentTable: function () {
      if (this.currentElement.isTable()) {
        return this.currentElement
      } else {
        let parent = this.graph.getCell(this.currentElement.parentId())
        if (parent.isTable()) {
          return parent
        } else {
          return null
        }
      }
    },
    currentTableName: {
      get: function () {
        return this.currentTable.getName()
      },
      set: function (name) {
        this.currentTable.setName(name)
        this.graph.commit()
      }
    }
  },
  methods: {
    addTable: function () {
      const newTable = this.graph.addTable()
      this.sendElement(newTable)
    },
    removeTable: function () {
      console.log('coming soon')
    },
    removeColumn: function (id) {
      this.graph.removeColumn(this.currentTable.element, id)
    },
    addColumn: function () {
      // optional argument for type - defaults to integer
      const newCol = this.graph.addColumn(this.currentTable.element, this.newColName)
      this.newColName = ''
      this.sendElement(newCol)
    },
    resetPrimaryKey: function (newPrimaryId) {
      const graph = this.graph

      this.currentTable.columns()
        .forEach(colId => {
          const colCell = graph.getCell(colId)
          let options
          if (colId === newPrimaryId) {
            options = { notNull: false, indexed: false, unique: false }
          } else {
            options = { primaryKey: false }
          }
          options = colCell.setColOptions(options)

          const optionsStr = Object.keys(options)
            .filter(opt => options[opt]).join(', ')

          let optionsCell = graph.getCell(colCell.embeds()[2])
          optionsCell.setName(optionsStr)
          optionsCell.setAttr('text', {'ref-x': 0.5, 'ref-y': 0.3})
        })
      this.graph.commit()
    },
    sendElement: function (element) {
      this.$emit('send-element', element)
    }
  }
}
</script>

<style lang="css">
  .table-form {
    display: flex;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    flex-direction: column;
    align-items: center;
  }
  .table-form h3 {
    margin: 0;
    padding: 0;
    font-size: 16px;
    text-align: left;
  }
  .el-list {
    width: 100%;
    padding: 0 10px;
    list-style: none;
  }
  .el-list li {
    width: 100%;
    border: 1px solid black;
    box-sizing: border-box;
  }
  .el-list li > input {
    padding: 5px;
    border: none;
    margin: 0;
  }

  .el-list li > label {
    padding: 8px 5px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    width: 100%;
    text-align: left;
  }

  .add-col button {
    margin: 0;
  }
</style>
