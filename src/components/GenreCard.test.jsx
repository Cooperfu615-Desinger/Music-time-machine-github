import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import GenreCard from './GenreCard';

const mockItem = {
    genre: 'Test Genre',
    desc: 'Test Description',
    subGenres: ['Sub1', 'Sub2'],
    artists: ['Artist1', 'Artist2'],
};

describe('GenreCard', () => {
    it('renders genre information correctly', () => {
        render(<GenreCard item={mockItem} />);

        expect(screen.getByText('Test Genre')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByText('Artist1')).toBeInTheDocument();
    });

    it('shows sub-genres when clicking the toggle button', () => {
        render(<GenreCard item={mockItem} />);

        // Initially sub-genres should be hidden (or at least not in the main view)
        // Note: The implementation uses CSS visibility/opacity, so we check for the button interaction

        const toggleButton = screen.getByTitle('查看衍生類別');
        fireEvent.click(toggleButton);

        expect(screen.getByText('衍生類別')).toBeInTheDocument();
        expect(screen.getByText('Sub1')).toBeInTheDocument();
    });
});
