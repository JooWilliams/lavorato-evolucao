const EVOLUCAO_PADRAO =
        "Exemplo de evolução: Paciente presente para atendimento psicológico, demonstrando adequado estado emocional. " +
        "Foram trabalhados aspectos relacionados ao desenvolvimento emocional e comportamental. " +
        "Manteve adequado nível de engajamento durante a sessão. Evolução considerada satisfatória com progressos observados.";

      const HORARIOS = [
        "08:00 - 08:50","08:50 - 09:40","09:40 - 10:30","10:30 - 11:20","11:20 - 12:10",
        "13:10 - 14:00","14:00 - 14:50","14:50 - 15:40","15:40 - 16:30","16:30 - 17:20",
        "17:20 - 18:10","18:10 - 19:00","19:00 - 19:50", "19:50 - 20:40", "20:40 - 21:30",
      ];

      let sessaoCount = 0;

      function adicionarSessao() {
        sessaoCount++;
        const id = sessaoCount;
        const container = document.getElementById("lista-sessoes");
        const div = document.createElement("div");
        div.className = "sessao-card";
        div.id = `sessao-${id}`;
        div.innerHTML = `
          <div class="sessao-num">Atendimento ${id}</div>
          ${id > 1 ? `<button class="btn-remover" onclick="removerSessao(${id})">✕ Remover</button>` : ""}
          <div class="row">
            <div class="field">
              <label>Data do atendimento</label>
              <input type="date" id="data-${id}" />
            </div>
            <div class="field">
              <label>Horário</label>
              <select id="horario-${id}">
                ${HORARIOS.map(h => `<option value="${h}">${h}</option>`).join("")}
              </select>
            </div>
          </div>
          <div class="row" style="margin-top:14px">
            <div class="field full">
              <label>Texto da evolução</label>
              <textarea id="evolucao-${id}" rows="5" placeholder="${EVOLUCAO_PADRAO}"></textarea>
            </div>
          </div>
        `;
        container.appendChild(div);
      }

      function removerSessao(id) {
        const el = document.getElementById(`sessao-${id}`);
        if (el) el.remove();
        renumerarSessoes();
      }

      function renumerarSessoes() {
        const cards = document.querySelectorAll(".sessao-card");
        cards.forEach((card, i) => {
          const numEl = card.querySelector(".sessao-num");
          if (numEl) numEl.textContent = `Atendimento ${i + 1}`;
        });
      }

      function formatarData(valor) {
        if (!valor) return "";
        const [ano, mes, dia] = valor.split("-");
        const meses = [
          "janeiro","fevereiro","março","abril","maio","junho",
          "julho","agosto","setembro","outubro","novembro","dezembro"
        ];
        return `${parseInt(dia)} de ${meses[parseInt(mes) - 1]} de ${ano}`;
      }

      function gerarPreview() {
        const profissional = document.getElementById("nomeProfissional").value.trim().toUpperCase();
        const registro = document.getElementById("registroProfissional").value.trim().toUpperCase();
        const paciente = document.getElementById("nomePaciente").value.trim().toUpperCase();

        if (!profissional || !paciente) {
          alert("Preencha o nome do profissional e do paciente.");
          return;
        }

        const cards = document.querySelectorAll(".sessao-card");
        if (cards.length === 0) {
          alert("Adicione pelo menos um atendimento.");
          return;
        }

        let blocos = "";
        let valido = true;

        cards.forEach((card, i) => {
          const idMatch = card.id.match(/sessao-(\d+)/);
          if (!idMatch) return;
          const id = idMatch[1];

          const dataVal = document.getElementById(`data-${id}`)?.value;
          const horario = document.getElementById(`horario-${id}`)?.value || "";
          const evolucao = document.getElementById(`evolucao-${id}`)?.value.trim() || "";

          if (!dataVal) {
            alert(`Preencha a data do atendimento ${i + 1}.`);
            valido = false;
            return;
          }

          const dataFormatada = formatarData(dataVal);
          const profissionalLinha = registro ? `${profissional} - ${registro}` : profissional;
          blocos += `
            <div class="evolution-block">
              <div class="session-box">
                <p>${dataFormatada} ${horario}</p>
                <p>Procedimento: SESSÃO INDIVIDUAL AMBULATORIAL DE PSICOTERAPIA Por:</p>
                <p>${profissionalLinha}</p>
              </div>
              <h2 class="section-title">Evolução de Psicoterapia</h2>
              <h3 class="subsection-title">Evolução do paciente</h3>
              <p class="evolution-text">${evolucao}</p>
            </div>
          `;
        });

        if (!valido) return;

        const html = `
          <div class="doc-header">
            <h1 class="doc-logo">LAVORATO</h1>
            <p class="doc-subtitle">SAÚDE INTEGRADA</p>
          </div>
          <div class="doc-title">Evoluções</div>
          <div class="doc-patient-info">
            <p><strong>Paciente:</strong> ${paciente}</p>
            <p><strong>Convênio:</strong> FUSEX</p>
          </div>
          ${blocos}
        `;

        document.getElementById("doc-content").innerHTML = html;
        document.getElementById("formulario").style.display = "none";
        document.getElementById("preview-container").style.display = "block";
        window.scrollTo(0, 0);
      }

      function voltarFormulario() {
        document.getElementById("preview-container").style.display = "none";
        document.getElementById("formulario").style.display = "block";
        window.scrollTo(0, 0);
      }

      function gerarPDF() {
        const paciente = document.getElementById("nomePaciente")?.value.trim() ||
          document.getElementById("doc-content").querySelector(".doc-patient-info p")?.textContent.replace("Paciente:", "").trim() ||
          "paciente";
        const nomeArquivo = `Evolucoes_${paciente.replace(/\s+/g, "_")}.pdf`;

        const opt = {
          margin: [15, 15, 15, 15],
          filename: nomeArquivo,
          image: { type: "jpeg", quality: 1 },
          html2canvas: { scale: 2, useCORS: true },
          pagebreak: { mode: ["avoid-all", "css", "legacy"], avoid: ".evolution-block" },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };
        html2pdf().set(opt).from(document.getElementById("doc-content")).save();
      }

      // Inicia com uma sessão já aberta
      adicionarSessao();