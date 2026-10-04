import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CriteriaForm } from '@/components/app/CriteriaForm';
import { NameCard } from '@/components/app/NameCard';
import { Sheet } from '@/components/ui/Sheet';
import { defaultCriteria, type GeneratedName } from '@/lib/engine/contracts';

const sampleName: GeneratedName = {
  name: 'Novatera',
  components: [
    { text: 'nova', meaning: 'new', position: 'root' },
    { text: 'tera', meaning: 'earth', position: 'suffix' },
  ],
  syllableCount: 4,
  phonetic: 'no-va-te-ra',
  score: 82,
  rationale: ['Evokes space', 'soft phonetics'],
  tags: ['coined', 'space', 'classical'],
  style: 'coined',
  field: 'space',
  origin: 'classical',
};

describe('CriteriaForm', () => {
  it('renders the generate button', () => {
    render(
      <CriteriaForm
        criteria={defaultCriteria()}
        onChange={() => {}}
        onGenerate={() => {}}
        onReset={() => {}}
        onLoadSample={() => {}}
        loading={false}
        resultCount={0}
        truncated={false}
      />,
    );
    expect(screen.getByRole('button', { name: /generate names/i })).toBeInTheDocument();
  });

  it('calls onGenerate on submit', () => {
    const onGen = vi.fn();
    render(
      <CriteriaForm
        criteria={defaultCriteria()}
        onChange={() => {}}
        onGenerate={onGen}
        onReset={() => {}}
        onLoadSample={() => {}}
        loading={false}
        resultCount={0}
        truncated={false}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /generate names/i }));
    expect(onGen).toHaveBeenCalledTimes(1);
  });
});

describe('NameCard', () => {
  it('renders name and score', () => {
    render(
      <NameCard
        item={sampleName}
        index={0}
        favorite={false}
        onToggleFavorite={() => {}}
        onCopy={() => {}}
      />,
    );
    expect(screen.getByText('Novatera')).toBeInTheDocument();
    expect(screen.getByText('82')).toBeInTheDocument();
  });

  it('expands breakdown on click', () => {
    render(
      <NameCard
        item={sampleName}
        index={0}
        favorite={false}
        onToggleFavorite={() => {}}
        onCopy={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /why this name/i }));
    expect(screen.getByText(/nova/)).toBeInTheDocument();
  });
});

describe('CriteriaForm collapsible sections (mobile-first)', () => {
  it('keeps advanced groups collapsed until tapped', () => {
    render(
      <CriteriaForm
        criteria={defaultCriteria()}
        onChange={() => {}}
        onGenerate={() => {}}
        onReset={() => {}}
        onLoadSample={() => {}}
        loading={false}
        resultCount={0}
        truncated={false}
      />,
    );
    const soundToggle = screen.getByRole('button', { name: /sound/i });
    expect(soundToggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(soundToggle);
    expect(soundToggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('checkbox', { name: /alliteration/i })).toBeInTheDocument();
  });

  it('namespaces control ids so the form can mount twice', () => {
    const { container } = render(
      <>
        <CriteriaForm
          idPrefix="sheet"
          criteria={defaultCriteria()}
          onChange={() => {}}
          onGenerate={() => {}}
          onReset={() => {}}
          onLoadSample={() => {}}
          loading={false}
          resultCount={0}
          truncated={false}
          showSubmit={false}
        />
        <CriteriaForm
          idPrefix="desk"
          criteria={defaultCriteria()}
          onChange={() => {}}
          onGenerate={() => {}}
          onReset={() => {}}
          onLoadSample={() => {}}
          loading={false}
          resultCount={0}
          truncated={false}
        />
      </>,
    );
    const ids = Array.from(container.querySelectorAll('[id]')).map((el) => el.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(container.querySelector('#sheet-form')).not.toBeNull();
    expect(container.querySelector('#desk-form')).not.toBeNull();
  });
});

describe('Sheet', () => {
  it('renders content and closes on Escape', () => {
    const onClose = vi.fn();
    render(
      <Sheet open onClose={onClose} title="Refine your name">
        <p>sheet body</p>
      </Sheet>,
    );
    expect(screen.getByRole('dialog', { name: /refine your name/i })).toBeInTheDocument();
    expect(screen.getByText('sheet body')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders nothing when closed', () => {
    render(
      <Sheet open={false} onClose={() => {}} title="Hidden sheet">
        <p>hidden body</p>
      </Sheet>,
    );
    expect(screen.queryByText('hidden body')).toBeNull();
  });
});
