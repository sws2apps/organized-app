import React from 'react';
import CongregationSelect from './index';

const country = { code: 'MDG' };
const setCongregation = () => undefined;

describe('Testing CongregationSelect component', () => {
  it('renders', () => {
    cy.mount(<CongregationSelect country={country} setCongregation={setCongregation} />);
  });
});
