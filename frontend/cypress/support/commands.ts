/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Comando personalizado para arrastrar y soltar elementos
       * @param subject - El elemento a arrastrar
       * @param target - El elemento destino
       */
      dragAndDrop(subject: string, target: string): Chainable<Element>
    }
  }
}

Cypress.Commands.add('dragAndDrop', (subject, target) => {
  cy.get(subject).trigger('dragstart');
  cy.get(target).trigger('dragover').trigger('drop');
});

export {}; 