class CategoriaConversion {
    constructor(nombre, unidades = {}) {
      this.nombre = nombre;
      this.unidades = unidades;
      this.cargarDesdeLocalStorage();
    }
  
    cargarDesdeLocalStorage() {
      const unidadesGuardadas = JSON.parse(localStorage.getItem(`${this.nombre}Unidades`));
      if (unidadesGuardadas) {
        this.unidades = unidadesGuardadas;
      }
    }
  
    guardarEnLocalStorage() {
      localStorage.setItem(`${this.nombre}Unidades`, JSON.stringify(this.unidades));
    }
  
    agregarUnidad(nombre, factor) {
      this.unidades[nombre] = factor;
      this.guardarEnLocalStorage();
    }
  
    convertir(valor, desdeUnidad, hastaUnidad) {
      return (valor * this.unidades[desdeUnidad]) / this.unidades[hastaUnidad];
    }
  
    poblarSelect(selectId) {
      const selectElement = document.getElementById(selectId);
      selectElement.innerHTML = '';
      Object.keys(this.unidades).forEach(unidad => {
        selectElement.innerHTML += `<option value="${unidad}">${unidad}</option>`;
      });
    }
  }
  
  class ConversorTemperatura extends CategoriaConversion {
    constructor() {
      super('temperatura', {
        celsius: 1,
        fahrenheit: (valor) => (valor - 32) * 5 / 9,
        kelvin: (valor) => valor - 273.15
      });
    }
  
    convertirTemperatura(valor, desdeUnidad, hastaUnidad) {
      let valorEnCelsius;
  
      if (desdeUnidad === 'celsius') {
        valorEnCelsius = valor;
      } else if (desdeUnidad === 'fahrenheit') {
        valorEnCelsius = (valor - 32) * 5 / 9;
      } else {
        valorEnCelsius = valor - 273.15;
      }
  
      if (hastaUnidad === 'celsius') {
        return valorEnCelsius;
      } else if (hastaUnidad === 'fahrenheit') {
        return (valorEnCelsius * 9 / 5) + 32;
      } else {
        return valorEnCelsius + 273.15;
      }
    }
  }
  
  class AppConversor {
    constructor() {
      this.conversorLongitud = new CategoriaConversion('longitud', { metro: 1, kilometro: 1000, centimetro: 0.01 });
      this.conversorPeso = new CategoriaConversion('peso', { kilogramo: 1, gramo: 0.001, libra: 0.453592 });
      this.conversorTemperatura = new ConversorTemperatura();
      this.conversorMoneda = new CategoriaConversion('moneda', { USD: 1, EUR: 0.85, JPY: 110 });
  
      this.poblarTodosLosSelects();
      this.asignarEventos();
    }
  
    poblarTodosLosSelects() {
      this.conversorLongitud.poblarSelect('longitudDesde');
      this.conversorLongitud.poblarSelect('longitudHasta');
      this.conversorPeso.poblarSelect('pesoDesde');
      this.conversorPeso.poblarSelect('pesoHasta');
      this.conversorTemperatura.poblarSelect('temperaturaDesde');
      this.conversorTemperatura.poblarSelect('temperaturaHasta');
      this.conversorMoneda.poblarSelect('monedaDesde');
      this.conversorMoneda.poblarSelect('monedaHasta');
    }
  
    asignarEventos() {
      
      document.getElementById('btnConvertirLongitud').addEventListener('click', () => {
        const valor = parseFloat(document.getElementById('longitudValor').value);
        const desdeUnidad = document.getElementById('longitudDesde').value;
        const hastaUnidad = document.getElementById('longitudHasta').value;
        const resultado = this.conversorLongitud.convertir(valor, desdeUnidad, hastaUnidad);
        document.getElementById('resultadoLongitud').innerText = resultado;
      });
  
      
      document.getElementById('btnConvertirPeso').addEventListener('click', () => {
        const valor = parseFloat(document.getElementById('pesoValor').value);
        const desdeUnidad = document.getElementById('pesoDesde').value;
        const hastaUnidad = document.getElementById('pesoHasta').value;
        const resultado = this.conversorPeso.convertir(valor, desdeUnidad, hastaUnidad);
        document.getElementById('resultadoPeso').innerText = resultado;
      });
  
      
      document.getElementById('btnConvertirTemperatura').addEventListener('click', () => {
        const valor = parseFloat(document.getElementById('temperaturaValor').value);
        const desdeUnidad = document.getElementById('temperaturaDesde').value;
        const hastaUnidad = document.getElementById('temperaturaHasta').value;
        const resultado = this.conversorTemperatura.convertirTemperatura(valor, desdeUnidad, hastaUnidad);
        document.getElementById('resultadoTemperatura').innerText = resultado;
      });
  
     
      document.getElementById('btnConvertirMoneda').addEventListener('click', () => {
        const valor = parseFloat(document.getElementById('monedaValor').value);
        const desdeUnidad = document.getElementById('monedaDesde').value;
        const hastaUnidad = document.getElementById('monedaHasta').value;
        const resultado = this.conversorMoneda.convertir(valor, desdeUnidad, hastaUnidad);
        document.getElementById('resultadoMoneda').innerText = resultado;
      });
  
      
      document.getElementById('btnAgregarUnidad').addEventListener('click', () => {
        const nombreUnidad = document.getElementById('nuevaUnidadNombre').value.trim();
        const factorConversion = parseFloat(document.getElementById('nuevaUnidadFactor').value);
        const categoria = document.getElementById('nuevaUnidadCategoria').value;
  
        if (nombreUnidad && factorConversion) {
          if (categoria === 'longitud') {
            this.conversorLongitud.agregarUnidad(nombreUnidad, factorConversion);
          } else if (categoria === 'peso') {
            this.conversorPeso.agregarUnidad(nombreUnidad, factorConversion);
          } else if (categoria === 'moneda') {
            this.conversorMoneda.agregarUnidad(nombreUnidad, factorConversion);
          }
          alert('Nueva unidad añadida correctamente.');
          this.poblarTodosLosSelects();
        } else {
          alert('Por favor, complete todos los campos.');
        }
      });
  
      
      document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
          document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
          e.target.classList.add('active');
  
          const seccionObjetivo = e.target.getAttribute('data-tab');
          document.querySelectorAll('.conversion-section').forEach(seccion => seccion.classList.remove('active'));
          document.getElementById(seccionObjetivo).classList.add('active');
        });
      });
    }
  }
  
  
  new AppConversor();
  