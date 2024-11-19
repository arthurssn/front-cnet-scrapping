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
      <button type="submit" id="avisos" ref="avisos">Avisos</button>
      <button type="submit" id="impugnacoes" ref="impugnacoes">
        Impugnações
      </button>
      <button type="submit" id="esclarecimentos" ref="esclarecimentos">
        Esclarecimentos
      </button>
    </form>

    <div id="response">
      <pre>{{ responses }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      siteKey: "b8bbded1-9d04-4ace-9952-b67cde081a7b",
      captchaId: null, // Armazena o ID do hCaptcha
      responses: [],
      activeButtonId: null,
    };
  },
  async mounted() {
    // Carrega o script do hCaptcha
    const script = document.createElement("script");
    script.src = "https://hcaptcha.com/1/api.js";
    script.async = true;
    script.defer = true;
    script.onload = this.initializeCaptcha;
    document.head.appendChild(script);

    window.onSubmit = this.onSubmit;
    const btnAvisos = this.$refs.avisos;
    const btnImpugnacoes = this.$refs.impugnacoes;
    const btnEsclarecimentos = this.$refs.esclarecimentos;
    setTimeout(() => {
      btnAvisos.click();
      btnImpugnacoes.click();
      btnEsclarecimentos.click();
    }, 2000);
  },
  methods: {
    async initializeCaptcha() {
      this.captchaId = await window.hcaptcha.render(this.$refs.captcha, {
        sitekey: this.siteKey,
        size: "invisible",
        callback: this.onSubmit,
      });
    },
    submitForm(event) {
      const button = event.submitter;
      this.activeButtonId = button.id;
      window.hcaptcha.execute(this.captchaId);
    },
    onSubmit(token) {
      const url = new URL(
        `https://cnetmobile.estaleiro.serpro.gov.br/comprasnet-fase-externa/public/v1/compras/19311705000022023/quadro-informativo/${this.activeButtonId}`
      );
      url.searchParams.append("captcha", token);

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          this.responses = [...this.responses, data];
        })
        .catch((error) => {
          this.responses = `Erro: ${error}`;
        });
    },
  },
};
</script>
