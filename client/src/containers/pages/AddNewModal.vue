<template>
  <b-modal
    id="modalright"
    ref="modalright"
    :title="$t('pages.add-new-modal-title')"
    modal-class="modal-right"
  >
    <b-form>
      <b-form-group :label="$t('pages.product-name')">
        <b-form-input v-model="newItem.name" />
      </b-form-group>
      <b-form-group :label="$t('pages.category')">
        <v-select :options="categories" v-model="newItem.category" />
      </b-form-group>
      <b-form-group :label="$t('pages.image')">
        <b-form-input v-model="newItem.image" />
<!--        <b-textarea v-model="newItem.description" :rows="2" :max-rows="2" />-->
      </b-form-group>
      <b-form-group :label="$t('pages.price')">
        <b-form-input v-model="newItem.price" />
<!--        <b-form-radio-group stacked class="pt-2" :options="statuses" v-model="newItem.status" />-->
      </b-form-group>
    </b-form>
    <template slot="modal-footer">
      <b-button
        variant="outline-secondary"
        @click="hideModal('modalright')"
      >{{ $t('pages.cancel') }}</b-button>
      <b-button variant="primary" @click="addNewItem()" class="mr-1">{{ $t('pages.submit') }}</b-button>
    </template>
  </b-modal>
</template>
<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import MicroPostsService from "../../utils/MicroPostsService";
export default {
  components: {
    "v-select": vSelect
  },
  props: ["categories", "statuses"],
  data() {
    return {
      newItem: {
        name: "",
        price: "",
        image: "",
        category: "",
      }
    };
  },
  methods: {
    addNewItem() {
      console.log("adding item : ", this.newItem);
      MicroPostsService.insertMicroPost(this.newItem.name, 'TEST', this.newItem.price, this.newItem.category)
        .then((data) => {
          console.log(data);
          this.hideModal('modalright');
          this.addNotification('success')
        });
    },
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    addNotification(
      type = "success",
      title = "Added",
      message = "Item was added to Inventory"
    ) {
      this.$notify(type, title, message, { duration: 3000, permanent: false });
    }
  }
};
</script>

