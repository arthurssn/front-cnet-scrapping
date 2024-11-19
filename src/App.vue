<template>
  <div>
    <h1>Verificação CAPTCHA</h1>
    <form @submit.prevent="submitForm">
      <div
        ref="captcha"
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

<script>
export default {
  data() {
    return {
      siteKey: "b8bbded1-9d04-4ace-9952-b67cde081a7b",
      captchaId: null, // Armazena o ID do hCaptcha
      response: "",
      activeButtonId: null,
    };
  },
  mounted() {
    // Carrega o script do hCaptcha
    const script = document.createElement("script");
    script.src = "https://hcaptcha.com/1/api.js";
    script.async = true;
    script.defer = true;
    script.onload = this.initializeCaptcha; // Inicializa o hCaptcha após carregar
    document.head.appendChild(script);

    // Define a callback global para o hCaptcha
    window.onSubmit = this.onSubmit;
  },
  methods: {
    initializeCaptcha() {
      // Renderiza manualmente o hCaptcha
      this.captchaId = window.hcaptcha.render(this.$refs.captcha, {
        sitekey: this.siteKey,
        size: "invisible",
        callback: this.onSubmit,
      });
    },
    submitForm(event) {
      const button = event.submitter; // Obtém o botão que disparou o evento
      this.activeButtonId = button.id;
      window.hcaptcha.execute(this.captchaId); // Executa o hCaptcha manualmente
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
