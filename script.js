let partners = JSON.parse(localStorage.getItem("partners")) || [];
let serviceHistory = JSON.parse(localStorage.getItem("serviceHistory")) || [];

document.addEventListener("DOMContentLoaded", function () {
  loadPartners();
  setupEventListeners();
  initializeDemoData();
});

function setupEventListeners() {
  document
    .getElementById("searchInput")
    .addEventListener("input", loadPartners);
  document
    .getElementById("sortSelect")
    .addEventListener("change", loadPartners);

  document
    .getElementById("partnerForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      savePartner();
    });

  // Форма расчета материалов
  document
    .getElementById("calculationForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      if (typeof calculateMaterials === "function") {
        calculateMaterials();
      }
    });
}

// Форма расчета материалов
document
  .getElementById("calculationForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    calculateMaterials();
  });

function initializeDemoData() {
  if (partners.length === 0) {
    partners = [
      {
        id: 1,
        name: "Чистый Мир",
        type: "розничный пункт",
        rating: 8,
        address: "ул. Ленина, 15",
        director: "Иванов Петр Сергеевич",
        phone: "+7 (495) 123-45-67",
        email: "info@cleanworld.ru",
      },
      {
        id: 2,
        name: "Стирка Профи",
        type: "интернет-агрегатор",
        rating: 9,
        address: "ул. Пушкина, 42",
        director: "Сидорова Мария Ивановна",
        phone: "+7 (495) 765-43-21",
        email: "contact@stirka-pro.ru",
      },
    ];
    localStorage.setItem("partners", JSON.stringify(partners));
  }

  if (serviceHistory.length === 0) {
    serviceHistory = [
      {
        id: 1,
        partnerId: 1,
        serviceName: "Стирка белья",
        quantity: 2,
        executionDate: "2024-01-15",
        totalCost: 300,
      },
      {
        id: 2,
        partnerId: 1,
        serviceName: "Химчистка куртки",
        quantity: 1,
        executionDate: "2024-01-16",
        totalCost: 450,
      },
      {
        id: 3,
        partnerId: 2,
        serviceName: "Ремонт одежды",
        quantity: 3,
        executionDate: "2024-01-14",
        totalCost: 600,
      },
      {
        id: 4,
        partnerId: 2,
        serviceName: "Стирка белья",
        quantity: 5,
        executionDate: "2024-01-17",
        totalCost: 750,
      },
    ];
    localStorage.setItem("serviceHistory", JSON.stringify(serviceHistory));
  }
}

function showView(viewName) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.remove("active");
  });

  document.getElementById(viewName).classList.add("active");

  if (viewName === "mainMenu") {
    loadPartners();
  }
}

function loadPartners() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const sortBy = document.getElementById("sortSelect").value;

  let filteredPartners = partners.filter(
    (partner) =>
      partner.name.toLowerCase().includes(searchTerm) ||
      partner.director.toLowerCase().includes(searchTerm)
  );

  filteredPartners.sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  displayPartners(filteredPartners);
}

function displayPartners(partnersList) {
  const container = document.getElementById("partnersList");

  if (partnersList.length === 0) {
    container.innerHTML = "<p>Партнеры не найдены</p>";
    return;
  }

  container.innerHTML = partnersList
    .map(
      (partner) => `
        <div class="partner-card" onclick="showPartnerHistory(${partner.id})">
            <h3>${partner.name}</h3>
            <p><strong>Тип:</strong> ${partner.type}</p>
            <p><strong>Руководитель:</strong> ${partner.director}</p>
            <p><strong>Телефон:</strong> ${partner.phone}</p>
            <p><strong>Рейтинг:</strong> ${partner.rating}/10</p>
            <p><strong>Email:</strong> ${partner.email}</p>
        </div>
    `
    )
    .join("");
}

function savePartner() {
  const formData = {
    id: Date.now(),
    name: document.getElementById("name").value,
    type: document.getElementById("type").value,
    rating: parseInt(document.getElementById("rating").value),
    address: document.getElementById("address").value,
    director: document.getElementById("director").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
  };

  if (!formData.name) {
    alert("Введите наименование партнера");
    return;
  }

  partners.push(formData);
  localStorage.setItem("partners", JSON.stringify(partners));

  document.getElementById("partnerForm").reset();
  alert("Партнер успешно добавлен!");
  showView("mainMenu");
}

function showPartnerHistory(partnerId) {
  const partner = partners.find((p) => p.id === partnerId);
  if (!partner) return;

  // Обновляем заголовок и информацию о партнере
  document.getElementById(
    "historyTitle"
  ).textContent = `История услуг: ${partner.name}`;
  document.getElementById("currentPartnerName").textContent = partner.name;
  document.getElementById("currentPartnerDetails").innerHTML = `
        <strong>Тип:</strong> ${partner.type} | 
        <strong>Телефон:</strong> ${partner.phone} | 
        <strong>Рейтинг:</strong> ${partner.rating}/10
    `;

  // Получаем историю услуг для партнера
  const partnerHistory = serviceHistory.filter(
    (history) => history.partnerId === partnerId
  );

  displayServiceHistory(partnerHistory);
  showView("serviceHistory");
}

function displayServiceHistory(history) {
  const container = document.getElementById("historyContent");

  if (history.length === 0) {
    container.innerHTML = `
            <div class="no-history">
                <p>История услуг для данного партнера отсутствует</p>
            </div>
        `;
    return;
  }

  container.innerHTML = `
        <table class="history-table">
            <thead>
                <tr>
                    <th>Наименование услуги</th>
                    <th>Количество</th>
                    <th>Дата выполнения</th>
                    <th>Стоимость</th>
                </tr>
            </thead>
            <tbody>
                ${history
                  .map(
                    (item) => `
                    <tr>
                        <td>${item.serviceName}</td>
                        <td>${item.quantity}</td>
                        <td>${formatDate(item.executionDate)}</td>
                        <td>${item.totalCost} руб.</td>
                    </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
    `;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU");
}

const resultContainer = document.getElementById("calculationResult");

if (result === -1) {
  resultContainer.innerHTML = `
            <div class="result-error">
                <h4>Ошибка расчета</h4>
                <p>Проверьте правильность введенных данных. Все значения должны быть положительными числами.</p>
            </div>
        `;
} else {
  const serviceTypeName =
    document.getElementById("serviceType").options[
      document.getElementById("serviceType").selectedIndex
    ].text;
  const materialTypeName =
    document.getElementById("materialType").options[
      document.getElementById("materialType").selectedIndex
    ].text;
  const wastePercentage = materialWastePercentages[materialTypeId] * 100;

  resultContainer.innerHTML = `
            <div class="result-success">
                <h4>Результат расчета</h4>
                <p><strong>Тип услуги:</strong> ${serviceTypeName}</p>
                <p><strong>Тип материала:</strong> ${materialTypeName}</p>
                <p><strong>Количество услуг:</strong> ${serviceQuantity}</p>
                <p><strong>Процент перерасхода:</strong> ${wastePercentage}%</p>
                <p><strong>Необходимое количество материала:</strong> <span style="font-size: 1.2em; font-weight: bold; color: #00CED1;">${result} ед.</span></p>
            </div>
        `;
}

function exportToCSV() {
  if (partners.length === 0) {
    alert("Нет данных для экспорта");
    return;
  }

  const headers = [
    "ID",
    "Наименование",
    "Тип",
    "Рейтинг",
    "Адрес",
    "ФИО руководителя",
    "Телефон",
    "Email",
  ];
  const csvContent = [
    headers.join(";"),
    ...partners.map((partner) =>
      [
        partner.id,
        `"${partner.name}"`,
        `"${partner.type}"`,
        partner.rating,
        `"${partner.address}"`,
        `"${partner.director}"`,
        `"${partner.phone}"`,
        `"${partner.email}"`,
      ].join(";")
    ),
  ].join("\r\n");

  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "partners.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
