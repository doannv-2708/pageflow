import React from 'react';

import {EditableText} from 'frontend';

import {render} from '@testing-library/react';
import {renderInEntry} from 'support';
import '@testing-library/jest-dom/extend-expect'

describe('EditableText', () => {
  it('renders class name', () => {
    const value = [{
      type: 'paragraph',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {container} = render(<EditableText value={value} className="some-class" />);

    expect(container.querySelector('.some-class')).toBeInTheDocument()
  });

  it('renders paragraphs', () => {
    const value = [{
      type: 'paragraph',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {getByText} = render(<EditableText value={value} />);

    expect(getByText('Some text')).toBeInTheDocument()
  });

  it('renders block quote', () => {
    const value = [{
      type: 'block-quote',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {getByText} = render(<EditableText value={value} />);

    expect(getByText('Some text')).toBeInTheDocument()
  });

  it('renders headings', () => {
    const value = [{
      type: 'heading',
      children: [
        {text: 'Some Heading'}
      ]
    }];

    const {getByRole} = render(<EditableText value={value} />);

    expect(getByRole('heading')).toHaveTextContent('Some Heading')
  });

  it('renders bulleted lists', () => {
    const value = [{
      type: 'bulleted-list',
      children: [
        {
          type: 'list-item',
          children: [
            {text: 'List item'}
          ]
        }
      ]
    }];

    const {getByRole} = render(<EditableText value={value} />);

    expect(getByRole('listitem')).toHaveTextContent('List item')
  });

  it('renders numbered lists', () => {
    const value = [{
      type: 'numbered-list',
      children: [
        {
          type: 'list-item',
          children: [
            {text: 'List item'}
          ]
        }
      ]
    }];

    const {getByRole} = render(<EditableText value={value} />);

    expect(getByRole('listitem')).toHaveTextContent('List item')
  });

  it('renders links', () => {
    const value = [{
      type: 'paragraph',
      children: [
        {text: 'Find more '},
        {
          type: 'link',
          href: 'https://example.com',
          children: [
            {text: 'here'}
          ]
        },
        {text: '.'}
      ]
    }]

    const {getByRole} = render(<EditableText value={value} />);

    expect(getByRole('link')).toHaveTextContent('here')
    expect(getByRole('link')).toHaveAttribute('href', 'https://example.com')
    expect(getByRole('link')).not.toHaveAttribute('target')
    expect(getByRole('link')).not.toHaveAttribute('rel')
  });

  it('supports rendering links with target blank', () => {
    const value = [{
      type: 'paragraph',
      children: [
        {text: 'Find more '},
        {
          type: 'link',
          href: 'https://example.com',
          openInNewTab: true,
          children: [
            {text: 'here'}
          ]
        },
        {text: '.'}
      ]
    }]

    const {getByRole} = render(<EditableText value={value} />);

    expect(getByRole('link')).toHaveTextContent('here')
    expect(getByRole('link')).toHaveAttribute('target', '_blank')
    expect(getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer')
  });

  it('supports rendering internal chapter links', () => {
    const value = [{
      type: 'paragraph',
      children: [
        {text: 'Find more '},
        {
          type: 'link',
          href: {chapter: 10},
          children: [
            {text: 'here'}
          ]
        },
        {text: '.'}
      ]
    }];
    const seed = {
      chapters: [{id: 1, permaId: 10, configuration: {title: 'The Intro'}}]
    };

    const {getByRole} = renderInEntry(<EditableText value={value} />, {seed});

    expect(getByRole('link')).toHaveTextContent('here')
    expect(getByRole('link')).toHaveAttribute('href', '#the-intro')
    expect(getByRole('link')).not.toHaveAttribute('target')
    expect(getByRole('link')).not.toHaveAttribute('rel')
  });

  it('supports rendering internal section links', () => {
    const value = [{
      type: 'paragraph',
      children: [
        {text: 'Find more '},
        {
          type: 'link',
          href: {section: 10},
          children: [
            {text: 'here'}
          ]
        },
        {text: '.'}
      ]
    }];
    const seed = {
      sections: [{id: 1, permaId: 10}]
    };

    const {getByRole} = renderInEntry(<EditableText value={value} />, {seed});

    expect(getByRole('link')).toHaveTextContent('here')
    expect(getByRole('link')).toHaveAttribute('href', '#section-10')
    expect(getByRole('link')).not.toHaveAttribute('target')
    expect(getByRole('link')).not.toHaveAttribute('rel')
  });

  it('renders zero width no break space in empty leafs to prevent empty paragraphs from collapsing', () => {
    const value = [{
      type: 'paragraph',
      children: [
        {text: ''}
      ]
    }];

    const {container} = render(<EditableText value={value} />);

    expect(container.querySelector('p')).toHaveTextContent('\uFEFF', {normalizeWhitespace: false})
  });

  it('renders zero width no break space in blank leafs to prevent empty paragraphs from collapsing', () => {
    const value = [{
      type: 'paragraph',
      children: [
        {text: '  '}
      ]
    }];

    const {container} = render(<EditableText value={value} />);

    expect(container.querySelector('p')).toHaveTextContent('\uFEFF', {normalizeWhitespace: false})
  });

  it('renders typography variant class names for paragraphs', () => {
    const value = [{
      type: 'paragraph',
      variant: 'highlight',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {container} = render(<EditableText value={value} />);

    expect(container.querySelector('p'))
      .toHaveClass('typography-textBlock-paragraph-highlight');
  });

  it('renders typography variant class names for block quotes', () => {
    const value = [{
      type: 'block-quote',
      variant: 'huge',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {container} = render(<EditableText value={value} />);

    expect(container.querySelector('blockquote'))
      .toHaveClass('typography-textBlock-blockQuote-huge');
  });
});
