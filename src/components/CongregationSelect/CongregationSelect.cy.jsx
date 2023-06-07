import React from 'react';
import CongregationSelect from './index';

const country = { code: 'MDG' };
const setCongregation = () => undefined;

describe('Testing CongregationSelect component', () => {
  let congList = [];

  before(() => {
    cy.fixture('congregationList.json').then(function (data) {
      congList = data;
    });
  });

  it('renders', () => {
    cy.mount(<CongregationSelect country={country} setCongregation={setCongregation} />);
  });

  it('renders congregation options list', () => {
    const fetchCongregations = async () => {
      return congList;
    };

    cy.mount(
      <CongregationSelect country={country} setCongregation={setCongregation} fetchCongregations={fetchCongregations} />
    );
    cy.get('input').type('cong');
    cy.get('#select-congregation-listbox').should('be.visible');
  });

  it('allows selecting congregation', () => {
    const fetchCongregations = async () => {
      return congList;
    };

    cy.mount(
      <CongregationSelect country={country} setCongregation={setCongregation} fetchCongregations={fetchCongregations} />
    );

    cy.get('input').type('cong');
    cy.get('#select-congregation-option-0').click();
    cy.get('input').should('have.value', '(201) Congregation A');
  });

  it('allows clearing selected congregation', () => {
    const fetchCongregations = async () => {
      return congList;
    };

    cy.mount(
      <CongregationSelect country={country} setCongregation={setCongregation} fetchCongregations={fetchCongregations} />
    );

    cy.get('input').type('cong');
    cy.get('#select-congregation-option-0').click();
    cy.get('[aria-label=Clear]').click();
    cy.get('input').should('have.value', '');
  });
});
