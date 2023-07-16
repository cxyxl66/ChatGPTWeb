<template>
  <error-content code="404" desc="Oh~~您的页面好像飞走了~" :src="src"/>
</template>

<script>
import errorContent from './error-content.vue'
import error404 from '@/assets/images/error-404.svg'
export default {
  name: 'error_404',
  components: {
    errorContent
  },
  data () {
    return {
      src: error404
    }
  }
}
</script>
