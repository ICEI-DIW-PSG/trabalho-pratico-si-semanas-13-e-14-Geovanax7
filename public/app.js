// ======================================================
//  SCROLL SUAVE
// ======================================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const destino = document.querySelector(this.getAttribute('href'));
    if (destino) {
      e.preventDefault();
      window.scrollTo({
        top: destino.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// ======================================================
//  CARROSSEL
// ======================================================
let index = 0;

function iniciarCarrossel() {
  const slides = document.querySelector('.slides');
  const imagens = document.querySelectorAll('.slides img');

  if (!slides || imagens.length === 0) return;

  setInterval(() => {
    index = (index + 1) % imagens.length;
    slides.style.transform = `translateX(${-index * 100}%)`;
  }, 4000);
}

window.addEventListener("load", iniciarCarrossel);

// ======================================================
//  MENU MOBILE
// ======================================================
const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector("nav");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("ativo");
  });
}

// ======================================================
//  ANIMAÇÕES SCROLL
// ======================================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("mostrar");
    }
  });
});

document.querySelectorAll(".card, .footer-left, .footer-right")
  .forEach(el => observer.observe(el));

// ======================================================
//  FUNÇÃO PARA BUSCAR HORÁRIOS
// ======================================================
async function buscarHorarios(dataSelecionada) {
  const API = "http://localhost:3000";

  try {
    const res = await fetch(`${API}/agenda?data=${encodeURIComponent(dataSelecionada)}`);

    if (!res.ok) {
      console.warn("⚠ Erro na rota /agenda:", res.status);
      return horariosPadrao(dataSelecionada);
    }

    const txt = await res.text();
    if (!txt.trim()) return horariosPadrao(dataSelecionada);

    const dados = JSON.parse(txt);

    if (dados.length === 0) return horariosPadrao(dataSelecionada);

    return dados[0];
  }
  catch (err) {
    console.error("Erro ao buscar horários:", err);
    return horariosPadrao(dataSelecionada);
  }
}

// Horários padrão caso a data não exista no JSON
function horariosPadrao(data) {
  return {
    data,
    horarios: ["08:00", "10:00", "14:00", "16:00"]
  };
}

// ======================================================
//  CALENDÁRIO
// ======================================================
document.addEventListener("DOMContentLoaded", function () {

  const calendarEl = document.getElementById("calendar");

  if (!calendarEl || typeof FullCalendar === "undefined") {
    console.warn("Calendário não inicializado.");
    return;
  }

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "pt-br",
    selectable: true,

    dateClick: async function (info) {

      document.getElementById("data").value = info.dateStr;

      const dados = await buscarHorarios(info.dateStr);

      const box = document.getElementById("horarios");
      box.innerHTML = "<h3>Horários Disponíveis</h3>";

      const container = document.createElement("div");

      dados.horarios.forEach(h => {
        const div = document.createElement("div");
        div.className = "hora";
        div.textContent = h;
        div.addEventListener("click", () => selecionarHora(h));
        container.appendChild(div);
      });

      box.appendChild(container);
      box.style.display = "block";
    }
  });

  calendar.render();
});

// ======================================================
//  SELECIONAR HORA
// ======================================================
function selecionarHora(hora) {
  document.getElementById("hora").value = hora;
}

// ======================================================
//  ENVIAR WHATSAPP
// ======================================================
function enviarWhatsApp() {
  const nome = document.getElementById("nome").value;
  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;
  const servico = document.getElementById("servico").value;

  const mensagem = `Olá! Gostaria de agendar o serviço *${servico}* para o dia *${data}* às *${hora}*. Meu nome é ${nome}.`;

  const numero = "5531995372658";

  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, "_blank");
}
