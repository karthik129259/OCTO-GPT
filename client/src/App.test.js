import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from './App';

// Mock axios
jest.mock('axios');

describe('Chat App', () => {
  beforeEach(() => {
    // Clear mock calls between tests
    axios.post.mockClear();
  });

  test('renders chat interface', () => {
    render(<App />);
    expect(screen.getByText('Chat with AI')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });

  test('sends message and displays response', async () => {
    axios.post.mockResolvedValueOnce({ data: { botReply: 'Hello, I am the AI assistant.' } });
    
    render(<App />);
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: 'Send' });

    await userEvent.type(input, 'Hello');
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByText('Hello, I am the AI assistant.')).toBeInTheDocument();
    });
  });

  test('displays error message on API failure', async () => {
    axios.post.mockRejectedValueOnce(new Error('API Error'));
    
    render(<App />);
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: 'Send' });

    await userEvent.type(input, 'Hello');
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to send message. Please try again.')).toBeInTheDocument();
    });
  });

  test('button is disabled when input is empty', () => {
    render(<App />);
    const sendButton = screen.getByRole('button', { name: 'Send' });
    expect(sendButton).toBeDisabled();
  });
});