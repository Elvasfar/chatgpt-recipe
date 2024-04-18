import React, { useState } from 'react';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState('');
  const [response, setResponse] = useState<any[]>([]); // Initialize with an empty array
  const [isLoading, setIsLoading] = useState(false);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIngredients(e.target.value);
  };

  const handleButtonClick = async () => {
    setIsLoading(true);
    try {
      const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a recipe provider based on provided ingredients." },
          { role: "user", content: ingredients }
        ],
        n: 5,
        temperature: 1,
        max_tokens: 1000,
        stream: false,
        presence_penalty: 2
      };
  
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer sk-proj-DllWOJbGkJNI3wq0eXE2T3BlbkFJi0SAPDmzsqALnJdzGTOx` 
        },
        body: JSON.stringify(requestBody)
      });
  
      if (response.ok) {
        const data = await response.json();
        setResponse(data.choices || []);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setIsLoading(false);
  };
  

  return (
    <div className="App">
      <header className="App-header">
        <h1>ChatGPT RecipeMaker</h1>
      </header>
      <div className="recipemaker-container">
        <h2>Ingredients</h2>
        <input
          type="text"
          value={ingredients}
          onChange={handleInputChange}
          placeholder="Enter ingredients..."
        />
        <button onClick={handleButtonClick}>Get Recipe</button>
        <div className="response-container">
          <h2>Response</h2>
          {isLoading ? (
            <div className="loading-spinner"></div>
          ) : (
            response.map((choice: any) => (
              <div key={choice.index}>
                <h3>Recipe Option {choice.index + 1}</h3>
                <p>{choice.message.content}</p>
              </div>
            ))
          )}
      </div>

      </div>
    </div>
  );
};

export default App;
