import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { MeterProvider } from '@opentelemetry/sdk-metrics';
import { PeriodicExportingMetricReader, ConsoleMetricExporter } from '@opentelemetry/sdk-metrics';
import { Logger } from '@opentelemetry/api-logs';
import { Counter, Histogram } from '@opentelemetry/api';

export class TelemetryService {
    private static sdk: NodeSDK;
    private static meterProvider: MeterProvider;
    private static logger: Logger;
    private static calculosCounter: Counter;
    private static tiempoRespuestaHistogram: Histogram;

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

    private static setupMetrics() {
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

    static registrarTiempoRespuesta(ms: number) {
        this.tiempoRespuestaHistogram.record(ms);
}
}
