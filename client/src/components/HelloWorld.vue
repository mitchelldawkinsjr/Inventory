<template>
  <b-row>
    <b-colxx xxs="12">
      <h5 class="mb-4 card-title">Revolution Inventory</h5>
      <b-row class="icon-cards-row mb-3">
        <b-colxx xxs="6" sm="4" md="3" lg="2">
          <icon-card :value="this.microPosts.length" :icon="this.iconInventory" :title="this.title"></icon-card>
        </b-colxx>
        <b-colxx xxs="6" sm="4" md="3" lg="2">
          <icon-card :value="this.totalDollarValue" :icon="this.iconMoney" :title="this.moneyTitle"></icon-card>
        </b-colxx>
      </b-row>
    </b-colxx>
  </b-row>
</template>

<script>
import MicroPostsService from "../utils/MicroPostsService";
import IconCard from "../components/Cards/IconCard";

export default {
  name: 'HelloWorld',
  data () {
    return {
      microPosts: [],
      error: '',
      title: 'Total Inventory Items',
      moneyTitle: 'Estimated Inventory Value',
      totalDollarValue: 0,
      iconInventory:'iconsminds-calendar-1',
      iconMoney:'iconsminds-dollar',
    }
  },
  async created () {
    try {
      this.microPosts = await MicroPostsService.getMicroPosts()
      this.calculate(this.microPosts);
    } catch (error) {
      this.error = error.message
    }
  },
  components : {
    'icon-card':IconCard
  },
  methods : {
    calculate(obj) {
      console.log(obj);
      Object.values(obj).forEach(value=>{
        console.log(parseInt(value.price));
        let val = parseInt(value.price);
        if(!isNaN(val)) { this.totalDollarValue += val; }
      });
      this.totalDollarValue = '$' + this.totalDollarValue
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  div.container {
    max-width: 800px;
    margin: 0 auto;
  }

  p.error {
    border: 1px solid #ff5b5f;
    background-color: #ffc5c1;
    padding: 10px;
    margin-bottom: 15px;
  }

  div.micro-post {
    position: relative;
    border: 1px solid #5bd658;
    background-color: #bcffb8;
    padding: 10px;
    margin-bottom: 15px;
  }

  div.created-at {
    position: absolute;
    top: 0;
    left: 0;
    padding: 5px 15px 5px 15px;
    background-color: darkgreen;
    color: white;
    font-size: 13px;
  }

  p.text {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 0;
  }

  p.author {
    font-style: italic;
    margin-top: 5px;
  }
</style>
