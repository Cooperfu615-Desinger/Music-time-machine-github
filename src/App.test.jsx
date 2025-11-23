import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
    it('renders the timeline view by default', () => {
        render(<App />);
        expect(screen.getByText(/探索.*年/)).toBeInTheDocument();
        expect(screen.getByText('音樂時光機')).toBeInTheDocument();
    });

    it('switches years when clicking a year button', () => {
        render(<App />);
        const yearButton = screen.getByText('1980');
        fireEvent.click(yearButton);

        expect(screen.getByText(/探索.*1980.*年/)).toBeInTheDocument();
    });

    it('switches to list view and searches', () => {
        render(<App />);

        const listButton = screen.getByText('百科列表');
        fireEvent.click(listButton);

        expect(screen.getByText('音樂流派百科')).toBeInTheDocument();

        const searchInput = screen.getByPlaceholderText('搜尋流派、關鍵字...');
        fireEvent.change(searchInput, { target: { value: 'Rock' } });

        // Check if results are filtered (this depends on data, but we expect some results)
        expect(screen.getByText(/共找到.*個類別/)).toBeInTheDocument();
    });
});
