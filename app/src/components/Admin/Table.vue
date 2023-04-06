<template>
    <div class="c-table">
        <table class="w-full mb-2 border-separate">
            <thead>
            <tr>
                <th v-for="column in columns"
                    :key="column.name">
                    <div class="flex items-center justify-center ">
                        <span class="uppercase text-gray-1 text-sm" v-if="column.label">{{ column.label }}</span>
                        <Button class="c-btn-sortable text-black-3"
                                v-if="column.sortable"
                                round
                                @click.native="sortBy(column.name)">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 xmlns:xlink="http://www.w3.org/1999/xlink"
                                 class="fill-current w-6 h-6"
                                 :class="sortOrders[column.name] > 0 ? 'is-asc' : 'is-dsc'"
                            >
                                <use xlink:href="#c-icon-keyboard_arrow_down"></use>
                            </svg>
                        </Button>
                    </div>
                </th>
            </tr>
            </thead>
            <tbody v-if="formatedData.length === 0">
            <tr class="mb-3 bg-white border border-solid border-gray-3 shadow-2l">
                <td class="p-5 font-bold" :colspan="columns.length">
                    List empty
                </td>
            </tr>
            </tbody>
            <transition-group v-else tag="tbody" name="table-row">
                <tr :key="item.id" class="mb-3 bg-white border border-solid border-gray-3 shadow-2l"
                    v-for="item in formatedData">
                    <td class="p-5" v-for="column in columns" :key="column.name">
                        <template v-if="'actions' in column">
                            <Button v-for="(action, index) in column.actions"
                                    :key="index"
                                    class="text-primary-normal hover:text-black-1 hover:bg-primary-light p-2"
                                    @click.native="action.function(item.id)"
                                    rounded
                                    data-bs-toggle="tooltip" data-bs-html="true" v-bind:title="action.tooltip">
                                <i v-bind:class="action.label"></i>
                            </Button>
                        </template>
                        <template v-else>
                            <div v-if="typeof item[column.name] === 'object' " class="flex items-center justify-start">
                                <div>
                                    <p class="text-left leading-tight">{{ item[column.name].name }}</p>
                                    <p class="text-left leading-tight text-gray-1">#{{ item[column.name].id }}</p>
                                </div>
                            </div>
                            <div v-else-if="typeof item[column.name] === 'boolean' " class="flex items-center justify-start">
                                <i v-bind:class="[item[column.name] ? 'bi-lg bi bi-check text-green-600' : 'bi-lg bi bi-x text-red-600']"></i>
                            </div>
                            <span v-else v-html="item[column.name]"></span>
                        </template>
                    </td>
                </tr>
            </transition-group>
        </table>
        <div v-if="formatedData.length >= nbVehiclesToShow" class="c-expand-section">
            <Button class="uppercase text-black-4 mx-2" v-if="vehiclesShown < data.length"
                    @click.native="modifyTableNumber('more')">
                Expand table
            </Button>
            <Button class="uppercase text-black-4 mx-2" v-else-if="vehiclesShown > nbVehiclesToShow"
                    @click.native="modifyTableNumber('less')">
                Contract table
            </Button>
        </div>
    </div>
</template>

<script>
  import Button from "../Button";

  export default {
    name: "EmployeeTable",
    components: {
      Button
    },
    props: {
      columns: {
        name: String,
        required: Boolean,
        label: String,
        sortable: Boolean,
        actions: Object
      },
      data: Array,
      filterKey: String
    },
    data() {
      let sortOrders = {};
      this.columns.forEach((column) => {
        sortOrders[column.name] = 1
      });
      return {
        sortKey: '',
        sortOrders: sortOrders,
        avatarSize: 8,
        nbVehiclesToShow: 8,
        vehiclesShown: 8
      }
    },
    computed: {
      formatedData() {
        let sortKey = this.sortKey;
        let filterKey = this.filterKey && this.filterKey.toLowerCase();
        let order = this.sortOrders[sortKey] || 1;
        let data = this.data;

        if (filterKey) {
          data = data.filter((row) => {
            return Object.keys(row).some((key) => {
              return String(row[key])
                .toLowerCase()
                .indexOf(filterKey) > -1;
            })
          })
        }

        if (sortKey) {
          data = data.slice().sort((a, b) => {
            a = a[sortKey];
            b = b[sortKey];
            return (a === b ? 0 : a > b ? 1 : -1) * order;
          });
        }

        data = data.map(columns => {
          for (const key of Object.keys(columns)) {
            if (columns[key] instanceof Date) {
              columns[key] = columns[key].toLocaleDateString();
            }
          }
          return columns;
        });

        return data.slice(0, this.vehiclesShown);
      }
    },
    methods: {
      sortBy(key) {
        this.sortKey = key;
        this.sortOrders[key] = this.sortOrders[key] * -1;
      },
      modifyTableNumber(method) {
        switch (method) {
          case 'more':
            this.vehiclesShown = this.data.length;
            break;
          case 'less':
            this.vehiclesShown = this.nbVehiclesToShow;
            break;
        }
      }
    }
  }
</script>

<style scoped>

    .bi-lg{
        font-size: 2rem;
    }
    .c-table table { border-spacing: 0 1rem;  }

    .c-btn-sortable svg { transition: transform .15s ease-in; }
    .c-btn-sortable .is-asc { transform: rotateZ(0deg); }
    .c-btn-sortable .is-dsc { transform: rotateZ(180deg); }

    .c-expand-section { @apply flex justify-center items-center; }
    .c-expand-section::before, .c-expand-section::after {
        @apply block bg-black-4;
        height: 1px;
        content: "";
        -webkit-box-flex: 1;
        flex: auto;
        background-clip: content-box;
    }
    .table-row-move { transition: transform 1s; }
</style>