// Коэффициенты типов услуг
const serviceTypeCoefficients = {
  1: 0.5, // Стирка
  2: 0.8, // Химчистка
  3: 0.3, // Ремонт
};

// Проценты перерасхода по типам материалов
const materialWastePercentages = {
  1: 0.1, // Моющее средство - 10%
  2: 0.15, // Растворитель - 15%
  3: 0.05, // Отбеливатель - 5%
  4: 0.02, // Пакеты - 2%
  5: 0.01, // Теги-ярлыки - 1%
};

/**
 * @param {number} serviceTypeId - идентификатор типа услуги
 * @param {number} materialTypeId - идентификатор типа материала
 * @param {number} serviceQuantity - количество выполняемых услуг
 * @param {number} productWeight - вес изделия (кг)
 * @param {number} stainArea - площадь загрязнения (м²)
 * @returns {number} количество необходимого материала или -1 при ошибке
 */
function calculateMaterialQuantity(
  serviceTypeId,
  materialTypeId,
  serviceQuantity,
  productWeight,
  stainArea
) {
  // Проверка входных параметров
  if (
    !serviceTypeCoefficients[serviceTypeId] ||
    !materialWastePercentages[materialTypeId]
  ) {
    return -1;
  }

  if (serviceQuantity <= 0 || productWeight <= 0 || stainArea <= 0) {
    return -1;
  }

  if (
    !Number.isInteger(serviceTypeId) ||
    !Number.isInteger(materialTypeId) ||
    !Number.isInteger(serviceQuantity)
  ) {
    return -1;
  }

  // Расчет количества материала на одну услугу
  const materialPerService =
    productWeight * stainArea * serviceTypeCoefficients[serviceTypeId];

  const totalMaterialWithoutWaste = materialPerService * serviceQuantity;

  // Учет перерасхода
  const wastePercentage = materialWastePercentages[materialTypeId];
  const totalMaterialWithWaste =
    totalMaterialWithoutWaste * (1 + wastePercentage);

  return Math.ceil(totalMaterialWithWaste);
}

function calculateMaterials() {
  const serviceTypeId = parseInt(document.getElementById("serviceType").value);
  const materialTypeId = parseInt(
    document.getElementById("materialType").value
  );
  const serviceQuantity = parseInt(
    document.getElementById("serviceQuantity").value
  );
  const productWeight = parseFloat(
    document.getElementById("productWeight").value
  );
  const stainArea = parseFloat(document.getElementById("stainArea").value);

  const result = calculateMaterialQuantity(
    serviceTypeId,
    materialTypeId,
    serviceQuantity,
    productWeight,
    stainArea
  );

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
                <p><strong>Вес изделия:</strong> ${productWeight} кг</p>
                <p><strong>Площадь загрязнения:</strong> ${stainArea} м²</p>
                <p><strong>Процент перерасхода:</strong> ${wastePercentage}%</p>
                <p><strong>Необходимое количество материала:</strong> <span style="font-size: 1.2em; font-weight: bold; color: #00CED1;">${result} ед.</span></p>
            </div>
        `;
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { calculateMaterialQuantity, calculateMaterials };
}
