describe('Position Page', () => {
  beforeEach(() => {
    // Interceptar las llamadas a la API
    cy.intercept('GET', '/positions/*/interviewFlow', {
      statusCode: 200,
      body: {
        interviewFlow: {
          positionName: 'Senior Developer',
          interviewFlow: {
            interviewSteps: [
              { id: 1, name: 'Applied' },
              { id: 2, name: 'Interview' },
              { id: 3, name: 'Offer' },
              { id: 4, name: 'Hired' }
            ]
          }
        }
      }
    }).as('getInterviewFlow');

    cy.intercept('GET', '/positions/*/candidates', {
      statusCode: 200,
      body: [
        {
          candidateId: 1,
          fullName: 'John Doe',
          currentInterviewStep: 'Applied',
          averageScore: 4.5,
          applicationId: 1
        },
        {
          candidateId: 2,
          fullName: 'Jane Smith',
          currentInterviewStep: 'Interview',
          averageScore: 4.8,
          applicationId: 2
        }
      ]
    }).as('getCandidates');

    cy.intercept('PUT', '/candidates/*', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'John Doe',
        currentPhase: 'Interview',
        email: 'john@example.com'
      }
    }).as('updateCandidate');

    // Visitar la página de position
    cy.visit('/positions/1');
  });

  describe('Carga de la Página de Position', () => {
    it('debería mostrar el título de la posición correctamente', () => {
      cy.get('[data-testid="position-title"]')
        .should('be.visible')
        .and('contain', 'Senior Developer');
    });

    it('debería mostrar las columnas de fases correctamente', () => {
      cy.get('[data-testid="phase-column"]').should('have.length', 4);
      cy.get('[data-testid="phase-column"]').eq(0).should('contain', 'Applied');
      cy.get('[data-testid="phase-column"]').eq(1).should('contain', 'Interview');
      cy.get('[data-testid="phase-column"]').eq(2).should('contain', 'Offer');
      cy.get('[data-testid="phase-column"]').eq(3).should('contain', 'Hired');
    });

    it('debería mostrar las tarjetas de candidatos en las columnas correctas', () => {
      cy.get('[data-testid="phase-column"]').eq(0)
        .find('[data-testid="candidate-card"]')
        .should('contain', 'John Doe');

      cy.get('[data-testid="phase-column"]').eq(1)
        .find('[data-testid="candidate-card"]')
        .should('contain', 'Jane Smith');
    });
  });

  describe('Cambio de Fase de un Candidato', () => {
    /**
     * NOTA IMPORTANTE:
     * Cypress (y la mayoría de frameworks de testing E2E) no soportan de forma confiable
     * el drag and drop con react-beautiful-dnd debido a la complejidad de los eventos nativos
     * que utiliza esta librería. Se han probado comandos personalizados, @4tw/cypress-drag-drop
     * y cypress-real-events sin éxito. Por lo tanto, esta prueba se deja como referencia y
     * se recomienda realizar la validación de drag and drop de forma manual.
     * Más información: https://github.com/atlassian/react-beautiful-dnd/issues/2399
     */
    it.skip('debería permitir arrastrar y soltar una tarjeta de candidato entre columnas', () => {
      // Esperar a que las columnas estén cargadas
      cy.get('[data-testid="phase-column"]').should('have.length', 4);

      // Usar cypress-real-events para simular drag and drop real
      // @ts-ignore
      cy.get('[data-testid="candidate-card"]')
        .contains('John Doe')
        // @ts-ignore
        .realMouseDown();

      // @ts-ignore
      cy.get('[data-testid="phase-column"]')
        .eq(1)
        // @ts-ignore
        .realMouseMove()
        // @ts-ignore
        .realMouseUp();

      // Esperar a que se complete la animación
      cy.wait(1000);

      // Verificar que la tarjeta se movió a la nueva columna
      cy.get('[data-testid="phase-column"]').eq(1)
        .find('[data-testid="candidate-card"]')
        .should('contain', 'John Doe');

      // Verificar que se realizó la llamada al API
      cy.wait('@updateCandidate').its('request.body').should('deep.include', {
        currentInterviewStep: 2
      });
    });
  });
}); 