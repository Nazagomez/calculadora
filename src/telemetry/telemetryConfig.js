const { NodeSDK } = require('@opentelemetry/sdk-node');
const { ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { MeterProvider } = require('@opentelemetry/sdk-metrics');
const { PeriodicExportingMetricReader, ConsoleMetricExporter } = require('@opentelemetry/sdk-metrics');
const { Logger } = require('@opentelemetry/api-logs');
const { Counter, Histogram } = require('@opentelemetry/api');

class TelemetryService {
    static init() {
        // Configuración básica
        this.sdk = new NodeSDK({
            resource: new Resource({
                [SemanticResourceAttributes.SERVICE_NAME]: 'calculadora-riesgos',
                [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
            }),
        });

        // Iniciar SDK
        this.sdk.start();

        // Configurar métricas
        this.meterProvider = new MeterProvider();
        this.meterProvider.addMetricReader(
            new PeriodicExportingMetricReader({
                exporter: new ConsoleMetricExporter(),
                exportIntervalMillis: 1000, // export every second
            })
        );
        this.setupMetrics();

        console.log('Telemetría inicializada correctamente');
    }

    static setupMetrics() {
        const meter = this.meterProvider.getMeter('calculadora-metrics');
        
        // Contador de cálculos realizados
        this.calculosCounter = meter.createCounter('calculos_totales', {
            description: 'Número total de cálculos realizados'
        });

        // Histograma para tiempos de respuesta
        this.tiempoRespuestaHistogram = meter.createHistogram('tiempo_respuesta', {
            description: 'Tiempo de respuesta de los cálculos'
        });
    }

    // Métodos de utilidad para registrar métricas
    static incrementarCalculos() {
        this.calculosCounter.add(1);
    }

    static registrarTiempoRespuesta(ms) {
        this.tiempoRespuestaHistogram.record(ms);
    }
}

module.exports = { TelemetryService };