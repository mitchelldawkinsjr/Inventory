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
        <v-select :options="newItem.categories" v-model="newItem.category" />
      </b-form-group>
      <b-form-group :label="$t('pages.condition')">
        <v-select :options="newItem.conditions" v-model="newItem.condition" />
      </b-form-group>
      <b-form-group class="mb-4" :label="$t('form-components.image-upload')">
          <b-row>
            <b-colxx xxs="12">
              <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>
            </b-colxx>
          </b-row>
      </b-form-group>
      <b-form-group :label="$t('forms.price')">
        <b-form-input v-model="newItem.price" />
      </b-form-group>
      <b-form-group :label="$t('forms.quantity')">
        <b-form-input v-model="newItem.quantity" />
      </b-form-group>
      <b-form-group :label="$t('forms.box')">
        <b-form-input v-model="newItem.box" />
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
import axios from "axios";
import {apiUrl} from "../../constants/config";
import VueDropzone from "vue2-dropzone";

export default {
  components: {
    "v-select": vSelect,
    "vue-dropzone": VueDropzone,
  },
  props: ["categories", "conditions"],
  data() {
    return {
      newItem: {
          name: "",
          price: "",
          imageUrl: "",
          quantity: '',
          box: "",
          category: "",
          condition: "",
          conditions: [
            {
              label: "Fully Functional (Working)",
              value: "working"
            },
            {
              label: "Faulty (Broken)",
              value: "not-working"
            },
            {
              label: "Untested",
              value: "untested"
            },
          ],
          categories: [
            {
              label: "Cables",
              value: "cables"
            },
            {
              label: "Converters",
              value: "converters"
            },
            {
              label: "Cameras",
              value: "cameras"
            },
            {
              label: "Computers",
              value: "computers"
            },
            {
              label: "Adapters",
              value: "adapters"
            },
            {
              label: "Monitors",
              value: "monitors"
            },
            {
              label: "Computer accessories",
              value: "computer-accessories"
            },
            {
              label: "Camera accessories",
              value: "camera-accessories"
            },
            {
              label: "Misc Electronics",
              value: "misc-electronics"
            },
          ],
      },
      dropzoneOptions: {
        url:"#",
        previewTemplate: this.dropzoneTemplate(),
        method: "PUT",
        uploadMultiple: false,
        paramName: "file",
        maxFiles: 10,
        thumbnailWidth: 80,
        thumbnailHeight: 80,
        parallelUploads: 20,
        autoProcessQueue: true,
        //autoQueue: false, // Make sure the files aren't queued until manually added
        //clickable: true, //".fileinput-button" // Define the element that should be used as click trigger to select files.
        accept: function(file, cb) {
          //override the file name, to use the s3 signature
          //console.log(file);
          var params = {
            fileName: file.name,
            fileType: file.type,
          };

          axios.get(apiUrl+'uploader', params)
            .then((data) => {
              data = data.data;

              if (!data.signedRequest) {
                return cb('Failed to receive an upload url');
              }

              file.signedRequest = data.signedRequest;
              file.finalURL = data.downloadURL;
              cb();
            })
            .catch(function() {
              return cb('Failed to receive an upload url');
            });
        },
        sending: (file, xhr) => {
          this.updateImageUrl(file);

          var _send = xhr.send;
          xhr.send = () => {
            _send.call(xhr, file);
          };
        },
        processing: function (file) {
          this.options.url = file.signedRequest;
        }
      },
    };
  },
  methods: {
    addNewItem() {
      MicroPostsService.insertMicroPost(
        this.newItem.name,
        this.newItem.imageUrl,
        this.newItem.price,
        this.newItem.quantity,
        this.newItem.box,
        this.newItem.category.value,
        this.newItem.condition.value,

      )
        .then((data) => {
          console.log(data);
          this.hideModal('modalright');
          this.addNotification('success')
        });
    },
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    updateImageUrl(file) {
      this.newItem.imageUrl = file.finalURL;
    },
    dropzoneTemplate() {
      return `<div class="dz-preview dz-file-preview mb-3">
                  <div class="d-flex flex-row "> <div class="p-0 w-30 position-relative">
                      <div class="dz-error-mark"><span><i></i>  </span></div>
                      <div class="dz-success-mark"><span><i></i></span></div>
                      <div class="preview-container">
                        <img data-dz-thumbnail class="img-thumbnail border-0" />
                        <i class="simple-icon-doc preview-icon"></i>
                      </div>
                  </div>
                  <div class="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative">
                    <div> <span data-dz-name /> </div>
                    <div class="text-primary text-extra-small" data-dz-size /> </div>
                    <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                    <div class="dz-error-message"><span data-dz-errormessage></span></div>
                  </div>
                  <a href="#" class="remove" data-dz-remove> <i class="glyph-icon simple-icon-trash"></i> </a>
                </div>
        `;
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

