import axios from "axios";

const API_URL = "http://localhost:8000/chat"; // or your deployed API

export async function sendMessageToBot(message) {
  try {
    const response = await axios.post(API_URL, { message });
    return response.data.response; // expected shape: { response: "..." }
  } catch (error) {
    console.error("API Error:", error);
    return "Sorry, I couldn't connect to the server.";
  }
}
