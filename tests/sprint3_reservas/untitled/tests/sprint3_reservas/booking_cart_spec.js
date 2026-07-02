/**
 * DIPLOMADO EN INGENIERÍA DE SOFTWARE Y CALIDAD DE SOFTWARE (USFA)
 * SPRINT 3: MÓDULO DE RESERVAS Y CARRITO DE COMPRAS (PD2-5, PD2-6)
 * ----------------------------------------------------------------------
 * METODOLOGÍAS DE PRUEBA: ATDD, BDD (Gherkin) y TDD (Pruebas Unitarias)
 */

// ======================================================================
// 1. CRITERIO DE ACEPTACIÓN GLOBAL (ATDD)
// ======================================================================
// El negocio exige que el carrito de compras consolide los montos de
// múltiples servicios turísticos de forma exacta aplicando un 10% de tasas,
// y que mantenga la persistencia de los datos ante cierres imprevistos de sesión.


// ======================================================================
// 2. ESPECIFICACIÓN DE ESCENARIOS BDD (GHERKIN)
// ======================================================================
/**
 * Feature: Gestión de Reservas y Persistencia del Carrito de Compras
 *
 *   Scenario: Cálculo exitoso del monto total acumulado con impuestos
 *     Given Dado que la cliente "Kathya Villanueva" tiene una sesión activa
 *     And agrega un servicio de Vuelo por $100 y un servicio de Hotel por $200
 *     When Cuando el motor de reservas procesa el desglose del carrito
 *     Then Entonces el sistema debe retornar un monto total calculado de $330
 *
 *   Scenario: Resiliencia y tolerancia a fallos del carrito de compras
 *     Given Dado que la cliente ha consolidado servicios en su carrito de compras
 *     When Cuando ocurre una interrupción brusca de red o recarga del navegador
 *     Then Entonces los elementos agregados deben persistir intactos si se reingresa antes de 30 minutos
 */


// ======================================================================
// 3. SUITE DE PRUEBAS UNITARIAS - ENFOQUE TDD
// ======================================================================

// [FASE TDD: RED] - Estructura de pruebas unitarias que guían el desarrollo de la lógica
describe('Suite de Pruebas Unitarias (TDD) - Ciclo de Reservas', () => {

    // Validación unitaria del cálculo (Enfoque BDD reflejado en código)
    it('Debería calcular exactamente $330 para un subtotal de $300 con 10% de tasa impositiva', () => {
        // Arreglar (Given)
        const itemsEnCarrito = [
            { servicio: 'Vuelo Regular', precio: 100 },
            { servicio: 'Estadía Hotel', precio: 200 }
        ];
        const tasaImpuesto = 0.10; // 10%

        // Actuar (When) - Ejecución de la función desarrollada bajo ciclo TDD
        const totalCalculado = calcularMontoTotalCarrito(itemsEnCarrito, tasaImpuesto);

        // Afirmar (Then)
        expect(totalCalculado).toBe(330);
    });

    // Validación unitaria de Resiliencia (Tolerancia a fallos - ISO/IEC 25010)
    it('Debería retornar TRUE (persistir) si el tiempo de desconexión no supera los 30 minutos', () => {
        // Arreglar (Given)
        const sessionCarrito = { estado: 'Pendiente', idCliente: 'KV' };
        const tiempoInactividadMinutos = 15; // Simulación de caída de red por 15 min

        // Actuar (When)
        const mantenerDatos = verificarPersistenciaCarrito(sessionCarrito, tiempoInactividadMinutos);

        // Afirmar (Then)
        expect(mantenerDatos).toBe(true);
    });
});


// ======================================================================
// 4. LÓGICA DE NEGOCIO (Código fuente generado para pasar el TDD a GREEN)
// ======================================================================

function calcularMontoTotalCarrito(items, impuesto) {
    // Fase inicial RED fallaba por propiedad incorrecta. Corregido en GREEN:
    const totalBase = items.reduce((acumulador, item) => acumulador + item.precio, 0);
    return totalBase + (totalBase * impuesto);
}

function verificarPersistenciaCarrito(carrito, minutosTranscurridos) {
    const TIEMPO_LIMITE_MINUTOS = 30;
    // Si la interrupción es menor o igual al límite, los datos se preservan en caché/DB
    return minutosTranscurridos <= TIEMPO_LIMITE_MINUTOS;
}