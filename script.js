const elements = {
  tituloWidget: document.getElementById("tituloWidget"),
  rangoDatos: document.getElementById("rangoDatos"),
  checkMinimo: document.getElementById("checkMinimo"),
  checkMaximo: document.getElementById("checkMaximo"),
  minValue: document.getElementById("minValue"),
  maxValue: document.getElementById("maxValue"),
  checkIntervalos: document.getElementById("checkIntervalos"),
  intervalRow: document.getElementById("intervalRow"),
  btnAddInterval: document.getElementById("btnAddInterval"),
  colorSelector: document.getElementById("colorIntervalsContainer"),
  btnAddWidget: document.getElementById("btnAddWidget"),
  widgetItems: document.querySelectorAll(".widget-item"),
  toggleWidget: document.getElementById("toggle-widget"),
  widgetOptions: document.getElementById("widget-options"),
  previewTitle: document.getElementById("preview-title"),
  previewRange: document.getElementById("preview-range"),
};

const widgets = [
  { icon: "fa-font", label: "Texto" },
  { icon: "fa-hashtag", label: "Valor numérico" },
  { icon: "fa-chart-line", label: "Gráfica de líneas" },
  { icon: "fa-chart-bar", label: "Gráfica de barras" },
  { icon: "fa-chart-area", label: "Gráfica de líneas con área" },
  { icon: "fa-toggle-on", label: "Estado On/Off" },
  { icon: "fa-chart-pie", label: "Gráfica KPIs" },
  { icon: "fa-brain", label: "Conocimiento experto" },
  { icon: "fa-map", label: "Mapa con datos de sensores" },
  { icon: "fa-camera", label: "Sensores sobre una imagen" },
  { icon: "fa-layer-group", label: "Serie de datos combinados" },
  { icon: "fa-location-arrow", label: "Valor y dirección" },
  { icon: "fa-circle-exclamation", label: "Indicador" },
  { icon: "fa-tint", label: "Nivel de agua" },
  { icon: "fa-clock", label: "Tiempos de máquina" }
];


function renderWidgets() {
  const widgetList = document.getElementById("widget-list");
  widgetList.innerHTML = ""; 

  widgets.forEach(({ icon, label }) => {
    const li = document.createElement("li");
    li.classList.add("widget-item");

    li.innerHTML = `
      <div class="widget-container">
        <i class="fa-solid ${icon}" aria-label="${label}"></i>
      </div>
      <span class="widget-text">${label}</span>
    `;

    li.addEventListener("click", () => {
      document.querySelectorAll(".widget-item").forEach((el) => el.classList.remove("active"));
      li.classList.add("active");
      updateWidgetPreview(label);
    });

    widgetList.appendChild(li);
  });
}

function updateWidgetPreview(widgetName) {
  elements.previewTitle.textContent = `Widget: ${widgetName}`;
}

function validarFormulario() {
  elements.btnAddWidget.disabled = !(
    elements.tituloWidget?.value.trim() && elements.rangoDatos?.value
  );
}

elements.tituloWidget?.addEventListener("input", () => {
  elements.previewTitle.textContent = elements.tituloWidget.value.trim() || "Título del widget";
  validarFormulario();
});

elements.rangoDatos?.addEventListener("change", () => {
  elements.previewRange.textContent = elements.rangoDatos.options[elements.rangoDatos.selectedIndex].text;
  validarFormulario();
});

document.addEventListener("change", (event) => {
  if (event.target.matches("#checkMinimo")) {
    elements.minValue.disabled = !event.target.checked;
  }
  if (event.target.matches("#checkMaximo")) {
    elements.maxValue.disabled = !event.target.checked;
  }
  if (event.target.matches("#checkIntervalos")) {
    elements.intervalRow.classList.toggle("hidden", !event.target.checked);
  }
  if (event.target === elements.toggleWidget) {
    alert(event.target.checked ? "Widget activado" : "Widget desactivado");
  }
  if (event.target === elements.widgetOptions) {
    alert(`Seleccionaste: ${event.target.value}`);
  }
});

elements.btnAddInterval?.addEventListener("click", () => {
  if (!elements.colorSelector) return console.error("El contenedor de intervalos de colores no existe.");

  const newInterval = document.createElement("div");
  newInterval.classList.add("interval-row");
  newInterval.innerHTML = `
    <div class="form-row">
      <label>Valor de inicio</label>
      <input type="number" class="interval-value" placeholder="0" />
    </div>
    <div class="form-row">
      <label>Color</label>
      <input type="color" class="interval-color" />
    </div>
    <button class="delete-interval">✖</button>
  `;

  newInterval.querySelector(".delete-interval").addEventListener("click", () => newInterval.remove());
  elements.colorSelector.appendChild(newInterval);
});

document.addEventListener("input", (event) => {
  if (event.target.classList.contains("interval-value") && event.target.value < 0) {
    event.target.value = 0;
    alert("El valor de inicio no puede ser negativo.");
  }
});

const canvas = document.getElementById("myLineChart");
if (canvas) {
  const ctx = canvas.getContext("2d");
  const labels = ["13:00", "13:05", "13:10", "13:15", "13:20", "13:25", "13:30"];
  const dataValues = [23.5, 24.0, 23.8, 24.2, 24.1, 24.4, 23.9];

  if (!labels.length || !dataValues.length) console.warn("No hay datos disponibles para la gráfica.");

  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Temperatura",
          data: dataValues,
          borderColor: "#00b2ff",
          backgroundColor: "#00b2ff",
          fill: false,
          tension: 0.2,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
          title: { display: true, text: "Valor (°C)" },
        },
        x: {
          title: { display: true, text: "Hora" },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: (context) => ` ${context.parsed.y} °C` },
        },
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", renderWidgets);
