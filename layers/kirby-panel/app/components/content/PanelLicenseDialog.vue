<script setup lang="ts">
const SUBMIT_BUTTON = {
  icon: "check",
  text: "Activate License",
  theme: "love",
};

const FIELDS = {
  info: {
    type: "info",
    text: "Enter your license details to activate the plugin.",
  },
  email: { type: "email", label: "Email", required: true },
  licenseKey: {
    type: "text",
    label: "License Key",
    required: true,
    "<help>":
      'Find your license key in your order confirmation email or at <a href="https://hub.kirby.tools" target="_blank">hub.kirby.tools</a>.',
  },
};

const VALUE = {
  email: "you@example.com",
  licenseKey: "KT3-a1b2c3d4-e5f6g7h8",
};
</script>

<template>
  <PanelDialog :submit-button="SUBMIT_BUTTON" :fields="FIELDS" :value="VALUE" />
</template>
