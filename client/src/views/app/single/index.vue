<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <piaf-breadcrumb :heading="$t('menu.add')"/>
      <div class="separator mb-5"></div>
      <b-row>
        <b-colxx xxs="12" class="mb-5">
          <h5 class="mb-4">Item Input Wizard</h5>
          <last-step-end></last-step-end>
        </b-colxx>
      </b-row>
    </b-colxx>
  </b-row>
  </div>
</template>
<script>
  import LastStepEnd from "../../../containers/wizard/LastStepEnd";

  export default {
    components: {
      "last-step-end": LastStepEnd,
    }
  };
</script>
