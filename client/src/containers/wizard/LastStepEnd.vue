<template>
<b-card no-body>
    <b-card-body class="wizard wizard-default">
        <form-wizard @finished="finished" :last-step-end="true">
            <tab :name="$t('wizard.step-name-1')" :desc="$t('wizard.step-desc-1')" :selected="true">
                <div class="wizard-basic-step">
                    <b-form>
                        <b-form-group :label="$t('forms.name')">
                            <b-form-input type="text" v-model="name" :placeholder="$t('forms.name')" />
                        </b-form-group>
                    </b-form>
                </div>
            </tab>
            <tab :name="$t('wizard.step-name-2')" :desc="$t('wizard.step-desc-2')">
                <div class="wizard-basic-step">
                  <b-colxx xxs="12">
                    <b-card class="mb-4" :title="$t('form-components.dropzone')">
                      <b-form>
                        <b-row>
                          <b-colxx xxs="12">
                            <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>
                          </b-colxx>
                        </b-row>
                      </b-form>
                    </b-card>
                  </b-colxx>
                </div>
            </tab>
            <tab :name="$t('wizard.step-name-3')" :desc="$t('wizard.step-desc-3')">
                <div class="wizard-basic-step">
                    <b-form>
                        <b-form-group :label="$t('forms.price')">
                            <b-form-input type="text" v-model="price" :placeholder="$t('forms.price')" />
                        </b-form-group>
                    </b-form>
                </div>
            </tab>
            <tab type="done">
                <div class="wizard-basic-step text-center">
                    <h2 class="mb-2">{{$t('wizard.content-thanks')}}</h2>
                    <p>{{$t('wizard.registered')}}</p>
                </div>
            </tab>
        </form-wizard>
    </b-card-body>
</b-card>
</template>

<script>
import FormWizard from "../../components/Form/Wizard/FormWizard";
import Tab from "../../components/Form/Wizard/Tab";
import VueDropzone from "vue2-dropzone";
import MicroPostsService from "../../utils/MicroPostsService";
import axios from "axios";
import {apiUrl} from "../../constants/config";

export default {
  data() {
    return {
      name:'',
      price: '',
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
            .then(function(data) {
              data = data.data

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
        sending: function(file, xhr) {
          console.log('sending')
          var _send = xhr.send;
          xhr.setRequestHeader('x-amz-acl', 'public-read-write');
          xhr.send = function() {
            _send.call(xhr, file);
          }
        },
        processing:function(file){
          this.options.url = file.signedRequest;
        }
        // url: (data) => {
        //   return MicroPostsService.saveImage(data[0].name, data[0])
        // },
        // url: '/',
        // method: 'put',
        // thumbnailHeight: 160,
        // maxFilesize: 5,
        // previewTemplate: this.dropzoneTemplate(),
        // headers: {},
        // accept (file, done) {
        //   MicroPostsService.saveImage(file)
        //     .catch((err) => {
        //       done('Failed to get an S3 signed upload URL', err)
        //     })
        // }
      }
    }
  },
  components: {
      "form-wizard": FormWizard,
      "tab": Tab,
      "vue-dropzone": VueDropzone
  },
  methods: {
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
    finished() {
      // console.log(this.name + ' - - ' + this.price);
      MicroPostsService.insertMicroPost(this.name, 'TEST', this.price);
    },
    s3UploadError(errorMessage) {
      console.log('ERROR' + errorMessage)
    },
    s3UploadSuccess(s3ObjectLocation) {
      console.log(s3ObjectLocation)
    }
  }
};
</script>
