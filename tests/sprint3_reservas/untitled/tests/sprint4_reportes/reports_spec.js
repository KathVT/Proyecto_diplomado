/**
 * DIPLOMADO EN INGENIERÍA DE SOFTWARE Y CALIDAD DE SOFTWARE (USFA)
 * SPRINT 4: MÓDULO DE REPORTES E HISTORIAL (PD2-7, PD2-8)
 * ----------------------------------------------------------------------
 * METODOLOGÍA IMPLEMENTADA: ATDD (Acceptance Test-Driven Development)
 * ENFOQUE: Exactitud Funcional y Auditoría (ISO/IEC 25010)
 */

// ======================================================================
// 1. ESPECIFICACIÓN GHERKIN (BDD/ATDD) PARA REQUISITOS DE ACEPTACIÓN
// ======================================================================
/**
 * Feature: Panel de Reportes Estadísticos y Auditoría de Ventas
 *
 *   Scenario: Consolidación exacta de ingresos mensuales sin discrepancias
 *     Given Dado que el Administrador accede al Panel de Control Financiero
 *     And existen transacciones registradas en la pasarela por [100.50, 200.25, 50.12]
 *     When Cuando el sistema genera el reporte consolidado del mes
 *     Then Entonces el total acumulado en el reporte debe ser exactamente $350.87
 *     And no debe existir ninguna discrepancia de centavos o decimales
 */

// ======================================================================
// 2. PRUEBAS DE ACEPTACIÓN AUTOMATIZADAS (ATDD)
// ======================================================================
describe('Pruebas de Aceptación de Negocio (ATDD) - Módulo de Reportes', () => {

    it('PD2-8: Validar exactitud matemática del reporte consolidado contra pasarela de pagos', () => {
        const transaccionesRealesPasarela = [100.50, 200.25, 50.12];
        const totalEsperadoPasarela = transaccionesRealesPasarela.reduce((acc, valor) => acc + valor, 0);

        const reporteSistema = obtenerReporteMensualAdministrador(transaccionesRealesPasarela);

        expect(reporteSistema.totalIngresos).toBe(totalEsperadoPasarela);
        expect(reporteSistema.totalIngresos).toBe(350.87);
    });

    it('PD2-7: Validar ordenamiento cronológico descendente en el historial del cliente', () => {
        const listaReservasSimuladas = [
            { id: 'RES-01', fecha: '2026-06-01' },
            { id: 'RES-02', fecha: '2026-07-01' },
            { id: 'RES-03', fecha: '2026-05-15' }
        ];

        const historialOrdenado = ordenarHistorialCliente(listaReservasSimuladas);

        expect(historialOrdenado[0].id).toBe('RES-02');
        expect(historialOrdenado[1].id).toBe('RES-01');
    });
});

// ======================================================================
// 3. LÓGICA DE NEGOCIO SIMULADA
// ======================================================================
function obtenerReporteMensualAdministrador(transacciones) {
    const sumaInterna = transacciones.reduce((acc, curr) => acc + curr, 0);
    return {
        modulo: "Reportes Administrativos",
        totalIngresos: parseFloat(sumaInterna.toFixed(2)),
        moneda: "USD",
        fechaGeneracion: new Date().toISOString()
    };
}

function ordenarHistorialCliente(reservas) {
    return reservas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}