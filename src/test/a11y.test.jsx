import { render, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import LogActivity from '../pages/LogActivity';
import Challenges from '../pages/Challenges';
import InsightsPanel from '../components/InsightsPanel';
import NotFound from '../pages/NotFound';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('Dashboard should have no accessibility violations', async () => {
    let container;
    await act(async () => {
      const result = render(
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      );
      container = result.container;
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('LogActivity should have no accessibility violations', async () => {
    let container;
    await act(async () => {
      const result = render(
        <MemoryRouter>
          <LogActivity />
        </MemoryRouter>
      );
      container = result.container;
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Challenges should have no accessibility violations', async () => {
    let container;
    await act(async () => {
      const result = render(
        <MemoryRouter>
          <Challenges />
        </MemoryRouter>
      );
      container = result.container;
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('InsightsPanel should have no accessibility violations', async () => {
    let container;
    await act(async () => {
      const result = render(<InsightsPanel />);
      container = result.container;
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('NotFound should have no accessibility violations', async () => {
    let container;
    await act(async () => {
      const result = render(
        <MemoryRouter>
          <NotFound />
        </MemoryRouter>
      );
      container = result.container;
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});
