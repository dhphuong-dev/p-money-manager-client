<script setup lang="ts">
const router = useRouter();
const origin = location.origin;
const AppName = 'pMoney Manager';
</script>

<template>
  <p-header class="container" title="Privacy Policy">
    <template #function>
      <n-p @click="router.back"> <icon-x :size="28" /> </n-p>
    </template>
  </p-header>
  <div class="privacy">
    <div class="container">
      <n-p>
        This Privacy Policy governs the manner in which <span>{{ AppName }}</span> collects, uses,
        maintains and discloses information collected from users (each, a "User") of the
        <a :href="origin">{{ origin }}</a>
        website ("Site"). This privacy policy applies to the Site and all products and services
        offered by <span>{{ AppName }}</span
        >.
      </n-p>

      <n-h2>How we use collected information</n-h2>
      <n-ul>
        <n-p>
          {{ AppName }} may collect and use Users personal information for the following purposes:
        </n-p>
        <li>
          <b>To improve customer service</b>: Information you provide helps us respond to your
          customer service requests and support needs more efficiently.
        </li>
        <li>
          <b>To personalize user experience</b>: We may use information in the aggregate to
          understand how our Users as a group use the services and resources provided on our Site.
        </li>
        <li>
          <b>To send periodic emails</b>: We may use the email address to send them information and
          updates pertaining to their order. If User decides to opt-in to our mailing list, they
          will receive emails that may include company news, updates, related product or service
          information, etc. If at any time the User would like to unsubscribe from receiving future
          emails, they may do so by contacting us via our Site.
        </li>
      </n-ul>

      <n-h2>How we protect your information</n-h2>
      <n-p>
        We adopt appropriate data collection, storage and processing practices and security measures
        to protect against unauthorized access, alteration, disclosure or destruction of your
        personal information, username, password, transaction information and data stored on our
        Site. Sensitive and private data exchange between the Site and its Users happens over a SSL
        secured communication channel and is encrypted and protected with digital signatures.
      </n-p>

      <n-h2>Your acceptance of these terms</n-h2>
      <n-p>
        By using this Site, you signify your acceptance of this policy. If you do not agree to this
        policy, please do not use our Site. Your continued use of the Site following the posting of
        changes to this policy will be deemed your acceptance of those changes.
      </n-p>

      <n-h2>Contacting us</n-h2>
      <n-p>
        If you have any questions about this Privacy Policy, the practices of this site, or your
        dealings with this site, please contact us at:
        <a href="mailto:hoangphuong270703@gmail.com" type="email">hoangphuong270703@gmail.com</a>
      </n-p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.privacy {
  padding: 2rem 0;
  a,
  h2 {
    color: $primary;
  }
  h2 {
    margin: 1rem 0;
  }
}
</style>

<route lang="yaml">
name: Privacy Policy
meta:
  layout: blank
</route>
