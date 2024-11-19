<template>
  <div>
    <h1>Verificação CAPTCHA</h1>
    <form @submit.prevent="submitForm">
      <div
        class="h-captcha"
        :data-sitekey="siteKey"
        data-size="invisible"
        data-callback="onSubmit"
      ></div>

      <br />
      <button type="submit" id="avisos">Avisos</button>
      <button type="submit" id="impugnacoes">Impugnações</button>
      <button type="submit" id="esclarecimentos">Esclarecimentos</button>
    </form>

    <div id="response">
      <pre>{{ response }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
declare global {
  interface Window {
    hcaptcha: any;
  }
}

export default {
  data() {
    return {
      siteKey: "b8bbded1-9d04-4ace-9952-b67cde081a7b",
      response: "",
    };
  },
  mounted() {
    const script = document.createElement("script");
    script.src = "https://hcaptcha.com/1/api.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    window.onsubmit = this.onSubmit;
  },

  methods: {
    submitForm(event) {
      const button = event.submitter;
      this.activeButtonId = button.id;
      window.hcaptcha.execute();
    },
    onSubmit(token) {
      const url = new URL(
        `https://cnetmobile.estaleiro.serpro.gov.br/comprasnet-fase-externa/public/v1/compras/19311705000022023/quadro-informativo/${this.activeButtonId}`
      );
      url.searchParams.append("captcha", token);

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          this.response = JSON.stringify(data, null, 2);
        })
        .catch((error) => {
          this.response = `Erro: ${error}`;
        });
    },
  },
};
</script>
