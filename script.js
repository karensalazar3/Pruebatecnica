document.addEventListener("DOMContentLoaded", () => {
  /* 📌 Elementos del formulario */
  const tituloWidget = document.getElementById("tituloWidget");
  const rangoDatos = document.getElementById("rangoDatos");
  const checkMinimo = document.getElementById("checkMinimo");
  const checkMaximo = document.getElementById("checkMaximo");
  const minValue = document.getElementById("minValue");
  const maxValue = document.getElementById("maxValue");
  const checkIntervalos = document.getElementById("checkIntervalos");
  const intervalRow = document.getElementById("intervalRow");
  const btnAddInterval = document.getElementById("btnAddInterval");
  const colorSelector = document.getElementById("colorIntervalsContainer");
  const btnAddWidget = document.getElementById("btnAddWidget");
  const widgetItems = document.querySelectorAll(".widget-item");
  const toggleWidget = document.getElementById("toggle-widget");
  const widgetOptions = document.getElementById("widget-options");

  /* 📌 1) Actualizar vista previa del título del widget */
  tituloWidget?.addEventListener("input", () => {
    document.getElementById("preview-title").textContent = tituloWidget.value.trim() || "Título del widget";
    validarFormulario();
  });

  /* 📌 2) Actualizar la vista previa del rango de datos */
  rangoDatos?.addEventListener("change", () => {
    document.getElementById("preview-range").textContent = rangoDatos.options[rangoDatos.selectedIndex].text;
    validarFormulario();
  });

  /* 📌 3) Delegación de eventos para habilitar/deshabilitar inputs de mínimo y máximo */
  document.addEventListener("change", (event) => {
    if (event.target.matches("#checkMinimo")) {
      minValue.disabled = !event.target.checked;
    }
    if (event.target.matches("#checkMaximo")) {
      maxValue.disabled = !event.target.checked;
    }
  });

  /* 📌 4) Mostrar/Ocultar intervalos de colores */
  checkIntervalos?.addEventListener("change", () => {
    intervalRow.classList.toggle("hidden", !checkIntervalos.checked);
  });

  /* 📌 5) Agregar intervalos de colores dinámicamente */
  btnAddInterval?.addEventListener("click", () => {
    if (!colorSelector) {
      console.error("El contenedor de intervalos de colores no existe.");
      return;
    }

    // Crear el nuevo intervalo
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

    // Evento para eliminar intervalos creados
    newInterval.querySelector(".delete-interval").addEventListener("click", () => {
      newInterval.remove();
    });

    // Agregar el nuevo intervalo al contenedor
    colorSelector.appendChild(newInterval);
  });

  /* 📌 6) Manejo de selección de widgets */
  widgetItems.forEach(item => {
    item.addEventListener("click", function () {
      setActiveClass(widgetItems);
      this.classList.add("active");
    });
  });

  function setActiveClass(elements, activeClass = "active") {
    elements.forEach(el => el.classList.remove(activeClass));
  }

  /* 📌 7) Switch para activar/desactivar el widget */
  toggleWidget?.addEventListener("change", () => {
    alert(toggleWidget.checked ? "Widget activado" : "Widget desactivado");
  });

  /* 📌 8) Dropdown (select) de opciones */
  widgetOptions?.addEventListener("change", () => {
    alert(`Seleccionaste: ${widgetOptions.value}`);
  });

  /* 📌 9) Validar formulario y deshabilitar el botón si está incompleto */
  function validarFormulario() {
    const titulo = tituloWidget?.value.trim();
    const rango = rangoDatos?.value;
    btnAddWidget.disabled = !(titulo && rango);
  }

  /* 📌 10) Validar valores numéricos en inputs */
  document.addEventListener("input", (event) => {
    if (event.target.classList.contains("interval-value")) {
      if (event.target.value < 0) {
        event.target.value = 0;
        alert("El valor de inicio no puede ser negativo.");
      }
    }
  });

  /* 📌 11) Creación de la gráfica con Chart.js */
  const canvas = document.getElementById("myLineChart");
  if (canvas) {
    const ctx = canvas.getContext("2d");

    // Datos de ejemplo (horas y valores)
    const labels = ["13:00", "13:05", "13:10", "13:15", "13:20", "13:25", "13:30"];
    const dataValues = [23.5, 24.0, 23.8, 24.2, 24.1, 24.4, 23.9];

    if (!labels.length || !dataValues.length) {
      console.warn("No hay datos disponibles para la gráfica.");
    }

    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
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
            title: {
              display: true,
              text: "Valor (°C)",
            },
          },
          x: {
            title: {
              display: true,
              text: "Hora",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.parsed.y} °C`,
            },
          },
        },
      },
    });
  }
});
