import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { gameSchema } from '@/config/schema/game.schema';
import { GameCard } from '@/components/games/GameCard';
import { GameInfo } from '@/components/games/GameInfo';
import { VolatilityIndicator } from '@/components/games/VolatilityIndicator';
import { Button, ButtonLink } from '@/components/ui/Button';
import { fixtureGames } from '../fixtures/games.fixture';

const [lantern, tide, ember] = fixtureGames.map((g) => gameSchema.parse(g));

describe('Button', () => {
  it('is keyboard operable and blocks activation when disabled', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<Button onClick={onClick}>Send</Button>);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Send' })).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);

    rerender(
      <Button onClick={onClick} disabled>
        Send
      </Button>,
    );
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('defaults to type="button" so it never submits a form by accident', () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('renders navigation as a link, not a button', () => {
    render(
      <ButtonLink href="/games" variant="secondary">
        Explore
      </ButtonLink>,
    );
    expect(screen.getByRole('link', { name: 'Explore' })).toHaveAttribute('href', '/games');
  });
});

describe('GameCard', () => {
  it('links to the detail page with meaningful artwork alt text', () => {
    render(<GameCard game={lantern!} placement="home" sizes="100vw" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/games/lantern-quarter');
    expect(screen.getByRole('heading', { name: 'Lantern Quarter' })).toBeInTheDocument();
    expect(screen.getByAltText('Lantern Quarter key art')).toBeInTheDocument();
    expect(screen.getByText(/5 × 3/)).toBeInTheDocument();
    expect(screen.getByText(/243 ways/)).toBeInTheDocument();
  });

  it('marks coming-soon games and omits unconfigured metadata', () => {
    render(<GameCard game={ember!} placement="games" sizes="100vw" />);
    expect(screen.getByText('Coming soon')).toBeInTheDocument();
    render(<GameCard game={tide!} placement="games" sizes="100vw" />);
    expect(screen.getByText('Instant game')).toBeInTheDocument();
  });
});

describe('GameCard', () => {
  it('is one link to the game, with every fact announced', () => {
    render(<GameCard game={lantern!} placement="home" sizes="100vw" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/games/lantern-quarter');
    expect(link).toHaveTextContent('Lantern Quarter');
  });

  it('never leaves a dangling separator when facts are hidden on phones', () => {
    const { container } = render(<GameCard game={lantern!} placement="home" sizes="100vw" />);
    const facts = [...container.querySelectorAll('p > span')];
    // Separators belong to the fact that follows them, so hiding a fact hides its separator.
    expect(facts[0]?.querySelector('[aria-hidden="true"]')).toBeNull();
    for (const fact of facts.slice(1)) expect(fact.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });
});

describe('GameCard (design fixtures)', () => {
  it('presents fixtures like real cards: linked, and without a fixture label outside development', () => {
    const demo = gameSchema.parse({ ...fixtureGames[0], id: 'demo-x', slug: 'demo-x', isDemo: true, status: 'coming-soon' });
    render(<GameCard game={demo} placement="home" sizes="100vw" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/games/demo-x');
    expect(screen.queryByText(/fixture|placeholder|demo/i)).not.toBeInTheDocument();
    expect(screen.queryByText('Coming soon')).not.toBeInTheDocument();
  });
});

describe('GameInfo', () => {
  it('renders configured facts', () => {
    render(<GameInfo game={lantern!} />);
    expect(screen.getByText('RTP')).toBeInTheDocument();
    expect(screen.getByText('96.2%')).toBeInTheDocument();
    expect(screen.getByText('Cascading reels')).toBeInTheDocument();
  });

  it('omits unset fields entirely instead of showing placeholders', () => {
    render(<GameInfo game={ember!} />);
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.queryByText('RTP')).not.toBeInTheDocument();
    expect(screen.queryByText(/N\/A/)).not.toBeInTheDocument();
  });

  it('renders nothing when a game has no information at all', () => {
    const { container } = render(<GameInfo game={tide!} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('VolatilityIndicator', () => {
  it('shows the label and the canonical level', () => {
    const { container } = render(<VolatilityIndicator value="medium-high" />);
    expect(screen.getByText('Medium–high')).toBeInTheDocument();
    expect(container.querySelector('[data-level]')).toHaveAttribute('data-level', '3');
  });
});
