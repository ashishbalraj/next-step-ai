from flask import Blueprint, request, jsonify
from groq import Groq
import os

chatbot_routes = Blueprint("chatbot_routes", __name__)


client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

@chatbot_routes.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")

    if not user_message.strip():
        return jsonify({"reply": "Please enter a message."})

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": """
You are NextStep AI, a professional career assistant.

Rules:
1. Use Markdown formatting.
2. Use ## headings for sections.
3. Use **bold text** for important points.
4. Use bullet points and numbered lists wherever appropriate.
5. Keep answers short, clear, and professional.
6. Leave blank lines between sections.
7. Avoid very long paragraphs.
8. Format responses for beautiful website display.
9. Give concise answers unless the user asks for detailed explanations.
"""
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ]
        )

        reply = response.choices[0].message.content

        return jsonify({"reply": reply})

    except Exception as e:
        import traceback
        traceback.print_exc()

        return jsonify({
            "reply": f"Error: {str(e)}"
        })