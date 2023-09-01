import * as React from 'react';
import { render, screen } from '@testing-library/react';

import App from './App';
/**
 * https://www.robinwieruch.de/react-testing-library/
 * https://builders.travelperk.com/recipes-to-write-better-jest-tests-with-the-react-testing-library-part-1-670aaf3451d1
 * https://flexiple.com/react/react-testing-library-cheat-sheet/
 */
describe('App', () => {
  it('renders App component', () => {
    render(<App />);
    // screen.debug();
    // fails
    // expect(screen.getByText('Search')).toBeInTheDocument();

    // succeeds
    expect(screen.getByText('Search:')).toBeInTheDocument();

    // succeeds
    expect(screen.getAllByText(/Search/)).toBeTruthy();
  });
});