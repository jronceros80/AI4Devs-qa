// Importar los comandos personalizados
import './commands';
import '@4tw/cypress-drag-drop';
import 'cypress-real-events/support';

// Configuración global de Cypress
beforeEach(() => {
  // Limpiar el localStorage antes de cada prueba
  cy.clearLocalStorage();
  
  // Limpiar las cookies antes de cada prueba
  cy.clearCookies();
});

// Configuración para manejar errores no capturados
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retornar false para evitar que Cypress falle la prueba
  return false;
}); 