import { marked } from 'marked';
export default {
	async fetch(request, env) {
	  const tasks = [];
	
	  if (request.method === 'POST') {
		const formData = await request.formData();
		const userQuestion = formData.get('question') || '';
		const userModel = formData.get('questionModel') || '';

	  // messages - chat style input
	  let chat = {
		messages: [
		  { role: 'system', content: "You are a helpful assistant." },
		  { role: 'user', content: userQuestion }
		]
	  };
	  let response = await env.AI.run(userModel, chat);
	  const htmlResponse = marked.parse(response.response);
	  tasks.push({ inputs: chat, response });
	  return new Response(htmlResponse, { headers: { 'Content-Type': 'text/html' } });
	}
	return new Response(`
		<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    h1 {
      text-align: center;
      background-color: #333;
      color: #fff;
      padding: 10px 0;
    }
    form {
      max-width: 500px;
      margin: 50px auto;
      padding: 30px;
      background-color: #fff;
      box-shadow: 2px 2px 15px rgba(0,0,0,0.1);
    }
    label {
      font-weight: bold;
      display: block;
      margin-bottom: 8px;
    }
    input[type="text"], select {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 20px;
      box-sizing: border-box;
    }
    input[type="submit"] {
      width: 100%;
      background-color: #5C6BC0;
      color: #fff;
      padding: 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    input[type="submit"]:hover {
      background-color: #7986CB;
    }
    #response {
      max-width: 500px;
      margin: 20px auto;
      padding: 20px;
      background-color: #fff;
      box-shadow: 2px 2px 15px rgba(0,0,0,0.1);
    }
    a {
      display: block;
      text-align: center;
      margin-top: 20px;
      color: #333;
    }
  </style>
</head>
<body>
  <h1>Ai Answerer</h1>
  <form action="" method="POST" id="question-form">
    <label for="questionModel">Select a Model:</label>
    <select id="questionModel" name="questionModel">
      <option value="@hf/thebloke/deepseek-coder-6.7b-instruct-awq">deepseek-coder-6.7b-instruct-awq</option>
      <option value="@cf/meta/llama-3.1-8b-instruct">llama-3.1-8b-instruct</option>
      <option value="@cf/qwen/qwen1.5-14b-chat-awq">qwen1.5-14b-chat-awq</option>
    </select>
    <label for="question">Input a Question:</label>
    <input type="text" id="question" name="question">
    <input type="submit" value="Submit" id="submit-button">
  </form>
  <div id="response"></div>
  <script>
    document.querySelector('#question-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const submitButton = document.getElementById('submit-button');
      submitButton.style.backgroundColor = '#9FA8DA';
      submitButton.disabled = true;
      const response = await fetch('', { method: 'POST', body: formData });
      const data = await response.text();
      document.getElementById('response').innerHTML = data;
      submitButton.style.backgroundColor = '#5C6BC0';
      submitButton.disabled = false;
    });
  </script>
  <a href="https://www.cloudflare.com/" target="_blank">Powered By Cloudflare</a>
</body>
</html>

	  `, { headers: { 'Content-Type': 'text/html' } });
	},
  };