/**
 * DIPLOMADO EN INGENIERÍA DE SOFTWARE Y CALIDAD DE SOFTWARE (USFA)
 * SPRINT 5: MÓDULO DE CUPONES Y SEGURIDAD (PD2-9, PD2-10)
 * ----------------------------------------------------------------------
 * METODOLOGÍA: Shift-Left (Prevención) & Shift-Right (Monitoreo de Concurrencia)
 * ENFOQUE: Seguridad y Mitigación de Riesgos (ISO/IEC 25010)
 */

// ======================================================================
// 1. ESPECIFICACIÓN GHERKIN (BDD) PARA PREVENCIÓN DE ERRORES (SHIFT-LEFT)
// ======================================================================
/**
 * Feature: Validación de Cupones Promocionales en Pasarela
 *
 *   Scenario: Canje exitoso de cupón de descuento vigente
 *     Given Dado que el cliente se encuentra en la pantalla de pago con un total de $100
 *     And ingresa el código de cupón "PROMO20" que otorga un 20% de descuento
 *     When Cuando el motor valida las reglas de negocio del cupón
 *     Then Entonces el total a pagar debe actualizarse exactamente a $80
 *
 *   Scenario: Mitigación de fraude por sobre-canje concurrente (Shift-Right)
 *     Given Dado que queda únicamente 1 uso disponible para el cupón "LASTONE"
 *     When Cuando dos usuarios intentan aplicar el cupón de manera simultánea
 *     Then Entonces el sistema procesa exitosamente la solicitud del primer usuario
 *     And genera un rechazo controlado y seguro para el segundo usuario sin afectar el inventario
 */


// ======================================================================
// 2. PRUEBAS DE AUTOMATIZACIÓN DE SEGURIDAD Y CONCURRENCIA
// ======================================================================
describe('Pruebas de Concurrencia y Lógica de Cupones (Sprint 5)', () => {

    // Prueba Shift-Left: Lógica matemática del descuento
    it('PD2-9: Debería calcular correctamente el descuento del 20% sobre el monto base', () => {
        const montoBase = 100.00;
        const cuponEstructura = { codigo: "PROMO20", porcentaje: 0.20, activo: true };

        const resultadoPago = procesarAplicacionCupon(montoBase, cuponEstructura);

        expect(resultadoPago.totalConDescuento).toBe(80.00);
        expect(resultadoPago.error).toBeNull();
    });

    // Prueba Shift-Right: Simulación de estrés por concurrencia
    it('PD2-10: Debería rechazar transacciones concurrentes si el stock del cupón llega a cero', () => {
        const cuponConUnUso = { codigo: "LASTONE", usosDisponibles: 1 };

        // Simulación de dos peticiones HTTP concurrentes casi idénticas
        const peticionUsuarioA = { idUsuario: "User_A", timestamp: 1719874800000 };
        const peticionUsuarioB = { idUsuario: "User_B", timestamp: 1719874800005 }; // 5ms después

        const respuestaA = procesarCanjeConcurrente(cuponConUnUso, peticionUsuarioA);
        const respuestaB = procesarCanjeConcurrente(cuponConUnUso, peticionUsuarioB);

        // El primer usuario logra el beneficio
        expect(respuestaA.aplica).toBe(true);
        // El segundo usuario es rechazado de forma segura protegiendo el sistema (Seguridad)
        expect(respuestaB.aplica).toBe(false);
        expect(respuestaB.mensajeError).toBe("El cupón ya no cuenta con usos disponibles");
    });
});


// ======================================================================
// 3. LÓGICA DE CONTROL DEL SISTEMA
// ======================================================================
function procesarAplicacionCupon(total, cupon) {
    if (!cupon.activo) return { totalConDescuento: total, error: "Cupón inactivo" };
    const descuento = total * cupon.porcentaje;
    return { totalConDescuento: total - descuento, error: null };
}

function procesarCanjeConcurrente(cupon, peticion) {
    // Mecanismo de exclusión mutua simulado (Thread-safety / Isolation)
    if (cupon.usosDisponibles > 0) {
        cupon.usosDisponibles--; // Consumir stock de inmediato
        return { usuario: peticion.idUsuario, aplica: true, mensajeError: null };
    } else {
        return { usuario: peticion.idUsuario, aplica: false, mensajeError: "El cupón ya no cuenta con usos disponibles" };
    }
}