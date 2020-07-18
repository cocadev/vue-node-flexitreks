<template>
  <div class="wrap pad-top pad-bottom">
    <header class="center">
      <h4>Payment confirmation</h4>
      <h1>Thank you, your payment has been received</h1>
      <p>A payment confirmation email is on it’s way to you!</p>
    </header>
    <br><br><br><br><br><br><br><br>
  </div>
</template>

<script>
export default {
  head () {
    const title = 'Payment Success!'
    return {
      title,
      meta: [
        { property: 'og:title', content: title + ' | Flexitreks' },
        { name: 'twitter:title', content: title + ' | Flexitreks' }
      ]
    }
  }
}
</script>
