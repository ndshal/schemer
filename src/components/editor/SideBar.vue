<template lang="html">
  <section class='side-bar'>
    <tree-view
      :currentElement='currentElement'
      :currentTableId='currentTableId'
      :graph='graph'
      @send-element='sendElement'
      @add-column='addColumn'
      ></tree-view>
    <element-view
      :currentElement='currentElement'
      :graph='graph'
      @deleted-element='handleDeletedElement'
      @reset-primary-key='resetPrimaryKey'></element-view>
  </section>
</template>

<script>
import treeView from './treeView'
import elementView from './elementView'

export default {
  props: ['graph', 'currentElement'],
  components: {
    'tree-view': treeView,
    'element-view': elementView
  },
  computed: {
    currentTableId: function () {
      return this.currentTable ? this.currentTable.getId() : null
    },
    currentTable: function () {
      if (!this.currentElement) return null
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
    }
  },
  methods: {
    sendElement: function (element) {
      this.$emit('send-element', element)
    },
    addColumn: function (tableId) {
      const table = this.graph.getCell(tableId)
      const newCol = this.graph.addColumn(table.element)
      this.sendElement(newCol)
    },
    handleDeletedElement: function (element) {
      if (element.isCol()) {
        this.sendElement(this.currentTable.element)
      } else if (element.isTable()) {
        this.sendElement(null)
      }
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
    }
  }
}
</script>

<style lang="scss">
  @import '../../assets/app.scss';

  .side-bar {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-top: 1px solid $light-gray;
  }
</style>
