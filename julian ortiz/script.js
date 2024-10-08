class UnitConverter {
    constructor() {
        this.conversionRates = {
            longitud: {
                metros: 1,
                kilometros: 0.001,
                millas: 0.000621371,
                pies: 3.28084,
            },
            moneda: {
                usd: 1,
                eur: 0.85,
                cop: 4000, // Tasa de conversión a COP (ejemplo, cambiar según la tasa real)
            },
            temperatura: {
                celsius: 1,
                fahrenheit: (c) => (c * 9 / 5) + 32,
            }
        };

        this.loadConversions();
    }

    loadConversions() {
        const storedConversions = JSON.parse(localStorage.getItem('customConversions')) || [];
        storedConversions.forEach(conversion => {
            if (!this.conversionRates[conversion.type]) {
                this.conversionRates[conversion.type] = {};
            }
            this.conversionRates[conversion.type][conversion.name] = conversion.rate;
        });
        this.updateUnitSelectors();
    }

    addConversion(name, rate, type) {
        if (!this.conversionRates[type]) {
            this.conversionRates[type] = {};
        }
        this.conversionRates[type][name] = rate;

        this.saveConversions(type, name, rate);
        this.updateUnitSelectors();
    }

    saveConversions(type, name, rate) {
        const storedConversions = JSON.parse(localStorage.getItem('customConversions')) || [];
        storedConversions.push({ name, rate, type });
        localStorage.setItem('customConversions', JSON.stringify(storedConversions));
    }

    convert(value, fromUnit, toUnit) {
        if (fromUnit === toUnit) {
            return value;
        }

        const fromType = this.getUnitType(fromUnit);
        const toType = this.getUnitType(toUnit);
        
        if (fromType === toType) {
            if (fromType === 'temperatura') {
                const celsiusValue = fromUnit === 'celsius' ? value : this.convertToCelsius(value, fromUnit);
                return this.convertFromCelsius(celsiusValue, toUnit);
            } else {
                return value * (this.conversionRates[fromType][toUnit] / this.conversionRates[fromType][fromUnit]);
            }
        }
        throw new Error('Conversión no válida,unidades no compatibles');
    }

    getUnitType(unit) {
        for (const type in this.conversionRates) {
            if (this.conversionRates[type][unit]) {
                return type;
            }
        }
        return null;
    }

    convertToCelsius(value, fromUnit) {
        switch (fromUnit) {
            case 'fahrenheit':
                return (value - 32) * 5 / 9;
            default:
                return value;
        }
    }

    convertFromCelsius(value, toUnit) {
        switch (toUnit) {
            case 'fahrenheit':
                return (value * 9 / 5) + 32;
            default:
                return value;
        }
    }

    updateUnitSelectors() {
        const fromUnitSelect = document.getElementById('fromUnit');
        const toUnitSelect = document.getElementById('toUnit');

        fromUnitSelect.innerHTML = '';
        toUnitSelect.innerHTML = '';

        for (const type in this.conversionRates) {
            for (const unit in this.conversionRates[type]) {
                const optionFrom = document.createElement('option');
                optionFrom.value = unit;
                optionFrom.textContent = unit;
                fromUnitSelect.appendChild(optionFrom);

                const optionTo = document.createElement('option');
                optionTo.value = unit;
                optionTo.textContent = unit;
                toUnitSelect.appendChild(optionTo);
            }
        }
    }
}

const converter = new UnitConverter();

document.getElementById('convertBtn').addEventListener('click', () => {
    const value = parseFloat(document.getElementById('value').value);
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;

    try {
        const result = converter.convert(value, fromUnit, toUnit);
        document.getElementById('result').textContent = `Resultado: ${result}`;
    } catch (error) {
        document.getElementById('result').textContent = `Error: ${error.message}`;
    }
});

document.getElementById('clearBtn').addEventListener('click', () => {
    document.getElementById('value').value = '';
    document.getElementById('fromUnit').selectedIndex = 0;
    document.getElementById('toUnit').selectedIndex = 0;
    document.getElementById('result').textContent = '';
});

document.getElementById('addUnitBtn').addEventListener('click', () => {
    const newUnit = document.getElementById('newUnit').value;
    const conversionRate = parseFloat(document.getElementById('conversionRate').value);
    const unitType = document.getElementById('unitType').value;

    if (newUnit && !isNaN(conversionRate)) {
        converter.addConversion(newUnit, conversionRate, unitType);
        alert(`Unidad ${newUnit} añadida con éxito.`);
        document.getElementById('newUnit').value = '';
        document.getElementById('conversionRate').value = '';
    } else {
        alert('Por favor, ingrese un nombre de unidad y una tasa de conversión válidos.');
    }
});
