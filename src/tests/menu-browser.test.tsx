import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MenuBrowser from '@/components/menu/MenuBrowser';
import { getCatalog } from '@/domain/catalog';

const catalog = getCatalog();

describe('MenuBrowser', () => {
  beforeEach(() => {
    render(<MenuBrowser catalog={catalog} />);
  });

  it('lists every dish on first render', () => {
    expect(screen.getByText(`${catalog.products.length} dishes`)).toBeInTheDocument();
  });

  it('narrows to a category when its chip is pressed', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /^Pasta/ }));
    const pastaCount = catalog.products.filter((p) => p.categoryId === 'pasta').length;
    expect(screen.getByText(`${pastaCount} dishes`)).toBeInTheDocument();
  });

  it('searches by ingredient, not only by dish name', async () => {
    const user = userEvent.setup();
    await user.type(screen.getByRole('searchbox'), 'pecorino');
    expect(await screen.findByText('Cacio e pepe')).toBeInTheDocument();
  });

  it('offers a way out of an empty result instead of a dead end', async () => {
    const user = userEvent.setup();
    await user.type(screen.getByRole('searchbox'), 'zzzz-not-a-dish');
    expect(await screen.findByText('Nothing matches that')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /clear filters/i }));
    expect(await screen.findByText(`${catalog.products.length} dishes`)).toBeInTheDocument();
  });

  it('marks a sold-out dish and does not link to it', () => {
    const soldOut = catalog.products.find((p) => !p.available)!;
    const article = screen.getByLabelText(`${soldOut.name}, sold out today`);
    expect(within(article).queryByRole('link')).toBeNull();
    expect(screen.getByText('Sold out today')).toBeInTheDocument();
  });
});
