const { TelemetryService } = require('./telemetryConfig');

// Función de prueba simple
async function probarTelemetria() {
    console.log('Iniciando prueba de telemetría...');

    // Inicializar telemetría
    TelemetryService.init();

    // Simular algunos cálculos
    for(let i = 0; i < 5; i++) {
        const inicioTiempo = performance.now();
        
        // Simular una operación
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Registrar métricas
        TelemetryService.incrementarCalculos();
        TelemetryService.registrarTiempoRespuesta(performance.now() - inicioTiempo);
        
        console.log(`Cálculo ${i + 1} completado`);
    }

    console.log('Prueba de telemetría completada');
}

// Ejecutar la prueba
probarTelemetria().catch(console.error);
