const { NodeSDK } = require('@opentelemetry/sdk-node');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

class TelemetryService {
    static init() {
        // Configuración básica
        this.sdk = new NodeSDK({
            resource: resourceFromAttributes({
                [SemanticResourceAttributes.SERVICE_NAME]: 'calculadora-riesgos-backend',
                [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
            }),
        });

        // Iniciar SDK
        this.sdk.start();

        // Inicializar contadores simples
        this.calculosCount = 0;
        this.requestsCount = 0;
        this.errorsCount = 0;
        this.responseTimes = [];

        console.log('Telemetría del backend inicializada correctamente');
    }

    // Métodos de utilidad para registrar métricas
    static incrementarCalculos() {
        this.calculosCount++;
        console.log(`[TELEMETRÍA] Cálculos realizados: ${this.calculosCount}`);
    }

    static registrarTiempoRespuesta(ms) {
        this.responseTimes.push(ms);
        if (this.responseTimes.length > 100) {
            this.responseTimes = this.responseTimes.slice(-100); // Mantener solo los últimos 100
        }
        console.log(`[TELEMETRÍA] Tiempo de respuesta: ${ms}ms`);
    }

    static incrementarErrores() {
        this.errorsCount++;
        console.log(`[TELEMETRÍA] Errores totales: ${this.errorsCount}`);
    }

    static incrementarRequests() {
        this.requestsCount++;
        console.log(`[TELEMETRÍA] Requests totales: ${this.requestsCount}`);
    }

    static getStats() {
        const avgResponseTime = this.responseTimes.length > 0 
            ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length 
            : 0;
        
        return {
            calculos: this.calculosCount,
            requests: this.requestsCount,
            errores: this.errorsCount,
            tiempoPromedioRespuesta: Math.round(avgResponseTime),
            ultimosTiempos: this.responseTimes.slice(-10)
        };
    }
}

module.exports = { TelemetryService };