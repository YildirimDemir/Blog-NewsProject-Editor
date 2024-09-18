'use client';

import React, { useEffect, useState } from 'react';

const TestConnectionPage = () => {
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch('/api/test');
        const data = await response.json();
        if (response.ok) {
          setResult(data.message || 'Successfully fetched data');
        } else {
          setResult(`Error: ${data.error}`);
        }
      } catch (error) {
        setResult(`Error: ${(error as Error).message}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div>
      <h1>Test Connection</h1>
      <p>{result}</p>
    </div>
  );
};

export default TestConnectionPage;
