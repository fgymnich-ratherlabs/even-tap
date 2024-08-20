'use client';

import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const SIGNUP_MUTATION = gql`
  mutation SignUp($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) 
  }
`;

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTATION);

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await signup({ variables: { name: formData.name, email: formData.email, password: formData.password } });
        console.log('User signed up successfully:', response);
        localStorage.setItem('auth-token', response.data.signup);
      } catch (err) {
        console.error('Error during sign up:', err);
      } 
    };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <button type="submit" disabled={loading}>Sign Up</button>
      {error && <p>Error during sign up: {error.message}</p>}
    </form>
  );
}
