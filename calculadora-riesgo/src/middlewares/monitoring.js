const { TelemetryService } = require('../telemetry/telemetryConfig');

/**
 * Middleware de monitoreo para registrar métricas de requests
 */
function monitoringMiddleware(req, res, next) {
    const startTime = Date.now();
    
    // Incrementar contador de requests
    TelemetryService.incrementarRequests();
    
    // Interceptar el método res.json para medir tiempo de respuesta
    const originalJson = res.json;
    res.json = function(data) {
        const responseTime = Date.now() - startTime;
        TelemetryService.registrarTiempoRespuesta(responseTime);
        
        // Si hay error en la respuesta, incrementar contador de errores
        if (res.statusCode >= 400) {
            TelemetryService.incrementarErrores();
        }
        
        return originalJson.call(this, data);
    };
    
    next();
}

/**
 * Middleware específico para endpoints de cálculo de riesgo
 */
function riskCalculationMiddleware(req, res, next) {
    const startTime = Date.now();
    
    // Interceptar el método res.json para registrar métricas específicas de cálculo
    const originalJson = res.json;
    res.json = function(data) {
        const responseTime = Date.now() - startTime;
        
        // Solo registrar si es un cálculo exitoso
        if (res.statusCode === 200 && data.score !== undefined) {
            TelemetryService.incrementarCalculos();
            TelemetryService.registrarTiempoRespuesta(responseTime);
        }
        
        return originalJson.call(this, data);
    };
    
    next();
}

module.exports = {
    monitoringMiddleware,
    riskCalculationMiddleware
};
