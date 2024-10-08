class UnitConverter {
    constructor() {
      this.units = {
        length: {
          meter: 1,
          kilometer: 1000,
          centimeter: 0.01,
          inch: 0.0254,
        },
        weight: {
          kilogram: 1,
          gram: 0.001,
          pound: 0.453592,
          ounce: 0.0283495,
        },
        temperature: {
          celsius: 1,
          fahrenheit: (val) => (val - 32) * 5 / 9,
          kelvin: (val) => val - 273.15,
        },
        currency: {
          usd: 1,
          eur: 0.85,
        }
      };
  
      // este es el LocalStorage
      this.loadUnits();
      this.init();
    }
  
    loadUnits() {
      const storedUnits = JSON.parse(localStorage.getItem('unitConversions'));
      if (storedUnits) {
        this.units = storedUnits;
      }
    }
  
    init() {
      this.populateSelectBoxes();
      this.attachEventListeners();
    }
  
    populateSelectBoxes() {
      this.populateSelectBox('lengthFromUnit', 'length');
      this.populateSelectBox('lengthToUnit', 'length');
      this.populateSelectBox('weightFromUnit', 'weight');
      this.populateSelectBox('weightToUnit', 'weight');
      this.populateSelectBox('temperatureFromUnit', 'temperature');
      this.populateSelectBox('temperatureToUnit', 'temperature');
      this.populateSelectBox('currencyFromUnit', 'currency');
      this.populateSelectBox('currencyToUnit', 'currency');
    }
  
    populateSelectBox(selectId, category) {
      const selectElement = document.getElementById(selectId);
      selectElement.innerHTML = '';
      Object.keys(this.units[category]).forEach(unit => {
        selectElement.innerHTML += `<option value="${unit}">${unit}</option>`;
      });
    }
  
    convertLength() {
      const inputValue = parseFloat(document.getElementById('lengthInputValue').value);
      const fromUnit = document.getElementById('lengthFromUnit').value;
      const toUnit = document.getElementById('lengthToUnit').value;
  
      const result = (inputValue * this.units.length[fromUnit]) / this.units.length[toUnit];
      document.getElementById('lengthResult').innerText = result;
    }
  
    convertWeight() {
      const inputValue = parseFloat(document.getElementById('weightInputValue').value);
      const fromUnit = document.getElementById('weightFromUnit').value;
      const toUnit = document.getElementById('weightToUnit').value;
  
      const result = (inputValue * this.units.weight[fromUnit]) / this.units.weight[toUnit];
      document.getElementById('weightResult').innerText = result;
    }
  
    convertTemperature() {
      const inputValue = parseFloat(document.getElementById('temperatureInputValue').value);
      const fromUnit = document.getElementById('temperatureFromUnit').value;
      const toUnit = document.getElementById('temperatureToUnit').value;
  
      let valueInCelsius;
  
      
      if (fromUnit === 'celsius') {
        valueInCelsius = inputValue;
      } else if (fromUnit === 'fahrenheit') {
        valueInCelsius = (inputValue - 32) * 5 / 9;
      } else if (fromUnit === 'kelvin') {
        valueInCelsius = inputValue + 273.15;
      }
  
      
      let result;
      if (toUnit === 'celsius') {
        result = valueInCelsius;
      } else if (toUnit === 'fahrenheit') {
        result = (valueInCelsius * 9 / 5) + 32;
      } else if (toUnit === 'kelvin') {
        result = valueInCelsius - 273.15;
      }
  
      document.getElementById('temperatureResult').innerText = result;
    }
  
    convertCurrency() {
      const inputValue = parseFloat(document.getElementById('currencyInputValue').value);
      const fromUnit = document.getElementById('currencyFromUnit').value;
      const toUnit = document.getElementById('currencyToUnit').value;
  
      const result = (inputValue * this.units.currency[fromUnit]) / this.units.currency[toUnit];
      document.getElementById('currencyResult').innerText = result;
    }
  
    addNewConversion() {
      const unitName = document.getElementById('newUnitName').value.trim();
      const conversionFactor = parseFloat(document.getElementById('newUnitFactor').value);
      const category = document.getElementById('newUnitCategory').value;
  
      if (unitName && conversionFactor) {
        this.units[category][unitName] = conversionFactor;
        this.saveToLocalStorage();
        this.populateSelectBoxes();
        alert('Nueva conversión agregada exitosamente.');
      } else {
        alert('Por favor, complete todos los campos correctamente.');
      }
    }
  
    saveToLocalStorage() {
      localStorage.setItem('unitConversions', JSON.stringify(this.units));
    }
  
    attachEventListeners() {
      document.getElementById('lengthConvertBtn').addEventListener('click', () => this.convertLength());
      document.getElementById('weightConvertBtn').addEventListener('click', () => this.convertWeight());
      document.getElementById('temperatureConvertBtn').addEventListener('click', () => this.convertTemperature());
      document.getElementById('currencyConvertBtn').addEventListener('click', () => this.convertCurrency());
      document.getElementById('addConversionBtn').addEventListener('click', () => this.addNewConversion());
    }
  }
  
  
  const converter = new UnitConverter();
  