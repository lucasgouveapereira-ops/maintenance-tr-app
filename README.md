# TR Heavy Ops — App de Controle de Manutenção de Equipamentos Pesados

Sistema completo de gestão de manutenção industrial para empresas que operam máquinas pesadas (perfuratrizes, compressores, escavadeiras, geradores, pás carregadeiras e tratores).

## 🚀 Funcionalidades Principais

- **Gestão de Equipamentos (Entidade Equipamento)**:
  - Cadastro de tipo, marca, modelo, n° de série, tag/inventário interno, ano de fabricação, data de aquisição, valor de compra, fornecedor, localização/obra, vida útil, garantia e foto.
  - Ficha Técnica 360° individual com linha do tempo de histórico.

- **Ordens de Serviço (Entidade Manutenção 1:N)**:
  - Lançamento de revisões preventivas e reparações corretivas.
  - Tabela dinâmica de peças substituídas (com quantidade e valores unitários).
  - Cálculo automático de custos (peças + mão de obra).
  - Registro de tempo de paralisação (Downtime em horas).
  - Identificação de mecânico e oficina (interna vs terceirizada).
  - Diagnóstico e causa da falha em manutenções corretivas.
  - Agendamento do próximo ciclo por horímetro e data.

- **Indicadores Estratégicos & KPIs**:
  - **MTBF (Mean Time Between Failures)**: Tempo médio de operação entre quebras.
  - **MTTR (Mean Time To Repair)**: Tempo médio de reparo por manutenção.
  - Custos acumulados e horas totais de indisponibilidade.
  - Ranking visual das máquinas com maior índice de quebras.

- **Alertas Automáticos de Preventiva**:
  - Monitoramento de horímetro acumulado vs limite agendado (ciclos de 250h/500h).
  - Alertas visuais destacados para preventivas vencidas ou próximas de vencer.

- **Segurança & Conformidade**:
  - **NR-12**: Controle de adequação e datas de inspeção de máquinas e equipamentos.
  - **NR-19**: Controle de conformidade com explosivos e detonação.
  - Registro de operadores e mecânicos habilitados/certificados.

- **Relatórios & Exportação**:
  - Exportação de dados consolidados em formato **CSV**.
  - Impressão formatada e geração de documento **PDF**.

---

## 🛠️ Tecnologias Utilizadas

- **Core**: React + Vite (JavaScript)
- **Styling**: Vanilla CSS modular com variáveis CSS (Glassmorphism & Dark/Light Mode)
- **Iconografia**: Lucide React Icons
- **Gráficos**: Chart.js & React-Chartjs-2
- **Documentos/PDF**: Utilitários de impressão e exportação CSV embutidos
- **Persistência**: `localStorage` com suporte a zerar memória ou recarregar dados demonstrativos

---

## 🔧 Como Executar o Projeto Localmente

1. Clone o repositório:
```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd "Maintenance TR APP"
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse no navegador:
`http://localhost:5173/`

---

## 📄 Licença
Propriedade da equipe de engenharia e manutenção TR Heavy Ops.
